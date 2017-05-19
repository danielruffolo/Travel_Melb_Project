import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, MenuController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AutocompletePage } from './autocomplete';
import PvtApi, { Stop } from '../../PtvApiService';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DeparturesList } from '../departuresList/departuresList';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;

  map: google.maps.Map;
  drawerOptions: any;
  request: any;
  address;
  nearbyStops: Stop[];
  ptvApi = new PvtApi();
  position: Coordinates | null = null;

  constructor(public menu: MenuController,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    private modalCtrl: ModalController,
    public http: Http) {
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

  shouldHide=true;

  openMenu(evt) {
    if (evt === "main") {
      this.menu.enable(true, 'menu1');
      this.menu.enable(false, 'menu2');
    } else {
      this.menu.enable(true, 'menu2');
      this.menu.enable(false, 'menu1');
    }
    this.menu.toggle();
  }

  ionViewDidLoad() {
    this.initMap();
    this.updateMap();

    setInterval(() => {
      this.initMap();
      this.updateMap();
      this.startNavigating();
    }, 2 * 60 * 1000);
  }

  updateMap() {
    this.geolocation.getCurrentPosition()
      .then((position) => {
        this.position = position.coords;
        this.getMarkers(this.position.latitude, this.position.longitude);
      });
  }

  showAddressModal() {
    
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      this.address.place = data;

      this.startNavigating()
    });
    modal.present();
    this.initMap();
}

  getMarkers(lat: number, long: number) {
    const url = this.ptvApi.getNearStopsUrl(lat, long);
    this.http.get(url)
      .map((res) => res.json())
      .subscribe(data => {
        this.nearbyStops = data.stops;
        this.addMarkersToMap(this.nearbyStops);
      });
  }

  addMarkersToMap(stops: Stop[]) {

    for (let stop of stops) {
      var position = new google.maps.LatLng(stop.stop_latitude, stop.stop_longitude);
      var title = stop.stop_name;
      var type = stop.route_type;

      var train = "../../assets/img/mini_train.png";
      var tram = "../../assets/img/mini_tram.png";
      var bus = "../../assets/img/mini_bus.png";
      var icon_url;

      // detect icon
      
if (type == 0) {
        icon_url = "../../assets/img/mini_train.png";
        console.log("train")
      }
      else if (type == 1) {
        icon_url = "../../assets/img/mini_tram.png";
      console.log("tram")
      }
      else if (type == 2) {
        console.log("bus")
        icon_url = "../../assets/img/mini_bus.png";
      }

      var stopMarker = new google.maps.Marker({
        position: position,
        title: title,
        icon: {

          

          url: icon_url
          

        },
        clickable: true,
        map: this.map
      });

      google.maps.event.addListener(stopMarker, 'click', () => {
        this.navCtrl.push(DeparturesList, {
          url: this.ptvApi.getDeparturesUrl(stop.route_type, stop.stop_id)
        })
      });
    }

  }

  initMap() {

    this.geolocation.getCurrentPosition().then((position) => {

      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.addMarker(latLng);

    }, (err) => {
      console.log(err);
    });

  }

  addMarker(latLng: google.maps.LatLng) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng

    });

    let content = "<h4>You are currently here</h4>";

    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker: google.maps.Marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }
  startNavigating() {
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
        this.shouldHide=false;
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(res);
        } else {
          console.warn(status);
        }

      });

    })
  }
}