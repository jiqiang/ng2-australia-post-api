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

  getDomesticLetterWeights(): Promise<any[]> {
    return this.getWeights('domestic', 'letter');
  }

  getDomesticParcelWeights(): Promise<any[]> {
    return this.getWeights('domestic', 'parcel');
  }

  getDomesticLetterSizes(): Promise<any> {
    return this.getSizes('domestic', 'letter');
  }

  getDomesticParcelSizes(): Promise<any> {
    return this.getSizes('domestic', 'parcel');
  }

  getDomesticLetterServices(length: any, width: any, thickness: any, weight: any): Promise<any[]> {
    let url = `${this.baseUrl}/postage/letter/domestic/service.json`;
    let search = new URLSearchParams();
    search.append('length', String(length));
    search.append('width', String(width));
    search.append('thickness', String(thickness));
    search.append('weight', String(weight));

    return this.http.get(url, {headers: this.headers, search: search})
      .toPromise()
      .then(response => response.json().services.service)
      .catch(this.handleError);
  }

  calculateDomesticLetterPostage(serviceCode: any, weight: any, optionCode?: any, suboptionCode?: any, extraCover?: any): Promise<any> {
    let url = `${this.baseUrl}/postage/letter/domestic/calculate.json`;
    let search = new URLSearchParams();
    search.append('service_code', String(serviceCode));
    search.append('weight', String(weight));
    if (optionCode) {
      search.append('option_code', String(optionCode));
    }
    if (suboptionCode) {
      search.append('suboption_code', String(suboptionCode));
    }
    if (extraCover) {
      search.append('extra_cover', String(extraCover));
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

  private getWeights(domesticOrIntel: string, letterOrParcel: string): Promise<any[]> {
    let url = `${this.baseUrl}/postage/${letterOrParcel}/${domesticOrIntel}/weight.json`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json().weights.weight)
      .catch(this.handleError);
  }

  private getSizes(domesticOrIntel: string, letterOrParcel: string): Promise<any[]> {
    let url = `${this.baseUrl}/postage/${letterOrParcel}/${domesticOrIntel}/size.json`;
    return this.http.get(url, {headers: this.headers})
      .toPromise()
      .then(response => response.json().sizes.size)
      .catch(this.handleError);
  }
}