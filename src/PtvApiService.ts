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

}
