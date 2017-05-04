//
//  ViewController.swift
//  Travel_Melb_Project_Rebased
//
//  Created by DansMacBook on 28/4/17.
//  Copyright © 2017 DansMacBook. All rights reserved.
//

import UIKit
import PXGoogleDirections
import GoogleMaps



class ViewController: BaseViewController {
    
    @IBOutlet weak var mapView: GMSMapView!
    var locationManager = CLLocationManager()
    var currentLocation: CLLocation?
    //var mapView: GMSMapView!
    //var placesClient: GMSPlacesClient!
    var zoomLevel: Float = 15.0
    
    @IBOutlet weak var resultsButton: UIButton!
    
    @IBOutlet weak var buttonTest: UIButton!
    
    let defaultLocation = CLLocation(latitude: -33.869405, longitude: 151.199)
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.addSlideMenuButton()
        mapView.delegate = self
        
        
        
        
        
        resultsButton.bringSubview(toFront: resultsButton)
        
        // Initialize the location manager.
        locationManager = CLLocationManager()
        locationManager.desiredAccuracy = kCLLocationAccuracyBest
        locationManager.requestAlwaysAuthorization()
        locationManager.distanceFilter = 50
        locationManager.startUpdatingLocation()
        locationManager.delegate = self as? CLLocationManagerDelegate
        
        // placesClient = GMSPlacesClient.shared()
        
        // Create a map.
        let camera = GMSCameraPosition.camera(withLatitude: defaultLocation.coordinate.latitude,
                                              longitude: defaultLocation.coordinate.longitude,
                                              zoom: zoomLevel)
        //mapView = GMSMapView.map(withFrame: view.bounds, camera: camera)
        mapView.settings.myLocationButton = true
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        mapView.isMyLocationEnabled = true
        
        // Add the map to the view, hide it until we've got a location update.
        view.addSubview(mapView)
        mapView.isHidden = true
    }
}

// Delegates to handle events for the location manager.
extension ViewController: CLLocationManagerDelegate {
    
    // Handle incoming location events.
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        let location: CLLocation = locations.last!
        print("Location: \(location)")
        
        let camera = GMSCameraPosition.camera(withLatitude: location.coordinate.latitude,
                                              longitude: location.coordinate.longitude,
                                              zoom: zoomLevel)
        
        if mapView.isHidden {
            mapView.isHidden = false
            mapView.camera = camera
        } else {
            mapView.animate(to: camera)
        }
        
        //listLikelyPlaces()
    }
    
    // Handle authorization for the location manager.
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        switch status {
        case .restricted:
            print("Location access was restricted.")
        case .denied:
            print("User denied access to location.")
            // Display the map using the default location.
            mapView.isHidden = false
        case .notDetermined:
            print("Location status not determined.")
        case .authorizedAlways: fallthrough
        case .authorizedWhenInUse:
            print("Location status is OK.")
        }
    }
    
    // Handle location manager errors.
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        locationManager.stopUpdatingLocation()
        print("Error: \(error)")
}
}

extension ViewController: GMSMapViewDelegate {
}

