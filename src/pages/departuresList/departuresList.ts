// This recieves the JSON data for departuretimes from the selected stop 
// and displays it in a list view.

import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import PvtApi, { Departure } from '../../PtvApiService';

// note from Authors-
// note to marker: https://www.joshmorony.com/category/ionic-tutorials/
// the following tutorials found on this website aided us in our learning 
// of ionic mobile app Development.
// Most of the time however, we modified it to suit our apps contention

// References
// https://www.joshmorony.com/category/ionic-tutorials
// https://ionicframework.com/docs/
// https://www.joshmorony.com/blog/
// https://ionicframework.com/docs/
// https://docs.angularjs.org/api
// https://developers.google.com/maps/ https://timetableapi.ptv.vic.gov.au/swagger/ui/index
//http://devfanaticblog.com/google-places-autocomplete-with-ionic-framework/



@Component({
  selector: 'page-departuresList',
  templateUrl: 'departuresList.html'
})

export class DeparturesList {
  departures: Departure[];
  loading: any;
  ptvApi = new PvtApi();

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private http: Http) {
    this.getJsonData();
    this.getdata();
    this.loading = this.loadingCtrl.create({
      content: `
      <ion-spinner></ion-spinner>`
    });

  }

  // This sets the url variable to the url sent from the routelist page. It then requests the json data.
  getJsonData() {
    var test = this.navParams.get('url');
    return this.http.get(test).map(res => res.json());
  }

// This function gets all the routes from the results from json and checks for errors.
  getdata() {
    this.getJsonData().subscribe(
      result => {
        this.departures = result.departures;

        console.log("Success : " + this.departures);
      },
      err => {
        console.error("Error : " + err);
      },
      () => {
        this.loading.dismiss();
        console.log('getData completed');
      }
    );
  }
}



