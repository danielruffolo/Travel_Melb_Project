import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})

export class AboutPage {




  constructor(public navCtrl: NavController, public geolocation: Geolocation) {


  }

  ionViewDidLoad(){
  


  }

  
}
  
 
  
