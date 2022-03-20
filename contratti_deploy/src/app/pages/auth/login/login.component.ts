import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isCambio: boolean = false;
  isAnnulla: boolean = true;
  fa: FormGroup;
  fa1: FormGroup;
  username: string = '';
  submitted: boolean = false;
  credenziale_non_valid: boolean = false;
  colone_stabilise_error: boolean = true;
  flag_aggior: boolean = false;
  flag_non_aggior: boolean = false;
  loading: boolean = false;
  constructor(fb: FormBuilder, private router: Router, private authService: AuthService, private contraService: ContratService) {
    this.fa = fb.group({
      'username': [null, Validators.compose([Validators.required])],
      'password': [null, Validators.required]
    });
    this.fa1 = fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required],
      "password_confirmation": [null, Validators.required]
    });
  }

  ngOnInit(): void {

  }

  /* cambio() {
       this.isCambio = true;
       this.isAnnulla = false;
       this.credenziale_non_valid = false;
       this.colone_stabilise_error = true;
   }*/
  async cambio() {

    if (!this.fa.valid) {
      console.log("invalid form summitted");
      return null;
    }

    this.loading = true;
    await this.authService.login(this.fa.value.email, this.fa.value.password).then((res: any) => {
      console.log(res);

      this.username = res.user.username;
      console.log(' dedans 111111111111111111111111' + this.username);
      this.isCambio = true;
      this.isAnnulla = false;
      this.credenziale_non_valid = false;
      this.colone_stabilise_error = true;

    }).catch((error: any) => {
      console.log('111111111111111111111111');
      console.log(error);
      this.loading = false;
      //this.modalService.dismissAll();
      this.credenziale_non_valid = true;
      this.colone_stabilise_error = false;
    });;
  }
  // pour le cambio password il manque juste la route
  async conferma() {
    this.fa1.value.username = this.username;
    console.log(this.fa1.value);
    if (!this.fa.valid) {
      console.log("invalid form summitted");
      return null;
    }

    this.loading = true;
    await this.contraService.cambiopassword(this.fa1.value).then((res: any) => {
      console.log(res);
      console.log(' dedans 111111111111111111111111');
      this.credenziale_non_valid = true;
      this.colone_stabilise_error = false;
      this.flag_aggior = true;
      this.flag_non_aggior = false;

    }).catch((error: any) => {
      console.log('111111111111111111111111');
      console.log(error);
      //this.modalService.dismissAll();
      this.loading = false;
      this.credenziale_non_valid = true;
      this.colone_stabilise_error = false;
      this.flag_aggior = false;
      this.flag_non_aggior = true;
    });;
  }

  annulla() {
    this.isCambio = false;
    this.isAnnulla = true;
    this.credenziale_non_valid = false;
    this.colone_stabilise_error = true;
    this.flag_aggior = false;
    this.flag_non_aggior = false;

  }

  okLogin() {
    this.credenziale_non_valid = false;
    this.colone_stabilise_error = true;
  }
  okChanpasswor() {
    this.credenziale_non_valid = false;
    this.colone_stabilise_error = true;
    this.flag_aggior = false;
    this.flag_non_aggior = false;

  }
  /* login(data: any) {
     console.log(data);
      this.authService.login(data).subscribe( (res: any) => {
       console.log(res);
       const id = res.body.user.id;
       localStorage.setItem('userId', id);
       // console.log("yeppp");
       //console.log(id_user);

       this.authService.saveId(id);
       const jwt = res.body.token.original.access_token;
       console.log("ecooo jwt"+jwt);
       this.authService.saveToken(jwt);
       this.router.navigate(['home']);


     }, err =>{
       console.log("get the error ==="+JSON.stringify(err));
     });

   }*/

  async login() {

    /* if (!this.fa.valid) {
      console.log("invalid form summitted");
      return null;
    } */
    this.loading = true;
    await this.authService.login(this.fa.value.username, this.fa.value.password).then((res: any) => {
      console.log(res);
      this.router.navigate(['home']);
      console.log(' dedans 111111111111111111111111' + this.username);
      console.log('je suis dans dans errorror 5555');
      localStorage.setItem("token", res.accessToken);
      console.log(res.role[0].id);
      console.log(res.societas[0].id);
      localStorage.setItem("idUser", res.id);
      localStorage.setItem('id_societa', res.societas[0].id);
      localStorage.setItem("idRole", res.role[0].id);
      console.log(res.roles[0]);
      console.log('ecco id role');
      console.log(localStorage.getItem('idRole'));
      console.log(localStorage.getItem("idUser"));
      console.log('id societa');
      console.log(localStorage.getItem("id_societa"));

    }).catch((error: any) => {
      console.log('111111111111111111111111');
      console.log('je suis dans dans errorror');
      this.loading = false;
      console.log(error);
      this.credenziale_non_valid = true;
      this.colone_stabilise_error = false;
      //this.modalService.dismissAll();
    });;

  }

}
