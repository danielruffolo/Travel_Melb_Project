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
        let doneButton = UIBarButtonItem(title: "Done", style: .plain, target: self, action: #selector(JourneyPlannerViewController.goButtonTouched(_:)))
        let clearButton = UIBarButtonItem(title: "Clear", style: .plain, target: self, action: #selector(JourneyPlannerViewController.goButtonTouched(_:)))
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
