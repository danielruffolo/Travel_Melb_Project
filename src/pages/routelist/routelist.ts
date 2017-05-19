import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
//import {HttpProvider} from '../../providers/http-provider';
import PvtApi, { Route } from '../../PtvApiService';
import { StopsList } from '../stopslist/stopslist';

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

  getJsonData() {
    var url = this.navParams.get('url');
    return this.http.get(url).map(res => res.json());
  }

  getdata() {
    //this.loading.present();

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

  clickedRoute(route: Route) {
    let stopsUrl = this.ptvApi.getStopsUrl(route.route_id, route.route_type);

    this.navCtrl.push(StopsList, {
      title: "test",
      url: stopsUrl
    });
  }
}



