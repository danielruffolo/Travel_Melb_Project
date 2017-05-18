import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, MenuController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AutocompletePage } from './autocomplete';


import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


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
data2: any;


  constructor(public menu: MenuController, 
              public navCtrl: NavController,
               public geolocation: Geolocation,
                private modalCtrl: ModalController,
                public http: Http
                
                ) {

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
      this.getMarkers();
     
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

  getMarkers() {
  this.http.get('http://timetableapi.ptv.vic.gov.au/v3/stops/location/-37.8452691,145.1107945?max_distance=500&devid=3000198&signature=C1CD8BA21B09B6145810901F804BE8A0D9295174')
  .map((res) => res.json())
  .subscribe(data => {
    this.data2 = data.stops;
    this.addMarkersToMap(this.data2);

  });
}

addMarkersToMap(data2) {

    for(let stops of data2) {
      var position = new google.maps.LatLng(stops.stop_latitude, stops.stop_longitude);
      var title = stops.stop_name;
      var type = stops.route_type;

      var train = "../../assets/img/mini_tram.png";
      var tram = "../../assets/img/mini_tram.png";
      var bus = "../../assets/img/mini_tram.png";
      var icon_url;

      // detect icon

      if (type = 0) {
        icon_url = train;
      }
      else if (type = 1){
        icon_url = tram;

      }
       else if (type = 2){
         icon_url = bus;
        
      }

      

      var closestopMarkers = new google.maps.Marker(

        {
          position: position, 
          title: title,

          

          icon:{ 
            url : icon_url,
     
        
            },

        });

      closestopMarkers.setMap(this.map);

      


}

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

       this.addMarker();


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

  
 
  
