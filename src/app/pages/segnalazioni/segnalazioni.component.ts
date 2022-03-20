import { Component, OnInit, ViewChild , ElementRef, ChangeDetectorRef} from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import {  MatSort } from '@angular/material/sort';
import {MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router} from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { FormValidationService } from 'src/app/service/validation/form-validation.service';
import { Detagliocontrato } from 'src/app/models/detagliocontrato';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {
  COMMA,
  ENTER
} from '@angular/cdk/keycodes';
import { SelectionModel } from '@angular/cdk/collections';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
declare var require: any;
const swal = require("sweetalert2");
const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

export interface conttatoElement {
  sel: string;
  tipologia: string;
  contratto: string;
  note: string;
  documenti: string;

}

const conttatoElement: conttatoElement[] = [
  {sel: '', tipologia: '', contratto: '', note: '', documenti: 'contratto.pdf'},
  {sel: '', tipologia: '', contratto: '', note: '', documenti: ''},
  {sel: '', tipologia: '', contratto: '', note: '', documenti: ''},
];

@Component({
  selector: 'app-segnalazioni',
  templateUrl: './segnalazioni.component.html',
  styleUrls: ['./segnalazioni.component.scss']
})

export class SegnalazioniComponent implements OnInit {

  displayedColumns: string[] = ['azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto','segnalazione'];
  displayedColumnstipo: string[] = ['','azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto','segnalazione'];
  displayedColumns1: string[] = ['id', 'tipo_doc', 'id_contrat', 'note', 'documenti','botton'];
  @ViewChild("paginatorcontrat", {
    static: false
  }) paginatorcontrat: MatPaginator | undefined;
  loading_invia_btn: boolean = false;
  @ViewChild('scheduledOrdersPaginator') set paginator(pager:MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }
  @ViewChild("sortcontrat") sortcontrat: MatSort | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild("paginatorcontratmodal", {
    static: false
  }) paginatorcontratmodal: MatPaginator | undefined;
  @ViewChild("sortcontratmodal") sortcontratmodal: MatSort | undefined;
  @ViewChild('exporter') exporter: ElementRef | undefined;
  excelfile: any = 'ExcelSheet.xlsx';
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  mailCtrl = new FormControl();
  filename: any;
  tipo: string = "azienda";
  component: string = "listacontratti";
  fileexcel: File | undefined;
  dataSource1:any;
  faCoffee = faCoffee;
  valid:boolean = false;
  fa: FormGroup;
  fa1: FormGroup;
  fa2: FormGroup;
  submitted:boolean = false;
  loading: boolean = false;
  rows:any;
  vet = [];
  toto = [];
  rowCount: any;
  fileName: any;
  file:any;
  search: any=''
  colone: any=''
  flag_edit: boolean = false;
  flag_normal: boolean = false;
  flag_segnali1: boolean = false;
  flag_segnali2: boolean = true;
  flag_besol = false;
  flag_becons = false;
  flag_ibe = false;
  flag_besfcs = false;
  flag_home: boolean = true;
  flag_modal: boolean = false;
  flag_create: boolean = true;
  flag_seganli_nouvo: boolean = true;
  flag_seganli_edit: boolean = false;
  segnailsazioni: any = '';
  flag_readoly: boolean = false;
  id_filecontrat: any;
  dataSource: any;
  arrayValore: { importo: string , valore: string }[] = [];
  added: boolean = false;
  selection = new SelectionModel<any>(true, []);
  selectedData: any = [];
  loading_sfoglia_btn: boolean = false;
  loading_salva_btn: boolean = false;
  fa3: any;
  flag_gestione : boolean = false;

  selectable = true;
  selectable1 = true;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sendcontrato: ContratService,
    private toastr: ToastrService,
    private validationService: FormValidationService,
    private fb: FormBuilder ) {
      let id_user_role = localStorage.getItem('idRole');
      if(id_user_role == '5') {
        this.flag_gestione = true;
      }
    this.flag_readoly = false;
    this.fa = this.validationService.detagliocontratoForm(null,'');
     this.loadTable(false);
     this.fa1 = fb.group({
      'cars': [null, Validators.required],
      'value': [null, Validators.required]
    });
    this.fa2 = fb.group({
      'tipo_doc': [null, Validators.required],
      'id_contrat': [''],
      'documenti': [null],
      'note': [null, Validators.required],
    });

    this.fa3 = fb.group({
      'a': [[], [Validators.required]],
      'cc': [[], [Validators.required]],
      'oggetto': [null, Validators.required],
      'corpo': [null, Validators.required],
    });
  }

  onChangeSelect() {
  }

  public addValoreImporto(value:string, importo:string) {
    console.log("this.fa.controls['tipo_importo'].valid==="+this.fa.controls['tipo_importo'].valid);
    console.log("this.fa.controls['valore_importo'].valid==="+this.fa.controls['valore_importo'].valid);
    if (!this.fa.controls['tipo_importo'].valid || !this.fa.controls['valore_importo'].valid) {
      console.log("has entered inside the condition");
      this.added = true;
      return null;
    }
    this.arrayValore.push({importo: importo, valore: value});
  }

  public removeValoreImporto(index:number) {
    console.log("getting the index =="+index);
    this.arrayValore.splice(index,1);
  }

  invia() {
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
      oggetto: this.fa3.value.oggetto,
      filename: this.filename,
      type: 'edit',
      id_contrat: this.fa.value.id_contrat,
      corpo: this.fa3.value.corpo
    }
    console.log("incompleted are ==" + this.findInvalidControls(this.fa3));
    if (!this.fa3.valid) return;
    this.sendcontrato.envoiMail(data, this.fileexcel).then((data) => {
      console.log("hello" + JSON.stringify(data));
      this.loading_invia_btn = false;
      this.toastr.success(data.message, 'Invia Mail',{
        timeOut: 3000,
      });
    }).catch((error) => {
      this.loading_invia_btn = false;
      this.toastr.error(error, 'Invia Mail',{
        timeOut: 3000,
      });
      console.log("error message is the following ==>" + JSON.stringify(error));
    });
  }

  public findInvalidControls(fa: FormGroup) {
    const invalid = [];
    const controls = fa.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }
  flag_aziende() {
    let id_role = localStorage.getItem('idRole');
    let id_societa = localStorage.getItem('id_societa');
    console.log('888888888888888888888888888888888888888888888888888888888')
    console.log(id_role);
    console.log(id_societa);
    if(id_role == '1' && id_societa == '2'){
      this.flag_becons = true;
      this.flag_ibe = true;
      this.flag_besfcs = true;
     }
    if(id_role == '1' && id_societa == '1'){
      this.flag_besol = true;
      this.flag_ibe = true;
      this.flag_besfcs = true;
    }
    if(id_role == '1' && id_societa == '3'){
      this.flag_besol = true;
      this.flag_besfcs = true;
      this.flag_becons = true;
    }
    if(id_role == '1' && id_societa == '4'){
      this.flag_besol = true;
      this.flag_ibe = true;
      this.flag_becons = true;
    }
    if(id_role == '5'){
      this.flag_besol = true;
      this.flag_ibe = true;
      this.flag_becons = true;
      this.flag_besfcs = true;
    }
  }

  loadTable(loadOrNot:boolean) {
    this.loading=loadOrNot;
    // getSegnalisazione
    this.sendcontrato.getSegnalisazione().then((data) => {
      this.rows = data.list;
      this.toto = data.list;
      console.log(this.rows);
      this.cdr.detectChanges();
      this.rowCount = data.list.length;
      this.dataSource = new MatTableDataSource(this.rows);
      if(this.rows.length != 0) {
        this.flag_segnali1 = true;
        this.flag_segnali2 = false;
      }
      setTimeout(() => (this.dataSource.paginator = this.paginatorcontrat));
      setTimeout(() => (this.dataSource.sort = this.sortcontrat));
      this.loading=false;
    }).catch((error) => {
      console.log(error);
    });
  }

  loadTable2(data: any) {
    this.dataSource1 = new MatTableDataSource(data);
    this.cdr.detectChanges();
    setTimeout(() => (this.dataSource1.paginator = this.paginatorcontratmodal));
    setTimeout(() => (this.dataSource1.sort = this.sortcontratmodal));
  }

  public doFilter = () => {
    if(this.search.lenght!=0){
      this.dataSource.filter = this.search.trim().toLocaleLowerCase();
    }else{
      this.loadTable(false);
    }
  };

  onChange(value:string){
    this.colone = value;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      switch(value) {
        case "": {
         this.loadTable(false);
         return null;
        }
        case "azienda": {
          return data.azienda == filter;
        }
        case "id": {
          return data.id == filter;
        }
        case "tipologia_contratto": {
          return data.tipologia_contratto == filter;
        }
        case "sede": {
          return data.sede == filter;
        }
        case "stato_contratto": {
          return data.stato_contratto == filter;
        }
        case "segnalazione": {
          return data.segnalazione == filter;
        }
        default: {
          return null;
        }
      }
    };
  }

  home() {
    this.router.navigate(['home']);
  }

  inter() {
    this.router.navigate(['interrogazioni']);
  }

  nouva() {
    this.router.navigate(['footer']);
  }

  dismiss(){
    this.flag_aziende();
    this.flag_home = true;
    this.flag_modal = false;
    this.loadTable(false);
    this.flag_readoly = false;
    this.submitted = false;
    this.flag_seganli_nouvo = true;
    this.flag_seganli_edit = false;
  }

  Nouvo() {
    this.flag_aziende();
    this.submitted = false;
    this.flag_normal = true;
    this.flag_edit = false;
    this.flag_home = false;
    this.flag_modal = true;
    this.flag_create = true;
    this.flag_seganli_nouvo = true;
    this.flag_seganli_edit = false;
    this.flag_readoly = false;

    this.fa = this.validationService.detagliocontratoForm(null, '');
    this.onChangefile(null);
    this.fa2 = this.fb.group({
      'tipo_doc': [null, Validators.required],
      'id_contrat': [''],
      'documenti': [null],
      'note': [null, Validators.required],
    });
    this.dataSource1 = new MatTableDataSource(null);
  }

  async deletecontrat() {
    await swal.mixin({
      buttonsStyling: true,
    }).fire({
      title: "",
      text: "Sei sicuro di voler eliminare questa registrazione?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Elimina",
      cancelButtonText: "Annulla",
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: (login) => {
        return this.sendcontrato.deleteContat(this.fa.value).then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        }).catch((error) => {
          /* this.toastr.error(error, 'Elimina Contratti',{
            timeOut: 3000,
          }); */
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    }).then((result) => {
      if (result.value) {
        this.loadTable(true);
        this.toastr.success(result.message, 'Elimina Contratti',{
          timeOut: 3000,
        });
      } else {
        console.log("cancellation===" + JSON.stringify(result));
      }
    });
  }

  private catchFileType(filename:string):any {
    let extension = filename.slice(8).split('.').pop();
      let mimeType = '';
      switch (extension) {
        case "png": case "gif": case "bmp": case "jpeg":
        case "webp":{
          mimeType = "image/"+extension;
          break;
        }
        case "webp":{
          mimeType = "image/"+extension;
          break;
        }
        case "pdf": {
          mimeType = "application/"+extension;
          break;
        }
        case "docm": {
          mimeType = "application/vnd.ms-word.document.macroEnabled.12";
          break;
        }
        case "docx": {
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
          break;
        }
        case "dotx": {
          mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
          break;
        }
        case "dotm": {
          mimeType = "application/vnd.ms-word.template.macroEnabled.12";
          break;
        }
      }
    return mimeType;
  }

  async pathUpload(id) {
    console.log(id.slice(8).split('.').pop());
    await this.sendcontrato.getfile(id).subscribe(response => {   // API -  this.downloadDocument(id)
      let FileType = this.catchFileType(id);
      this.downloadFileFromBlob(response,FileType);
    }, error => { })
  }


  downloadFileFromBlob(data, FileType) {
    //for chrome of ios
    if (navigator.userAgent.match('CriOS')) {
      let fileData = [data];
      var reader = new FileReader();
      var blob = new Blob(fileData, { type: FileType });
      reader.onload = function (e) {
        // window.location.href = reader.result;
      }
      reader.readAsDataURL(blob);
    }
    // for IE and edge browser
    else if (window.navigator.msSaveOrOpenBlob) {
      let fileData = [data];
      let blobObject = new Blob(fileData);
      window.navigator.msSaveBlob(blobObject);
    }
    //for all other browser
    else {
      let fileData = [data];
      var blob = new Blob(fileData, { type: FileType });
      let url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  }

  private async  showContrat(): Promise<any> {
    this.sendcontrato.ShowContrat(this.fa.value.id_contrat).then((data)=>{
      this.loadTable2(data.data.fileContrats);
    }).catch((error)=>{
      console.log(error);
    })
  }

  async eliminadoc() {
    console.log(JSON.stringify(this.selection.selected));
    await swal.mixin({
      buttonsStyling: true,
    }).fire({
      title: "",
      text: "Sei sicuro di voler eliminare questa registrazione?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Elimina",
      cancelButtonText: "Annulla",
      showLoaderOnConfirm: true,
      reverseButtons: true,
      preConfirm: (login) => {
        return this.sendcontrato.deleteContatfile(this.selection.selected).then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        }).catch((error) => {
          /* this.toastr.error(error, 'Elimina Documenti',{
            timeOut: 3000,
          }); */
        });
      },
      allowOutsideClick: () => !swal.isLoading(),
    }).then((result) => {
      if (result.value) {
        this.selection.clear();
        this.showContrat();
        this.toastr.success(result.message, 'Elimina Documenti',{
          timeOut: 3000,
        });
      } else {
        console.log("cancellation===" + JSON.stringify(result));
      }
    });
  }

  openEditModalFilecontrat(id: any, documente: any) {
    localStorage.setItem('id_filecontrat',id);
    localStorage.setItem('path_upload',documente);
  }

  async edit1() {
    let value = this.fa.value.azienda;
    switch (value) {
      case "beconsulting": {
        localStorage.setItem('idAzienda', '1');
        break;
      }
      case "besolutions": {
        localStorage.setItem('idAzienda', '2');
        break;
      }
      case "ibe": {
        localStorage.setItem('idAzienda', '3');
        break;
      }
      case "besfcs": {
        localStorage.setItem('idAzienda', '4');
        break;
      }
    }
    if (this.arrayValore.length === 0 ) {
      this.submitted = true;
      return true;
    }

    if (this.fa.valid) {
      this.loading_salva_btn = true;
      this.fa.value.tipo_importo = JSON.stringify(this.arrayValore);
      await this.sendcontrato.create(this.fa.value).then(
        (data)=>{
        this.submitted = false;
        this.loadTable(false);
        this.flag_create = false;
        this.toastr.success(data.message, 'Nuova Contratti',{
          timeOut: 3000,
        });
        let detaglio;
        let data1 = data.data;
        detaglio = new Detagliocontrato(
          data1.id,
          data1.id_user,
          data1.owner,
          data1.sede,
          data1.azienda,
          data1.codice,
          data1.tipo_importo,
          data1.fornitore,
          data1.iva,
          data1.lop_cliente,
          data1.tipologia_contratto,
          data1.stato_contratto,
          data1.data_validata,
          data1.rinnovo_automatico,
          data1.data_disdetta,
          data1.note,
          data1.mail_preavviso,
          data1.mail_contratto,
          data1.data_rinnovo,
          data1.periodo,
          data1.preavviso,
          data1.data_scadenza,
          data1.segnalazione,
        );
        this.loading_salva_btn = false;
        this.fa = this.validationService.detagliocontratoForm(detaglio, 'edit');
        }
      ).catch(
        (error)=>{
          this.loading_salva_btn = false;
          console.log("error"+JSON.stringify(error));
        }
      )
    } else {
      this.submitted = true;
      this.loading_salva_btn = false;
    }
    return null;
  }

  onChangefile(file: File) {
    this.file = file;
  }

  async onfile() {
    console.log('fffffffffffff');
    this.fa2.value.id_contrat = this.fa.value.id_contrat;
    if (this.fa2.invalid) {
      return null;
    }
    //console.log(this.fa2.value);
    this.loading_sfoglia_btn = true;
    await this.sendcontrato.uploadfile(this.file,this.fa2.value,this.fa.value.id_contrat).then((data) =>{
      this.toastr.success(data.message, 'Sfoglia Contratti',{
        timeOut: 3000,
      });
      this.loading_sfoglia_btn = false;
      this.loadTable2(data.data.fileContrats);
    }).catch((error) =>{
      console.log(error);
      this.loading_sfoglia_btn = false;
    });
  }

  async sendmail(targetModal: any) {
    this.modalService.open(targetModal, {
      centered: false,
      backdrop: "static",
      size: 'lg',
    });
  }

  async edit2() {
    let value = this.fa.value.azienda;
    switch (value) {
      case "beconsulting": {
        localStorage.setItem('idAzienda', '1');
        break;
      }
      case "besolutions": {
        localStorage.setItem('idAzienda', '2');
        break;
      }
      case "ibe": {
        localStorage.setItem('idAzienda', '3');
        break;
      }
      case "besfcs": {
        localStorage.setItem('idAzienda', '5');
        break;
      }
    }

    if (this.arrayValore.length === 0 ) {
      this.submitted = true;
      return true;
    }

    if (this.fa.valid) {
      this.loading_salva_btn = true;
      this.fa.value.tipo_importo = JSON.stringify(this.arrayValore);
      await this.sendcontrato.update(this.fa.value).then(
        (data) => {
          this.loadTable(true);
          this.toastr.success(data.message, 'Salva Contratti',{
            timeOut: 3000,
          });
          this.flag_home = true;
          this.flag_modal = false;
          this.loading_salva_btn = false;
        }
      ).catch(
        (error) => {
          console.log("error" + JSON.stringify(error));
          this.loading_salva_btn = false;
          this.toastr.error(error, 'Salva Contratti',{
            timeOut: 3000,
          });
        }
      )
    } else {
      this.submitted = true;
      this.loading_salva_btn = false;
    }
    return null;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource1.data.forEach(row => this.selection.select(row));
  }

  public disableDeleteDocBtn() {
    return this.selection.selected.length === 0;
  }

  openEditModal2(id: any) {
    this.fa.controls.fornitore.disable();
    let trovato_user = 0;
    let trovato_admin = 0;
    let trovato_logistica = 0;
    let  trovato_super_admin = 0;
    this.flag_create = false;
    this.flag_normal = false;

    this.flag_edit = true;
    this.flag_home = false;
    this.flag_modal = true;
    let detaglio;
    let data = this.rows.filter((x: any) => x.id == id);
    this.loadTable2(data[0].fileContrats);
    console.log("data[0].tipo_importo==>"+JSON.stringify(data[0].tipo_importo));
    this.arrayValore = JSON.parse(data[0].tipo_importo);
    console.log("this.arrayValore==="+JSON.stringify(this.arrayValore));

    detaglio = new Detagliocontrato(
      data[0].id,
      data[0].id_user,
      data[0].owner,
      data[0].sede,
      data[0].azienda,
      data[0].codice,
      this.arrayValore[0].importo,
      data[0].fornitore,
      data[0].iva,
      data[0].lop_cliente,
      data[0].tipologia_contratto,
      data[0].stato_contratto,
      data[0].data_validata,
      data[0].rinnovo_automatico,
      data[0].data_disdetta,
      data[0].note,
      data[0].mail_preavviso,
      data[0].mail_contratto,
      data[0].data_rinnovo,
      data[0].periodo,
      data[0].preavviso,
      data[0].data_scadenza,
      data[0].segnalazione,
    );

    let id_user_role = localStorage.getItem('idRole');
    let id_societa = localStorage.getItem('id_societa');

    if (id_user_role == '1' && id_societa == data[0].societa.id) {
      trovato_user = 1;
    }
    if (id_user_role == '2' && data[0].user.roles[0].id == '2') {
      trovato_admin = 1;
    }
    if (id_user_role == '3' && data[0].user.roles[0].id == '3') { // role 3 logistica d apres le code
      trovato_logistica = 1;
    }
    if(id_user_role == '4') {
      trovato_super_admin = 1;
    }
    if(id_user_role == '5') {
      this.flag_gestione = true;
    }
    let tabl: any[] = [];
    tabl.push(detaglio);
    this.exportAsExcelFile(tabl,"testing");
    detaglio.valore_importo = this.arrayValore[0].valore;
    detaglio.tipo_importo = this.arrayValore[0].importo;
    if (trovato_user == 1 || trovato_admin == 1 || trovato_logistica == 1 || trovato_super_admin == 1) {
      this.fa = this.validationService.detagliocontratoForm(detaglio, 'edit');
    }

    if (trovato_user == 0 && trovato_admin == 0 && trovato_logistica == 0 && trovato_super_admin == 0) {
      this.flag_readoly = true;
      this.fa = this.validationService.detagliocontratoForm(detaglio, 'edit');
    }

    if(data[0].segnalazione.length!=0){
      this.segnailsazioni = data[0].segnalazione;
      this.flag_seganli_nouvo = false;
      this.flag_seganli_edit = true;
    } else {
      this.flag_seganli_nouvo = true;
      this.flag_seganli_edit = false;
    }
  }

  async openModalAdd() {
    this.flag_aziende();
    this.flag_normal = true;
    this.flag_edit = false;
    this.flag_home = false;
    this.flag_modal = true;
    this.flag_create = true;
    this.flag_seganli_nouvo = true;
    this.flag_seganli_edit = false;
    this.flag_readoly = false;
    this.fa = this.validationService.detagliocontratoForm(null, '');
    this.fa2 = this.fb.group({
      'tipo_doc': [null, Validators.required],
      'id_contrat': [''],
      'documenti': [null],
      'note': [null, Validators.required],
    });
    this.dataSource1 = new MatTableDataSource(null);
  }

  exportexcel(tableId: string = "ExampleTable1", name ? : string): void {
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    let wb = XLSX.utils.table_to_book(targetTableElm, < XLSX.Table2SheetOpts > {
      sheet: prefix
    });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: {
        'data': worksheet
      },
      SheetNames: ['data']
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    this.filename = 'fileName' + new Date().getTime() + '.xlsx';
    this.fileexcel = new File([data], this.filename, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
  }

  ngOnInit(): void {
    let id_user_role = localStorage.getItem('idRole');
    if(id_user_role == '5') {
      this.flag_gestione = true;
    }
    this.flag_aziende();
    this.flag_readoly = false;
    this.submitted = false;
    this.flag_seganli_nouvo = true;
    this.flag_seganli_edit = false;
    this.loadTable(false);
    console.log(this.rows);
    this.loadTable(false);
    console.log(this.rows);
    this.loadTable(false);
 $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }

}
