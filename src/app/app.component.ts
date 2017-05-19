import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AboutPage } from '../pages/about/about';
import { TimetablePage } from '../pages/timetable/timetable';
import { PlannerPage } from '../pages/planner/planner';
import { FavPlacesPage } from '../pages/favplaces/favplaces';
import { AutocompletePage } from '../pages/home/autocomplete';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
address;

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{ title: string, component: any }>;
  options: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, private modalCtrl: ModalController, public splashScreen: SplashScreen) {

        this.address = {
      place: ''
    };



    
    this.initializeApp();
    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'Timetable', component: TimetablePage },
      { title: 'About', component: AboutPage }

    ];

     this.options = [

      { title: 'Favourite Places', component: FavPlacesPage },
  

    ];

  }


 shouldHide = true;


  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

    showAddressModal() {
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      this.address.place = data;


    });
    modal.present();
  }

  

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

   openHidden() {
   this.shouldHide = false;
  
  }

     closeHidden() {
   this.shouldHide = true;
  
  }



}
