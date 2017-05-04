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

class JourneyPlannerViewController: BaseViewController {

    @IBOutlet weak var startLocation: UITextField!
    @IBOutlet weak var destinationLocation: UITextField!
    @IBOutlet weak var timeController: UISegmentedControl!
    @IBOutlet weak var datetimePicker: UIDatePicker!
    
    @IBOutlet weak var searchButton: UIButton!
    
 
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.addSlideMenuButton()
        self.title = "Journey Planner"

        // Do any additional setup after loading the view.
    }
    
    fileprivate var directionsAPI: PXGoogleDirections {
        return (UIApplication.shared.delegate as! AppDelegate).directionsAPI
    }
    

    
    @IBAction func goButtonTouched(_ sender: UIButton) {
        directionsAPI.delegate = self as! PXGoogleDirectionsDelegate
        directionsAPI.from = PXLocation.namedLocation(startLocation.text!)
        directionsAPI.to = PXLocation.namedLocation(destinationLocation.text!)
        //directionsAPI.mode = modeFromField()
    
        
            //directionsAPI.departureTime = nil
            //directionsAPI.arrivalTime = nil
        
        
        // directionsAPI.region = "fr" // Feature not demonstrated in this sample app
        directionsAPI.calculateDirections { (response) -> Void in
            DispatchQueue.main.async(execute: { () -> Void in
                switch response {
                case let .error(_, error):
                    let alert = UIAlertController(title: "PXGoogleDirectionsSample", message: "Error: \(error.localizedDescription)", preferredStyle: UIAlertControllerStyle.alert)
                    alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
                    self.present(alert, animated: true, completion: nil)
                case let .success(request, routes): break
                    
//                    if let rvc = self.storyboard?.instantiateViewController(withIdentifier: "Results") as? ResultsViewController {
//                        rvc.request = request
//                        rvc.results = routes
//                        self.present(rvc, animated: true, completion: nil)
                    
                }
            })
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

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
