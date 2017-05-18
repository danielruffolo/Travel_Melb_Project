import { Component } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
//import {HttpProvider} from '../../providers/http-provider';


@Component({
  selector: 'page-routelist',
  templateUrl: 'routelist.html'
})

export class RouteList {

  routeData: any;
  loading: any;
  


  constructor(public navCtrl: NavController,public navParams: NavParams, public loadingCtrl: LoadingController, private http: Http) {
    this.getJsonData();
    this.getdata();
        this.loading = this.loadingCtrl.create({
      content: `
      <ion-spinner ></ion-spinner>`
    });

  }

  // getJsonData(){
  //   var routeType = this.navParams.get('url');
  //   return this.http.get(routeType).map(res => res.json());
  //     }
  

  // getdata(){
  //   this.loading.present();
  //   this.getJsonData().subscribe(
  //     result => {
  //       this.routeData=result.routes;
        
  //       console.log("Success : "+this.routeData);
  //     },
  //     err =>{
  //       console.error("Error : "+err);
  //     } ,
  //     () => {
  //       this.loading.dismiss();
  //       console.log('getData completed');
  //     }
  //   );
  // }

  getJsonData(){
    var test = this.navParams.get('url');
      return this.http.get(test).map(res => res.json());
    }
  

  getdata(){
    //this.loading.present();
    this.getJsonData().subscribe(
      result => {
        this.routeData=result.routes;
        
        console.log("Success : "+this.routeData);
      },
      err =>{
        console.error("Error : "+err);
      } ,
      () => {
        this.loading.dismiss();
        console.log('getData completed');
      }
    );
  }


  
}
  
 
  
