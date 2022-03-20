import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Component,OnInit, ElementRef, ViewChild, Input} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})


export class HeaderComponent implements OnInit {
  fa3:any;
  submitted:any;
  id_file: any;
  visible = true;
  selectable = true;
  selectable1 = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  mailCtrl = new FormControl();
  filteredMails: Observable<string[]> | undefined;
  mails: string[] = [];
  ccmails: string[] = [];
  allMails: string[] = [];
  file: File | undefined;
  // mailInputcc
  @ViewChild('mailInput') mailInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('mailInputcc') mailInputcc: ElementRef<HTMLInputElement> | undefined;
  @ViewChild('auto') matAutocomplete: MatAutocomplete | undefined;
  @ViewChild('autocc') matAutocompletecc: MatAutocomplete | undefined;
  mailscc: string[] = [];
  filename: string = "";
  @Input() valore: string | undefined;
  @Input() tipo: string | undefined;
  @Input() component: string | undefined;
  loading_invia_btn: boolean;
  constructor(
    private router:Router,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private service: ContratService,
    private fb: FormBuilder) {
      //this.loadEmails();
      this.fa3 = fb.group({
        'a': [[], [Validators.required]],
        'cc': [[]],
        'oggetto': [null, Validators.required],
        'corpo': [null, Validators.required],
      });
    }

  ngOnInit(): void {

  }

  exportexcel(tableId: string="ExampleTable", name?: string): void  {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix });
    let base64 = XLSX.write(wb, { type:'base64' } );
    const imageBlob = this.dataURItoBlob(base64);
    const imageFile = new File([imageBlob], 'fileName.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    this.file = imageFile;
    this.filename = fileName;
    if (name !='email' ) {
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
  }

  dataURItoBlob(dataURI:any) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    return blob;
 }



  invia() {
    this.submitted = true;
    this.loading_invia_btn = true;
    this.submitted = true;
    let a = [];
    let cc = [];
    for(let i=0; i < this.fa3.value.a.length; i++) {
      a.push(this.fa3.value.a[i].value);
    }
    // mvelemvele@gmail.com, aristidewilfried656@gmail.com, aristide.money@gmail.com
    for(let i=0; i < this.fa3.value.cc.length; i++) {
      cc.push(this.fa3.value.cc[i].value);
    }

    let data = {
      a: JSON.stringify(a),
      cc: JSON.stringify(cc),
      oggetto:this.fa3.value.oggetto,
      filename:this.filename,
      type:'send',
      corpo:this.fa3.value.corpo
    };
    if ( !this.fa3.valid) return ;
    this.service.envoiMail(data, this.file).then((data)=>{
      console.log("hello"+JSON.stringify(data));
      this.loading_invia_btn = false;
      this.toastr.success(data.message, 'Invia Mail',{
        timeOut: 3000,
      });
    }).catch((error)=>{
      console.log("error message is the following ==>"+JSON.stringify(error));
      this.loading_invia_btn = false;
      this.toastr.error(error, 'Invia Mail',{
        timeOut: 3000,
      });
    });
  }

  async sendmail(targetModal:any) {
    this.exportexcel('ExampleTable', 'email');
     this.modalService.open(targetModal, {
      centered: false,
      backdrop: "static",
      size: <any>'lg',
    });
  }

  printing(tableId: string="ExampleTable"){
    let targetTableElm = document.getElementById(tableId);
    var divToPrint = targetTableElm;
    var htmlToPrint = '' +
    '<style type="text/css">' +
      'table {'+
      '  border-collapse: collapse;'+
      '  margin-top:200px;'+
      '  width: 100%;'+
      '}'+
      'table, th, td {'+
      '  border: 1px solid black;'+
      '}'+
      'th {'+
      '  background-color: #4CAF50;'+
      '  color: white;'+
      '}'+
      'ul {'+
      '  display:none;'+
      '}'+
      '.footer {'+
      '   position: fixed;'+
      '   bottom: 0;'+
      '   width: 100%;'+
      '   height: auto;'+
      '   text-align: center;'+
      '}'+
      '.header {'+
      '  position: fixed;'+
      '  top: 0;'+
      '  width: 600px;'+
      '  height: 100px;'+
      '}'+
      '.titre {'+
      '  position: fixed;'+
      '  top: 128px;'+
      '  width: 600px;'+
      '  height: 100px;'+
      '}'+
      '.info {'+
      '  width: 174px;'+
      '  height: 100px;'+
      '  float: left;'+
      '}'+
      '.footer-child {'+
      '  float: left;'+
      '  width: auto;'+
      '}'+
    '</style>';
    htmlToPrint += divToPrint.outerHTML;
    const newWin = window.open("");
    newWin.document.write(htmlToPrint);
    newWin.document.write(

    '<div class="header">'+
      '<div class="info">'+
      ' <div style="max-wigth:300px;">'+
      '   <img style="max-width: 150;" src="assets/images/logo.png" />'+
      ' </div>'+
      '</div>'+
      '<div class="info">'+
      ' <div style="margin-top:30px;">'+
      '  <label>'+
      '    <b>xxxxxxxxx </b> <br>'+
      '    <b>Torino</b>' +
      '    <b>Italy</b>' +
      '  </label>'+
      ' </div>'+
      '</div>'+
    '</div>'+
    '<div class="titre" style="text-align:center;">'+
    '<h2> Lista contrati :'+'</h2>'+
    '</div>'
    );
    newWin.document.write(
      '<div class="footer"><hr><div class="footer-child"><img style="min-height:30px; min-width: 16px;" src="assets/images/phone.svg" >&nbsp;&nbsp; </div> <div class="footer-child" style="margin: 15px 9px;">656551855 </div> <div class="footer-child"> <img style="min-height:50px; min-width: 16px;" src="assets/images/globe-solid.svg" >&nbsp;&nbsp; </div> <div class="footer-child" style="margin: 15px 9px;" > xxxxxxx </div> <div class="footer-child"><img style="min-height:50px; min-width: 16px;" src="assets/images/at-solid.svg" >&nbsp;&nbsp;</div> <div class="footer-child" style="margin: 15px 9px;"> contact@socecepme.com</div></div>'
    );

    //setTimeout(function () { // wait until all resources loaded
      //newWin.document.close(); // necessary for IE >= 10
      //newWin.focus(); // necessary for IE >= 10
    newWin.print();  // change window to winPrint
    return false;
      //newWin.close();// change window to winPrint
    //}, 250);
    //newWin.print();
    //newWin.close();
    //PHE.printHtml('<h1>Let\'s print this h1</h1>');
    //PHE.printHtml('<h1>Let\'s print this h1</h1>', {templateString: '<header>I\'m part of the template header</header>{{printBody}}<footer>I\'m part of the template footer</footer>'});
  }
  /*async sendmail(targetModal:any) {
     this.modalService.open(targetModal, {
      centered: false,
      backdrop: "static",
      size: <any>'lg',
    });
  }*/

  uscire() {
    this.router.navigate(['login']);
    localStorage.setItem('idUser','null');
    localStorage.setItem('idRole','null');
  }

}
