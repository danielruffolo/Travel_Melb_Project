import {Component, NgZone} from '@angular/core';
import {ViewController} from 'ionic-angular';
import { HomePage } from './home';

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
  selector: 'page-autocomplete',
  templateUrl: 'autocomplete.html'
})


// autocomplete page acts as a modal class that generates a modal for recieving data from google places API 
// again this was base doff a tutorial found referenced above

export class AutocompletePage {


  autocompleteItems;
  autocomplete;
  item;
  service = new google.maps.places.AutocompleteService();

  constructor (public viewCtrl: ViewController, private zone: NgZone) {
    // the data here we are passign back to our main maps page for use in the main activity
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

// simple: just closes the modal on call 
  dismiss() {

    this.viewCtrl.dismiss();
    
  }
// accepts a item and passes the item to view controller
  chooseItem(item: any) {

    this.viewCtrl.dismiss(item);

    }
  
  // this is the main API class for place suggestions
  // this accepts a quiery and sends a query in text to the api, the api recieves the 
  // query and provides known google maps places suggestions in text
  // this ensures the user doesnt need to know geolocations of everythung
  // that data helps build the main directions function
  
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let autocom = this;
    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: {country: 'AU'} }, function (predictions, status) {
      autocom.autocompleteItems = []; 
      autocom.zone.run(function () {
        predictions.forEach(function (prediction) {
          autocom.autocompleteItems.push(prediction.description);

          

        
        });
      });
    });
  }
}