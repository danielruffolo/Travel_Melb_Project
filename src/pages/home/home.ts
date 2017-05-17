import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, MenuController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AutocompletePage } from './autocomplete';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


@ViewChild('map') mapElement: ElementRef;
@ViewChild('directionsPanel') directionsPanel: ElementRef;

map: any;
drawerOptions: any;
request: any;
address;

  constructor(public menu: MenuController, public navCtrl: NavController, public geolocation: Geolocation, private modalCtrl: ModalController) {

    this.address = {
      place: ''
    };

    menu.enable(true);

  

    

    this.drawerOptions = {
            handleHeight: 50,
            thresholdFromBottom: 200,
            thresholdFromTop: 200,
            bounceBack: true
        };
  }

  openMenu(evt) {
      if(evt === "main"){
         this.menu.enable(true, 'menu1');
         this.menu.enable(false, 'menu2');
      }else{
         this.menu.enable(true, 'menu2');
         this.menu.enable(false, 'menu1');
      }
      this.menu.toggle();
  }

  ionViewDidLoad(){
  

     this.initMap();
      this.addMarker();
      this.highlightTransit();

  }

  showAddressModal () {
    let modal = this.modalCtrl.create(AutocompletePage);
    let me = this;
    modal.onDidDismiss(data => {
      this.address.place = data;
      
      this.startNavigating()
    });
    modal.present();
  }

  initMap(){

 this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position.coords.latitude + " " + position.coords.longitude)

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

      console.log(this.map);

    }, (err) => {
      console.log(err);
    });

   

  }

  addMarker(){

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position.coords.latitude + " " + position.coords.longitude)
 
  let marker = new google.maps.Marker({
    map: this.map,
    animation: google.maps.Animation.DROP,
    position: latLng
  
  });
 
  let content = "<h4>Information!</h4>";          
 
  this.addInfoWindow(marker, content);
    })
  
}

addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

// the following method will se the places api to highlight train, tram and bus stops within the area
  highlightTransit(){
    
  }

   
   startNavigating(){

   this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(position.coords.latitude + " " + position.coords.longitude)
 
        let directionsService = new google.maps.DirectionsService;
        let directionsDisplay = new google.maps.DirectionsRenderer;
 
        directionsDisplay.setMap(this.map);
        directionsDisplay.setPanel(this.directionsPanel.nativeElement);
   
        directionsService.route({

       
     
            origin: latLng,
            destination: this.address.place,
            
            travelMode: google.maps.TravelMode['TRANSIT']
        }, (res, status) => {
 
            if(status == google.maps.DirectionsStatus.OK){
                directionsDisplay.setDirections(res);
            } else {
                console.warn(status);
            }
 
        });
 
    })


}
 
            
      

     

       


}

  
 
  
