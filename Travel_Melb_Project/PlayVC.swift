//
//  PlayVC.swift
//  Travel_Melb_Project
//
//  Created by CHRIS HURLEY on 4/04/2017.
//  Copyright © 2017 Travel_Melb_Team. All rights reserved.
//

import UIKit

class PlayVC: BaseViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = "Journey Planner"
        
        self.navigationController?.view.backgroundColor = UIColor.clear;

        // Do any additional setup after loading the view.
        self.addSlideMenuButton()
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


//[self.navigationController.navigationBar setBackgroundImage:[UIImage new]
//    forBarMetrics:UIBarMetricsDefault];
//self.navigationController.navigationBar.shadowImage = [UIImage new];
//self.navigationController.navigationBar.translucent = YES;
//self.navigationController.view.backgroundColor = [UIColor clearColor];
//self.navigationController.navigationBar.backgroundColor = [UIColor clearColor];
