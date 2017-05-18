import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { RouteList } from '../routelist/routelist';



@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html'
})

export class TimetablePage {

  constructor(public NavParams: NavParams, public navCtrl: NavController) {


  }


  clickedRouteBus() {

    let data = {
        url: 'http://timetableapi.ptv.vic.gov.au/v3/routes?route_types=2&devid=3000198&signature=3233937D7E2C8E578896E3AC280D5657D33801E6',
        title: 'test'
};
      this.navCtrl.push(RouteList, data); 
  }
    clickedRouteTrain() {

    let data = {
        url: 'http://timetableapi.ptv.vic.gov.au/v3/routes?route_types=0&devid=3000198&signature=972463B30142B1E9F37FCC5063989836D4B1E751',
        title: 'test'
};
      this.navCtrl.push(RouteList, data); 
  }
    clickedRouteTram() {

    let data = {
        url: 'http://timetableapi.ptv.vic.gov.au/v3/routes?route_types=1&devid=3000198&signature=39138E598314C598C8967C5C4BF541719CD61E5F',
        title: 'test'
};
      this.navCtrl.push(RouteList, data); 
  }


  
}
  
 
  
