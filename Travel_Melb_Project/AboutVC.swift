//
//  AboutVC.swift
//  Travel_Melb_Project
//
//  Created by CHRIS HURLEY on 4/04/2017.
//  Copyright © 2017 Travel_Melb_Team. All rights reserved.
//

import UIKit

class AboutVC: BaseViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        self.addSlideMenuButton()
        self.title = "About"

        // Do any additional setup after loading the view.
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
