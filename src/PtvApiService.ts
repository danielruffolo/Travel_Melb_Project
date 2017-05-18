import * as CryptoJS from "crypto-js";

export default class PtvApi {
    key = "3cbdb7ca-b9db-4fc6-9d47-8b7e1900792a"
    baseUrl = "http://timetableapi.ptv.vic.gov.au";
    version = "v3";
    devId = 3000198;

    getSignature(url: string): string {
        return CryptoJS.HmacSHA1(url, this.key).toString().toUpperCase();
    }

    getUrl(endpoint: string): string {
        let signedSection = `/${this.version}/${endpoint}devid=${this.devId}`
        let signature = this.getSignature(signedSection);
        return `${this.baseUrl}${signedSection}&signature=${signature}`
    }

    getRoutesUrl(type: number): string {
        let endpoint = `routes?route_types=${type}&`;
        return this.getUrl(endpoint);
    }

    getStopsUrl(route: number, routeType: number): string {
        let endpoint = `stops/route/${route}/route_type/${routeType}?`;
        return this.getUrl(endpoint);
    }

    getDeparturesUrl(routeType: number, stopId: number) {
        let endpoint = `departures/route_type/${routeType}/stop/${stopId}?`
        return this.getUrl(endpoint);
    }
}

export interface Route {
    route_type: number,
    route_id: number,
    route_name: string,
    route_number: string
}

export interface Stop {
    stop_name: string,
    stop_id: number,
    route_type: number,
    stop_latitude: number,
    stop_longitude: number
}

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
