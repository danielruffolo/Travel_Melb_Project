// This allows the user to select a stop and then push the required data to the next list view.

import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import PvtApi, { Stop } from '../../PtvApiService';
import { DeparturesList } from '../departuresList/departuresList';


@Component({
  selector: 'page-stopslist',
  templateUrl: 'stopslist.html'
})

export class StopsList {

  stops: Stop[];
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
        this.stops = result.stops;
      },
      err => {
        console.error("Error : " + err);
      },
      () => {
        this.loading.dismiss();
      }
    );
  }

// When the user selects a stop option it will call this function to get the route_id from the json file linked with the
// stop_name they selected. It will then pass the data to create the url needed for the next section. It then pushes
// the url to the next list page.
  clickedStop(stop: Stop) {
    let departuresUrl = this.ptvApi.getDeparturesUrl(stop.route_type, stop.stop_id);

    this.navCtrl.push(DeparturesList, {
      title: "test",
      url: departuresUrl
    });
  }
}



