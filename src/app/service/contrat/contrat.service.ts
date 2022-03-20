import { tokenize } from '@angular/compiler/src/ml_parser/lexer';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContratService {
  host: string = 'https://api.contratti.immobiliz.com/api/auth/contrat/create';

  id_user: any;
  token: any;
  tokenType: any;
  fa: FormGroup;
  f1: any;
  f2: any;

  api_url: string;
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  constructor(config: ConfigService, private httpClient: HttpClient) {
    this.api_url = config.API_URL;
  }

  /*sendContrato(data: any) {
    data.id_user = localStorage.getItem('userId');
    this.tokenType  = 'Bearer ';

    const header = new HttpHeaders().set('Authorization', this.tokenType + localStorage.getItem('token'));
              const headers = { headers: header };
              return this.http.post(this.host,data,headers);
    /*let headers=new HttpHeaders();
    headers.append('authorization'
    , this.token);
    return this.http.post(this.host , data, {headers:new
      HttpHeaders({'authorization': this.token})});
  }*/

  async create(data: any): Promise < any > {
    //data.id_user = localStorage.getItem("idUser");
    data.user = {
      id: localStorage.getItem('idUser')
    };
    let id_rh = localStorage.getItem('idRole');
    if (id_rh == '1') {
      data.societa = {
        id: localStorage.getItem('id_societa')
      };
    } else {
      data.societa = {
        id: localStorage.getItem('idAzienda')
      };
    }
    console.log("data before sending " + JSON.stringify(data));
    console.log(data);
    const url = `${this.api_url}/auth/contrat/create`;
    const res = await this.httpClient.post(url, data).toPromise();
    return res;
  }
  async update(data: any): Promise < any > {
    //data.id_user = localStorage.getItem("idUser");
    let id_rh = localStorage.getItem('idRole');
    if (id_rh == '1') {
      data.societa = {
        id: localStorage.getItem('id_societa')
      };
    } else {
      data.societa = {
        id: localStorage.getItem('idAzienda')
      };
    }
    //data.User = {id: localStorage.getItem('idUser')};
    data.id = data.id_contrat;
    console.log(data);

    console.log("data before sending " + JSON.stringify(data));

    const url = `${this.api_url}/auth/contrat/update`;
    const res = await this.httpClient.put(url, data).toPromise();
    return res;
  }

  cambiopassword(data: any): Promise < any > {
    return this.httpClient.post < any > (`${this.api_url}/auth/resetpassword`, data).toPromise();
  }
  async deleteContat(data: any): Promise < any > {
    data.id = data.id_contrat;
    data.user = {
      id: localStorage.getItem('idUser')
    };
    let id_rh = localStorage.getItem('idRole');
    if (id_rh == '1') {
      data.societa = {
        id: localStorage.getItem('id_societa')
      };
    } else {
      data.societa = {
        id: localStorage.getItem('idAzienda')
      };
    }
    console.log("data before sending " + JSON.stringify(data));
     const res = await this.httpClient.delete < any > (`${this.api_url}/auth/contrat/delete/${data.id}`).toPromise();
     return res;
  }

  async deleteContatfile(data: any): Promise < any > {
     console.log("data before sending " + JSON.stringify(data));
      if (data.length > 0) {
        let res:any;
        for(let i=0; i < data.length; i++) {
          res = await this.httpClient.delete < any > (`${this.api_url}/auth/filecontrat/delete/${data[i].id}`).toPromise();
        }
        return res;
      }
    return null;
  }


  filterInterrogazione(tipo: any, data: any): Promise < any > {
    return this.httpClient.post < any > (`${this.api_url}/auth/contrat/interrogation/${tipo}`, data).toPromise();
  }

  uploadfile(file: any, data: any, id: any): Promise < any > {
    const formdata: FormData = new FormData();
    let fileName:string = 'contrat-'+ new Date().getTime(); //get name from form for example
    let fileExtension:string = file.name.split('?')[0].split('.').pop();
    formdata.append('file', file, fileName+'.'+fileExtension);
    formdata.append('note', data.note);
    formdata.append('tipo_doc', data.tipo_doc);
    formdata.append('id_contrat', id);

    const headers = new HttpHeaders();
    /* In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    console.log(file);

    return this.httpClient.post < any > (`${this.api_url}/auth/contrat/upload`, formdata).toPromise();

  }

  async envoiMail(data: any, file ? : any): Promise < any > {
    const formdata: FormData = new FormData();
    data.id_user = localStorage.getItem("idUser");
    let fileName:string = 'contrat-'+ new Date().getTime(); //get name from form for example
    let fileExtension:string = file.name.split('?')[0].split('.').pop();
    formdata.append('file', file, fileName+'.'+'xlsx');
    formdata.append('a', data.a);
    formdata.append('cc', data.cc);
    formdata.append('oggetto', data.oggetto);
    formdata.append('corpo', data.corpo);
    //formdata.append('id_user',data.id_user);

    //formdata.append('filename',data.filename);
    //formdata.append('type',data.type);
    if (data.type == 'edit') {
      formdata.append('id_contrat', data.id_contrat);
      formdata.append('type', data.type);
    }
    console.log(data.a);
    console.log(data.cc);
    console.log(data.oggetto);
    console.log(data.corpo);
    console.log(file)

    const headers = new HttpHeaders();
    /* In Angular 5, including the header Content-Type can invalidate your request */
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.httpClient.post < any > (`${this.api_url}/auth/sendMailWithallegato`, formdata).toPromise();
  }

  async envoiMailOld(data: any): Promise < any > {
    data.id_user = localStorage.getItem("idUser");
    const url = `${this.api_url}/auth/contrat/sendMail`;
    const res = await this.httpClient.post(url, data).toPromise();
    return res;
  }
  /*async getEmails(): Promise<any> {
    const url = `${this.api_url}/auth/contrat/emails`;
    const res = await this.httpClient.get(url).toPromise();
    return res;
  }*/

  async getAll(): Promise < any > {
    const url = `${this.api_url}/auth/contrat/list`;
    const res = await this.httpClient.get(url).toPromise();
    return res;
  }

  async ShowContrat(id): Promise < any > {
    const url = `${this.api_url}/auth/contrat/show/${id}`;
    const res = await this.httpClient.get(url).toPromise();
    return res;
  }

  getfile(tipo: any): Observable<Blob> {
    let tipo1 = tipo.slice(7);
    console.log("tipo.slice(7)==>"+tipo.slice(8));
    const url = `${this.api_url}/auth/files/${tipo.slice(8)}`;
    const res = this.httpClient.get(url, { responseType: 'blob' });
    return res;
  }
  async getSegnalisazione(): Promise < any > {
    const url = `${this.api_url}/auth/GetListsignalisations`;
    const res = await this.httpClient.get(url).toPromise();
    return res;
  }
  setFormbuilder(fa: any) {
    this.fa = fa;
  }
  getFormbuilder() {
    return this.fa;
  }
  setFlagupdate(f1: any) {
    this.f1 = f1;
  }
  getFlagupdate() {
    return this.f1;
  }
  setFlagcreate(f2: any) {
    this.f2 = f2;
  }
  getFlagcreate() {
    return this.f2;
  }

}
