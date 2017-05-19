import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-favplaces',
  templateUrl: 'favplaces.html'
})

export class FavPlacesPage {




  constructor(public navCtrl: NavController, public geolocation: Geolocation) {


  }

  ionViewDidLoad(){
  


  }

  
}
  
 
  
