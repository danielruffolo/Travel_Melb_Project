import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
//import {HttpProvider} from '../../providers/http-provider';
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



