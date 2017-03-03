import {Injectable, Optional} from '@angular/core';
import {Http, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {AustraliaPostAPIConfig} from './australia-post-api-config';

@Injectable()
export class PacService {

  private url = 'https://digitalapi.auspost.com.au/postage/country.json';
  private authKey = '';
  private headers: Headers; 

  constructor(private http: Http, @Optional() config: AustraliaPostAPIConfig) {
    if (config) {
      this.authKey = config.auth_key;
      this.headers = new Headers({'AUTH-KEY': this.authKey});
    }
  }

  getCountries(): Promise<any[]> {
    return this.http.get(this.url, {headers: this.headers})
      .toPromise()
      .then(response => response.json().countries.country)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
}
