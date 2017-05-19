import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RouteList } from '../routelist/routelist';
import PvtApi from '../../PtvApiService';

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



