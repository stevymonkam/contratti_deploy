import { Injectable } from '@angular/core';
import * as dotenv from 'dotenv';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  API_URL: string
  constructor() {
    this.API_URL=process.env.API_URL;
    //this.API_URL='https://cors-anywhere.herokuapp.com/http://api.contratti.immobiliz.com/api'; //http://127.0.0.1:8000
  }

}
