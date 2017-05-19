import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, MenuController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AutocompletePage } from './autocomplete';
import PvtApi, { Stop } from '../../PtvApiService';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DeparturesList } from '../departuresList/departuresList';


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
  selector: 'page-home',
  templateUrl: 'home.html'
})





// the home page class serves as the main function class
// this acts as the apps central screen

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

  //here we are devlaring our global variables

  constructor(public menu: MenuController,
    public navCtrl: NavController,
    public geolocation: Geolocation,
    private modalCtrl: ModalController,
    public http: Http) {
    this.address = {
      place: ''
    };
    //here we are avvessing the ionic native api functions locally from the imported ionic libraries

// this is our menu controller, on click it draws to the given specifications
    menu.enable(true);

    this.drawerOptions = {
      handleHeight: 50,
      thresholdFromBottom: 200,
      thresholdFromTop: 200,
      bounceBack: true
    };
  }

  shouldHide=true;

// this method controls the opening of or dual menus, one for left and one for right
// each event in the menu opens a new page
// this is crucial as not having this code breaks the menu controll

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

  // ion view did load method acts as a onload of screen function
  // here we are building the map from the init map method and we are updating this process with a 
  // set interval method so that the geolocation is updated throuout use of the app 


  ionViewDidLoad() {
    this.initMap();
    this.updateMap();

    setInterval(() => {
      this.initMap();
      this.updateMap();
      this.startNavigating();
    }, 2 * 60 * 1000);
  }

  // update map calls our geolocation native library object and fetches the coordinates for us to use with google maps
// the output here is coords for the current position of the app user

  updateMap() {
    this.geolocation.getCurrentPosition()
      .then((position) => {
        this.position = position.coords;
        this.getMarkers(this.position.latitude, this.position.longitude);
      });
  }

  // show adress modal is a method that opens a modal for selecting a particular place with google maps places api suggestions
  // this enables us to retrieve a geolocation from a text input that google provides from its bibrary
  // the data is then passed to the start navigating method whhich builds a travel route

  showAddressModal() {
    
    let modal = this.modalCtrl.create(AutocompletePage);
    modal.onDidDismiss(data => {
      this.address.place = data;

      this.startNavigating()
    });
    modal.present();
    this.initMap();
}

// get markers method utilises our own built PTV api service.
// we feed the geolocation to the PTV api service which recieves in JSON 
// marker coordinates which we filter to display specific bus stops within a sertain range of the current position

  getMarkers(lat: number, long: number) {
    const url = this.ptvApi.getNearStopsUrl(lat, long);
    this.http.get(url)
      .map((res) => res.json())
      .subscribe(data => {
        this.nearbyStops = data.stops;
        this.addMarkersToMap(this.nearbyStops);
      });
  }

// add markers to map acts as a marker proccessing class. 
// coords recieved from the PTV API are processed into google maps marker objects 
// we then bind the markers to their relevent PTV api data information
// we also filter the markers and give them appropriate icon pictures 
// either Train - Tram - Bus


  addMarkersToMap(stops: Stop[]) {

    for (let stop of stops) {
      var position = new google.maps.LatLng(stop.stop_latitude, stop.stop_longitude);
      var title = stop.stop_name;
      var type = stop.route_type;

      var train = "assets/img/mini_train.png";
      var tram = "assets/img/mini_tram.png";
      var bus = "assets/img/mini_bus.png";
      var icon_url;

      // detect icon
      
if (type == 0) {
        icon_url = "assets/img/mini_train.png";
        console.log("train")
      }
      else if (type == 1) {
        icon_url = "assets/img/mini_tram.png";
      console.log("tram")
      }
      else if (type == 2) {
        console.log("bus")
        icon_url = "assets/img/mini_bus.png";
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


// Here we are turning the markers on our map into clickable listeners. this will allow users to click 
// a map icon and see relevent informationto that marker
// this uses our PTV service class and requests data fromt he API specific to the marker location
// it then pushes the nav controller to the relevent timetable page associated with it

      google.maps.event.addListener(stopMarker, 'click', () => {
        this.navCtrl.push(DeparturesList, {
          url: this.ptvApi.getDeparturesUrl(stop.route_type, stop.stop_id)
        })
      });
    }

  }


// init map is a method that builds our google maps instance using the MAPS api
// this is based on the referenced // https://www.joshmorony.com/category/ionic-tutorials tutorial 
//for google maps

// it takes our geolocation and converts it to a position which we then bind to the maps instance with a marker
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

  // add marker class takes the golocation and builds a marker using their own marker object 

  addMarker(latLng: google.maps.LatLng) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng

    });

    let content = "<h4>You are currently here</h4>";

    this.addInfoWindow(marker, content);
    // we then display information relevent to that marker
  }
// add info window incorporates a event listner with to build a pop up modal on click of a geolocation marker

  addInfoWindow(marker: google.maps.Marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  // start navigation method accepts or geolocation again and feeds it to the google directions service
  // it also accepts a google places api golocation and maps a route based on the 2 retrieved geolocations
  // we then set the map instance and build a directions readout with polyline
  // referenced tutorial was used here and we modified it to only work with public transport

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
// thi sis where we tell the google api that we only want transit options\
// NOTE: We discovered that google has transit from PTV built into it and we found it much more thurough with directions
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
