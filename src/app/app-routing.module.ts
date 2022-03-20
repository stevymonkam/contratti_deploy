import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { UpdatePasswordComponent } from './pages/auth/update-password/update-password.component';
import { ListacontratiComponent } from './pages/listacontrati/listacontrati.component';
import { PagesModule } from './pages/pages.module';
import { SegnalazioniComponent } from './pages/segnalazioni/segnalazioni.component';
import { InterrogazioniComponent } from './pages/interrogazioni/interrogazioni.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DetagliocontratoComponent } from './pages/detagliocontrato/detagliocontrato.component';







//const routes: Routes = [];
const routes: Routes = [
  { path: '', redirectTo: 'login',pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'password-reset', redirectTo: 'password-reset', pathMatch: 'full'},
  { path: 'password-reset', component: ResetPasswordComponent },
  { path: 'user/new-password/:token', redirectTo: 'user/new-password/:token', pathMatch: 'full' },
  { path: 'user/new-password/:token',component: UpdatePasswordComponent },
  { path: 'home', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',component: ListacontratiComponent },
  { path: 'segnalazioni',component: SegnalazioniComponent },
  { path: 'detagliocontrato',component: DetagliocontratoComponent },
  { path: 'interrogazioni',component: InterrogazioniComponent },
  { path: 'header',component: HeaderComponent},
  { path: 'footer',component: FooterComponent},






 {
    path: '',
    component: LayoutComponent,
    children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: '', loadChildren: () => PagesModule },
    ]
  } /* ,
  { path: '404', component: NotFoundComponent },
  {path: '**', redirectTo: '/404'} */
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
