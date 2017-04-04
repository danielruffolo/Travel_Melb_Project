//
//  ViewController.swift
//  Travel_Melb_Project
//
//  Created by Daniel Ruffolo on 29/3/17.
//  Copyright © 2017 Travel_Melb_Team. All rights reserved.
//

import UIKit


class ViewController: BaseViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        self.addSlideMenuButton()
        //self.navigationController?.navigationBar.backgroundColor = UIColor.clear
        
        self.navigationController?.navigationBar.isTranslucent = true;
        self.navigationController?.view.backgroundColor = UIColor.clear;
        self.navigationController?.navigationBar.backgroundColor = UIColor.clear;
        
        
//        self.navigationController.navigationBar setBackgroundImage:[UIImage new]
//            forBarMetrics:UIBarMetricsDefault];
//        self.navigationController.navigationBar.shadowImage = [UIImage new];
//        self.navigationController.navigationBar.translucent = YES;
//        self.navigationController.view.backgroundColor = [UIColor clearColor];
//        self.navigationController.navigationBar.backgroundColor = [UIColor clearColor];
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

