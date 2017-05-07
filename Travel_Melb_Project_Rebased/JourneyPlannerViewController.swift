//
//  JourneyPlannerViewController.swift
//  Travel_Melb_Project_Rebased
//
//  Created by Chris Hurley on 30/4/17.
//  Copyright © 2017 DansMacBook. All rights reserved.
//

import UIKit
import CoreLocation
import PXGoogleDirections
import GoogleMaps
import GoogleMapsCore


class JourneyPlannerViewController: BaseViewController {

    @IBOutlet weak var startLocation: UITextField!
    @IBOutlet weak var destinationLocation: UITextField!
    @IBOutlet weak var timeController: UISegmentedControl!
    @IBOutlet weak var searchButton: UIButton!
    @IBOutlet weak var startArriveDateField: UITextField!

    
    var startArriveDate: Date?
 
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.addSlideMenuButton()
        self.title = "Journey Planner"
        updateStartArriveDateField(nil)
        let datePicker = UIDatePicker()
        datePicker.sizeToFit()
        datePicker.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        datePicker.datePickerMode = .dateAndTime
        datePicker.minuteInterval = 5
        startArriveDateField.inputView = datePicker
        let keyboardDoneButtonView = UIToolbar()
        keyboardDoneButtonView.barStyle = .black
        keyboardDoneButtonView.isTranslucent = true
        keyboardDoneButtonView.tintColor = nil
        keyboardDoneButtonView.sizeToFit()
        let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(JourneyPlannerViewController.doneButtonTouched(_:)))
        let clearButton = UIBarButtonItem(title: "Clear", style: .plain, target: self, action: #selector(JourneyPlannerViewController.clearButtonTouched(_:)))
        keyboardDoneButtonView.setItems([doneButton, clearButton], animated: false)
        startArriveDateField.inputAccessoryView = keyboardDoneButtonView

        // Do any additional setup after loading the view.
    }
    
    fileprivate var directionsAPI: PXGoogleDirections {
        return (UIApplication.shared.delegate as! AppDelegate).directionsAPI
    }
    
    fileprivate func modeFromField() -> PXGoogleDirectionsMode {
        return PXGoogleDirectionsMode(rawValue: 3)!
    }
    
    fileprivate func updateStartArriveDateField(_ newDate: Date?) {
        startArriveDate = newDate
        if let saDate = startArriveDate {
            let dateFormatter = DateFormatter()
            dateFormatter.dateStyle = .medium
            dateFormatter.timeStyle = .short
            startArriveDateField.text = dateFormatter.string(from: saDate)
        } else {
            startArriveDateField.text = nil
        }
    }
    
    @IBAction func fromButton(_ sender: UITextField) {
        let autocompleteController = GMSAutocompleteViewController()
        autocompleteController.delegate = self
        
        // Set a filter to return only addresses.
        let addressFilter = GMSAutocompleteFilter()
        addressFilter.type = .address
        autocompleteController.autocompleteFilter = addressFilter
        
        present(autocompleteController, animated: true, completion: nil)
    }
    
    func doneButtonTouched(_ sender: UIBarButtonItem) {
        updateStartArriveDateField((startArriveDateField.inputView as! UIDatePicker).date)
        startArriveDateField.resignFirstResponder()
        startArriveDateField.isEnabled = false
    }
    
    func clearButtonTouched(_ sender: UIBarButtonItem) {
        updateStartArriveDateField(nil)
        startArriveDateField.resignFirstResponder()
        startArriveDateField.isEnabled = false
    }
    
    @IBAction func goButtonTouched(_ sender: UIButton) {
        directionsAPI.delegate = self
        directionsAPI.from = PXLocation.namedLocation(startLocation.text!)
        directionsAPI.to = PXLocation.namedLocation(destinationLocation.text!)
        directionsAPI.mode = modeFromField()
        directionsAPI.alternatives = true
        
        switch timeController.selectedSegmentIndex {
        case 0:
            directionsAPI.departureTime = .now
            directionsAPI.arrivalTime = nil
        case 1:
            if let saDate = startArriveDate {
                directionsAPI.departureTime = PXTime.timeFromDate(saDate)
                directionsAPI.arrivalTime = nil
            } else {
                return
            }
        case 2:
            if let saDate = startArriveDate {
                directionsAPI.departureTime = nil
                directionsAPI.arrivalTime = PXTime.timeFromDate(saDate)
            } else {
                return
            }
        default:
            break
        }
    
        directionsAPI.calculateDirections { (response) -> Void in
            DispatchQueue.main.async(execute: { () -> Void in
                switch response {
                case let .error(_, error):
                    let alert = UIAlertController(title: "PXGoogleDirectionsSample", message: "Error: \(error.localizedDescription)", preferredStyle: UIAlertControllerStyle.alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(alert, animated: true, completion: nil)
                case let .success(request, routes):
                    if let rvc = self.storyboard?.instantiateViewController(withIdentifier: "Results") as? ResultsViewController {
                        rvc.request = request
                        rvc.results = routes
                        self.present(rvc, animated: true, completion: nil)
                    }
                }
            })
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func selectDateButtonTouched(_ sender: UIButton) {
        startArriveDateField.isEnabled = true
        startArriveDateField.becomeFirstResponder()
    }

}
extension JourneyPlannerViewController: PXGoogleDirectionsDelegate {
    func googleDirectionsWillSendRequestToAPI(_ googleDirections: PXGoogleDirections, withURL requestURL: URL) -> Bool {
        NSLog("googleDirectionsWillSendRequestToAPI:withURL:")
        return true
    }
    
    func googleDirectionsDidSendRequestToAPI(_ googleDirections: PXGoogleDirections, withURL requestURL: URL) {
        NSLog("googleDirectionsDidSendRequestToAPI:withURL:")
        NSLog("\(requestURL.absoluteString.addingPercentEncoding(withAllowedCharacters: CharacterSet.urlQueryAllowed)!)")
    }
    
    func googleDirections(_ googleDirections: PXGoogleDirections, didReceiveRawDataFromAPI data: Data) {
        NSLog("googleDirections:didReceiveRawDataFromAPI:")
        NSLog(NSString(data: data, encoding: String.Encoding.utf8.rawValue) as! String)
    }
    
    func googleDirectionsRequestDidFail(_ googleDirections: PXGoogleDirections, withError error: NSError) {
        NSLog("googleDirectionsRequestDidFail:withError:")
        NSLog("\(error)")
    }
    
    func googleDirections(_ googleDirections: PXGoogleDirections, didReceiveResponseFromAPI apiResponse: [PXGoogleDirectionsRoute]) {
        NSLog("googleDirections:didReceiveResponseFromAPI:")
        NSLog("Got \(apiResponse.count) routes")
        for i in 0 ..< apiResponse.count {
            NSLog("Route \(i) has \(apiResponse[i].legs.count) legs")
        }
    }
}

extension JourneyPlannerViewController: GMSAutocompleteViewControllerDelegate {
    
    // Handle the user's selection.
    func viewController(_ viewController: GMSAutocompleteViewController, didAutocompleteWith place: GMSPlace) {
        // Print place info to the console.
        print("Place name: \(place.name)")
        print("Place address: \(place.formattedAddress)")
        print("Place attributions: \(place.attributions)")
        
        // Get the address components.
        if let addressLines = place.addressComponents {
            // Populate all of the address fields we can find.
            for field in addressLines {
                switch field.type {
                case kGMSPlaceTypeStreetNumber:
                    street_number = field.name
                case kGMSPlaceTypeRoute:
                    route = field.name
                case kGMSPlaceTypeNeighborhood:
                    neighborhood = field.name
                case kGMSPlaceTypeLocality:
                    locality = field.name
                case kGMSPlaceTypeAdministrativeAreaLevel1:
                    administrative_area_level_1 = field.name
                case kGMSPlaceTypeCountry:
                    country = field.name
                case kGMSPlaceTypePostalCode:
                    postal_code = field.name
                case kGMSPlaceTypePostalCodeSuffix:
                    postal_code_suffix = field.name
                // Print the items we aren't using.
                default:
                    print("Type: \(field.type), Name: \(field.name)")
                }
            }
        }
        
        // Call custom function to populate the address form.
        fillAddressForm()
        
        // Close the autocomplete widget.
        self.dismiss(animated: true, completion: nil)
    }
    
    func viewController(_ viewController: GMSAutocompleteViewController, didFailAutocompleteWithError error: Error) {
        // TODO: handle the error.
        print("Error: ", error.localizedDescription)
    }
    
    func wasCancelled(_ viewController: GMSAutocompleteViewController) {
        dismiss(animated: true, completion: nil)
    }
    
    // Show the network activity indicator.
    func didRequestAutocompletePredictions(_ viewController: GMSAutocompleteViewController) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = true
    }
    
    // Hide the network activity indicator.
    func didUpdateAutocompletePredictions(_ viewController: GMSAutocompleteViewController) {
        UIApplication.shared.isNetworkActivityIndicatorVisible = false
    }
    
}

