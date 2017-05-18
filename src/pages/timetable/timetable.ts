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


  clickedRouteTrain() {
    let route = this.ptvApi.getRoutesUrl(0);
    let data = {
      url: route,
      title: 'test'
    };
    this.navCtrl.push(RouteList, data);
  }

  clickedRouteTram() {
    let route = this.ptvApi.getRoutesUrl(1);
    let data = {
      url: route,
      title: 'test'
    };
    
    this.navCtrl.push(RouteList, data);
  }

  clickedRouteBus() {
    let route = this.ptvApi.getRoutesUrl(2);
    let data = {
      url: route,
      title: 'test'
    };

    this.navCtrl.push(RouteList, data);
  }
}



