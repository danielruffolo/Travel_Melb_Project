import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
//import {HttpProvider} from '../../providers/http-provider';
import PvtApi, { Stop } from '../../PtvApiService';
import { DeparturesList } from '../departuresList/departuresList';


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

  getJsonData() {
    var test = this.navParams.get('url');
    return this.http.get(test).map(res => res.json());
  }

  getdata() {
    //this.loading.present();
    this.getJsonData().subscribe(
      result => {
        this.stops = result.stops;
        this.stops = this.stops.sort((a, b) => a.stop_id - b.stop_id);
      },
      err => {
        console.error("Error : " + err);
      },
      () => {
        this.loading.dismiss();
      }
    );
  }

  clickedStop(stop: Stop) {
    let departuresUrl = this.ptvApi.getDeparturesUrl(stop.route_type, stop.stop_id);

    this.navCtrl.push(DeparturesList, {
      title: "test",
      url: departuresUrl
    });
  }
}



