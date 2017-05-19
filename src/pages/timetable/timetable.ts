// This Timetable page allows the user to select either bus train or tram.
// This would then move onto the different route options they can take on the
// selected option.

import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RouteList } from '../routelist/routelist';
import PvtApi from '../../PtvApiService';


@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html'
})

export class TimetablePage {
  ptvApi = new PvtApi();

  constructor(public NavParams: NavParams, public navCtrl: NavController) {
  }

  // If the user clicks the train button it will pass the route type to the getRoutesUrl function in PtvApiService. It will then return
  // the data and push it into the route list page.
  clickedRouteTrain() {
    let route = this.ptvApi.getRoutesUrl(0);
    let data = {
      url: route,
      title: 'test'
    };
    this.navCtrl.push(RouteList, data);
  }

  // If the user clicks the tram button it will pass the route type to the getRoutesUrl function in PtvApiService. It will then return
  // the data and push it into the route list page.
  clickedRouteTram() {
    let route = this.ptvApi.getRoutesUrl(1);
    let data = {
      url: route,
      title: 'test'
    };
    
    this.navCtrl.push(RouteList, data);
  }

  // If the user clicks the bus button it will pass the route type to the getRoutesUrl function in PtvApiService. It will then return
  // the data and push it into the route list page.
  clickedRouteBus() {
    let route = this.ptvApi.getRoutesUrl(2);
    let data = {
      url: route,
      title: 'test'
    };

    this.navCtrl.push(RouteList, data);
  }
}



