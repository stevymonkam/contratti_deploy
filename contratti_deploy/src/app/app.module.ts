import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import {  MatInputModule } from "@angular/material/input";
import {  MatButtonModule } from "@angular/material/button";
import { FormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { ProfileComponent } from './pages/auth/profile/profile.component';
import { UpdatePasswordComponent } from './pages/auth/update-password/update-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { LayoutComponent } from './layout/layout.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatRadioModule} from '@angular/material/radio';
import { SegnalazioniComponent } from './pages/segnalazioni/segnalazioni.component';
import { InterrogazioniComponent } from './pages/interrogazioni/interrogazioni.component';
import { ListacontratiComponent } from './pages/listacontrati/listacontrati.component';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ConfigService } from 'src/app/service/config/config.service';
import { AuthentificationInterceptor } from './security/authentification.interceptor';
import { DetagliocontratoComponent } from './pages/detagliocontrato/detagliocontrato.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ComponentService } from './service/component/component.service';
import { TagInputModule } from 'ngx-chips';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProfileComponent,
    UpdatePasswordComponent,
    ResetPasswordComponent,
    HeaderComponent,
    FooterComponent,
    LayoutComponent,
    SegnalazioniComponent,
    InterrogazioniComponent,
    ListacontratiComponent,
    DetagliocontratoComponent

  ],
  imports: [
    BrowserModule,
    NgbModule,
    FontAwesomeModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // angular material modules
    MaterialFileInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatSortModule,
    MatChipsModule,
    MatAutocompleteModule,
    TagInputModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    HttpClientModule,
    ConfigService,
    ComponentService,
    AuthService,
    ToastrService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthentificationInterceptor,
      multi: true
    }

  ],
  bootstrap: [AppComponent],
  exports: [
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    // angular material modules
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatIconModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatInputModule,
    MatChipsModule,
    TagInputModule,
    MatAutocompleteModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
