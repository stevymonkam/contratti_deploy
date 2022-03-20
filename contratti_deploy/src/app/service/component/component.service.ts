import { Injectable, TemplateRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
declare var $: any;
@Injectable({
  providedIn: 'root'
})
export class ComponentService {

  constructor(private toastr: ToastrService) {
    
  }

  toasts: any[] = [];

 // Push new Toasts to array with content and options
 show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
   this.toasts.push({ textOrTpl, ...options });
 }

 notify(message){
   this.toastr.success(message);
 }

 fromJsonDate(jDate): string {
   const bDate: Date = new Date(jDate);
   return bDate.toISOString().substring(0, 10);  //Ignore time
 }

 // Callback method to remove Toast DOM element from view
 remove(toast) {
   this.toasts = this.toasts.filter(t => t !== toast);
 }

 sleep(milliseconds) { 
   let timeStart = new Date().getTime(); 
   while (true) { 
     let elapsedTime = new Date().getTime() - timeStart; 
     if (elapsedTime > milliseconds) { 
       break; 
     } 
   } 
 }

  showNotification(from, align, message, typealert){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
        icon: "notifications",
        message: message

    },{
        type: typealert,/* type[color] */
        timer: 100,
        placement: {
            from: from,
            align: align
        },
        template: 
        '<div data-notify="container" class="col-xl-4 col-lg-4 col-11 col-sm-4 col-md-4 alert alert-{0} alert-with-icon" role="alert">' +
          //'<button mat-button  type="button" aria-hidden="true" class="close mat-button" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
          '<i class="material-icons" data-notify="icon">notifications</i> ' +
          '<span data-notify="title">Message</span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          '</div>' +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }

}
