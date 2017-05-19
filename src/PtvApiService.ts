// This page handles all of the url requests for JSON. Each time a request is made it needs a signature that
// will change depending on the request. It had to use HMACSHA1 and all be upper case latters.
// This class works by a function being called from a button clicked on either the timetable, routelist, stopslist or depature times
// pages. The required information is then sent with the call functions and used to create the endpoint for
// the selected search. The endpoint is then sent to the getUrl function that creates the entire url
// then sends the signedSection to the getSignature function that then creates the signature required for
// each url search.

import * as CryptoJS from "crypto-js";
import { HomePage } from '../pages/home/home';

// This data will stay the same accross each url. 
export default class PtvApi {
    key = "3cbdb7ca-b9db-4fc6-9d47-8b7e1900792a"
    baseUrl = "http://timetableapi.ptv.vic.gov.au";
    version = "v3";
    devId = 3000198;

    // This function recieves the url string sent by each timetable related page and uses it and the api key
    // defined above to create a encrypted HMACSHA1 all uppercase string.
    getSignature(url: string): string {
        return CryptoJS.HmacSHA1(url, this.key).toString().toUpperCase();
    }

    // This uses each variable of the url to create the final url string to be passed back.
    //
    getUrl(endpoint: string): string {
        let signedSection = `/${this.version}/${endpoint}devid=${this.devId}`
        let signature = this.getSignature(signedSection);
        return `${this.baseUrl}${signedSection}&signature=${signature}`
    }

    // This recieves the route url and creates an endpoint which is the section of the url specific to this search.
    // It adds the route type (type) to the endpoint so it knows what to search for.
    getRoutesUrl(type: number): string {
        let endpoint = `routes?route_types=${type}&`;
        return this.getUrl(endpoint);
    }

    // this function recieved the route number and type and creates a new endpoint for this specific search.
    getStopsUrl(route: number, routeType: number): string {
        let endpoint = `stops/route/${route}/route_type/${routeType}?`;
        return this.getUrl(endpoint);
    }

    // this function recieved the type and stop id and creates a new endpoint for this specific search.
    getDeparturesUrl(routeType: number, stopId: number) {
        let endpoint = `departures/route_type/${routeType}/stop/${stopId}?`
        return this.getUrl(endpoint);
    }

    // this function recieved the long and lat from the home view to load all stops around the users current location.
     getNearStopsUrl(lat: number, long: number) {
        let endpoint = `stops/location/${lat},${long}/?max_distance=400&`
        return this.getUrl(endpoint);
    }
}



// This is used to hold each peice of data coming from the route request
export interface Route {
    route_type: number,
    route_id: number,
    route_name: string,
    route_number: string
}
// This is used to hold each peice of data coming from the stops request
export interface Stop {
    stop_name: string,
    stop_id: number,
    route_type: number,
    stop_latitude: number,
    stop_longitude: number
}
// This is used to hold each peice of data coming from the departure request
export interface Departure {
    stop_id: number,
    route_id: number,
    run_id: number,
    direction_id: number,
    disruption_ids: number[],
    scheduled_departure_utc: string,
    estimated_departure_utc: string,
    at_platofmr: boolean,
    platform_number: string,
    flags: string
}
