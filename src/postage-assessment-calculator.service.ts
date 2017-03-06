import {Injectable, Optional} from '@angular/core';
import {Http, Headers, URLSearchParams} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AustraliaPostAPIConfig} from './australia-post-api-config';

@Injectable()
export class PostageAssessmentCalculatorService {

  private baseUrl = 'https://digitalapi.auspost.com.au';
  private authKey = '';
  private headers: Headers;

  constructor(private http: Http, @Optional() config: AustraliaPostAPIConfig) {
    if (config) {
      this.authKey = config.auth_key;
      this.headers = new Headers({'AUTH-KEY': this.authKey});
    }
  }

  getCountries(): Promise<any[]> {
    let url = `${this.baseUrl}/postage/country.json`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json().countries.country)
      .catch(this.handleError);
  }

  getDomesticLetterThicknesses(): Promise<any[]> {
    let url = `${this.baseUrl}/postage/letter/domestic/thickness.json`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json().thicknesses.thickness)
      .catch(this.handleError);
  }

  getWeights(isDomestic: boolean, isLetter: boolean): Promise<any[]> {
    let domOrIntel = isDomestic ? 'domestic' : 'international';
    let letterOrParcel = isLetter ? 'letter' : 'parcel';
    let url = `${this.baseUrl}/postage/${letterOrParcel}/${domOrIntel}/weight.json`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json().weights.weight)
      .catch(this.handleError);
  }

  getSizes(isDomestic: boolean, isLetter: boolean): Promise<any[]> {
    let domOrIntel = isDomestic ? 'domestic' : 'international';
    let letterOrParcel = isLetter ? 'letter' : 'parcel';
    let url = `${this.baseUrl}/postage/${letterOrParcel}/${domOrIntel}/size.json`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json().sizes.size)
      .catch(this.handleError);
  }

  getDomesticLetterServices(params: any): Promise<any[]> {
    let url = `${this.baseUrl}/postage/letter/domestic/service.json`;
    let search = new URLSearchParams();
    search.append('length', params.length);
    search.append('width', params.width);
    search.append('thickness', params.thickness);
    search.append('weight', params.weight);

    return this.http.get(url, {headers: this.headers, search: search})
      .toPromise()
      .then(response => response.json().services.service)
      .catch(this.handleError);
  }

  calculateDomesticLetterPostage(params: any): Promise<any> {
    let url = `${this.baseUrl}/postage/letter/domestic/calculate.json`;
    let search = new URLSearchParams();
    search.append('service_code', params.service_code);
    search.append('weight', params.weight);
    if (params.option_code) {
      search.append('option_code', params.option_code);
    }
    if (params.suboption_code) {
      search.append('suboption_code', params.suboption_code);
    }
    if (params.extra_cover) {
      search.append('extra_cover', params.extra_cover);
    }

    return this.http.get(url, {headers: this.headers, search: search})
      .toPromise()
      .then(response => response.json().postage_result)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred from getCountries()', error);
    return Promise.reject(error.message || error);
  }
}
