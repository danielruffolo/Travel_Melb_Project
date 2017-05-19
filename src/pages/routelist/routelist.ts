// This page uses the data sent from the timetable page and recieves all the route data for the selected route type.
// It then populates the listview with these options and allows the user to select the route they want to look at.

import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import PvtApi, { Route } from '../../PtvApiService';
import { StopsList } from '../stopslist/stopslist';

@Component({
  selector: 'page-routelist',
  templateUrl: 'routelist.html'
})

export class RouteList {

  routes: Route[] | null = null;
  loading: any;
  ptvApi = new PvtApi();

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private http: Http) {
    this.getJsonData();
    this.getdata();
    this.loading = this.loadingCtrl.create({
      content: `
      <ion-spinner ></ion-spinner>`
    });
  }

// This sets the url variable to the url sent from the timetable page. It then requests the json data.
  getJsonData() {
    var url = this.navParams.get('url');
    return this.http.get(url).map(res => res.json());
  }

// This function gets all the routes from the results from json and checks for errors.
  getdata() {

    this.getJsonData().subscribe(
      result => {
        this.routes = result.routes;
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

// When the user selects a route option it will call this function to get the route_id from the json file linked with the
// route_name they selected. It will then pass the data to create the url needed for the next section. It then pushes
// the url to the next list page.
  clickedRoute(route: Route) {
    let stopsUrl = this.ptvApi.getStopsUrl(route.route_id, route.route_type);

    this.navCtrl.push(StopsList, {
      title: "test",
      url: stopsUrl
    });
  }
}



