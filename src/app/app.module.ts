import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AboutPage } from '../pages/about/about';
import { TimetablePage } from '../pages/timetable/timetable';
import { PlannerPage } from '../pages/planner/planner';
import { AutocompletePage } from '../pages/home/autocomplete';

import { ContentDrawer } from '../components/content-drawer/content-drawer';

import { Geolocation } from '@ionic-native/geolocation';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    TimetablePage,
    PlannerPage,
    AutocompletePage,
    
    ContentDrawer
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)



    
  
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TimetablePage,
    PlannerPage,
    AboutPage,
    AutocompletePage,
    ContentDrawer
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]

  
})
export class AppModule {}
