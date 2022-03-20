import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/service/validation/form-validation.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { ThrowStmt } from '@angular/compiler';
import { Detagliocontrato } from 'src/app/models/detagliocontrato';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { HeaderComponent } from 'src/app/layout/header/header.component';
import { ComponentService } from 'src/app/service/component/component.service';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { TagModel } from 'ngx-chips/core/accessor';
const EXCEL_EXTENSION = '.xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
declare var require: any;
const swal = require("sweetalert2");
@Component({
  selector: 'app-listacontrati',
  templateUrl: './listacontrati.component.html',
  styleUrls: ['./listacontrati.component.scss']
})
export class ListacontratiComponent implements OnInit {
  displayedColumns: string[] = ['azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto', 'data_scadenza', 'preavviso', 'owner', 'fornitore'];
  displayedColumns1: string[] = ['id', 'tipo_doc', 'id_contrat', 'note', 'documenti','botton'];
  displayedColumnstipo: string[] = ['','azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto','segnalazione'];
  dataSource1: any;
  faCoffee = faCoffee;
  valid: boolean = false;
  fa: FormGroup;
  fa1: FormGroup;
  fa2: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;
  rows: any;
  rows1: any;
  vet = [];
  toto = [];
  rowCount: any;
  search: any = '';
  colone: any = '';
  fileName: any;
  rows_file: any;
  contrafile: any = 'https://bulma.io/images/placeholders/480x480.png';
  file: any;
  flag_edit: boolean = false;
  flag_normal: boolean = false;
  flag_home: boolean = true;
  flag_modal: boolean = false;
  flag_create: boolean = true;
  flag_seganli_nouvo: boolean = true;
  flag_seganli_edit: boolean = false;
  segnailsazioni: any = '';
  flag_besol = false;
  flag_becons = false;
  flag_ibe = false;
  flag_besfcs = false;
  flag_gestione = false;

  @ViewChild("paginatorcontrat", {
    static: false
  }) paginatorcontrat: MatPaginator | undefined;
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

  selectable = true;
  selectable1 = true;
  flag_readoly: boolean = false;
  id_filecontrat: any;
  flag_segnali1: boolean = false;
  flag_segnali2: boolean = true;

  // mailInputcc
  dataSource: any;
  fa3: any;
  visible = true;
  arrayValore: { importo: string , valore: string }[] = [];
  added: boolean = false;
  selection = new SelectionModel<any>(true, []);
  selectedData: any = [];
  loading_sfoglia_btn: boolean = false;
  loading_salva_btn: boolean = false;
  a = "a";
  cc = "cc";
  loading_invia_btn: boolean = false;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private validationService: FormValidationService,
    private auth: AuthService,
    private toastr: ToastrService,
    private serviceComponent: ComponentService,
    private sendcontrato: ContratService,
    private fb: FormBuilder
  ) {
    let id_user_role = localStorage.getItem('idRole');
    if(id_user_role == '5') {
      this.flag_gestione = true;
    }
    this.flag_readoly = false;
    this.fa = this.validationService.detagliocontratoForm(null, '');
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
    let emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.fa3 = fb.group({
      'a': [[], [Validators.required]],
      'cc': [[]],
      'oggetto': [null, Validators.required],
      'corpo': [null, Validators.required],
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

  /* end tag input or chip input */
  infos(id:any){}

  invia() {
    alert('invia');

    this.loading_invia_btn = true;
    this.submitted = true;
    let a = [];
    let cc = [];
    for(let i=0; i < this.fa3.value.a.length; i++) {
      a.push(this.fa3.value.a[i].value);
    }
    console.log("stevyyyyyyyyyyyyyyyyyyyyyy11111111111111111111");

    // mvelemvele@gmail.com, aristidewilfried656@gmail.com, aristide.money@gmail.com
    for(let i=0; i < this.fa3.value.cc.length; i++) {
      cc.push(this.fa3.value.cc[i].value);
    }
    console.log("stevyyyyyyyyyyyyyyyyyyyyyy11111111111111111111222222222222222");

    let data = {
      a: JSON.stringify(a),
      cc: JSON.stringify(cc),
      oggetto: this.fa3.value.oggetto,
      filename: this.filename,
      type: 'edit',
      id_contrat: this.fa.value.id_contrat,
      corpo: this.fa3.value.corpo
    }
    console.log("stevyyyyyyyyyyyyyyyyyyyyyy1111111111113333333333333333333");
    console.log(data);
    console.log(this.fileexcel);


    console.log("incompleted are ==" + data);

    console.log("incompleted are ==" + this.findInvalidControls(this.fa3));
    if (!this.fa3.valid) return;
    this.sendcontrato.envoiMail(data, this.fileexcel).then((data) => {
      this.loading_invia_btn = false;
      this.toastr.success(data.message, 'Invia Mail',{
        timeOut: 3000,
      });
      console.log("hello" + JSON.stringify(data));
    }).catch((error) => {
      this.loading_invia_btn = false;
      this.toastr.error(error, 'Invia Mail',{
        timeOut: 3000,
      });
      console.log("error message is the following ==>" + JSON.stringify(error));
    });
  }

  async sendmail(targetModal: any) {
    this.modalService.open(targetModal, {
      centered: false,
      backdrop: "static",
      size: 'lg',
    });
  }

  exportexcel(tableId: string = "ExampleTable", name ? : string): void {
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
    //FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
  }

  infos1(id: any,doc: any) {
  }

  public doFilter = () => {
    if(this.search.lenght!=0){
      this.dataSource.filter = this.search.trim().toLocaleLowerCase();
    }else{
      this.loadTable(false);
    }
  };

  onChange(value: string) {
    console.log(value);
    this.colone = value;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      switch (value) {
        case "": {
          console.log(data.azienda == filter);
          this.loadTable(false);
          return null;
        }
        case "azienda": {
          console.log(data.azienda == filter);
          return data.azienda == filter;
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
        case "data_scadenza": {
          return data.data_scadenza == filter;
        }
        case "preavviso": {
          return data.preavviso == filter;
        }
        case "owner": {
          return data.owner == filter;
        }
        case "fornitore": {
          return data.fornitore == filter;
        }
        default: {
          console.log("Invalid choice");
          return null;
        }
      }
    };
  }

  loadTable(loadOrNot: boolean) {
    this.loading = loadOrNot;
    this.sendcontrato.getAll().then((data) => {
      this.rows = data.list;
      this.toto = data.list;
      this.rowCount = data.list.length;
      this.dataSource = new MatTableDataSource(this.rows);
      setTimeout(() => (this.dataSource.paginator = this.paginatorcontrat));
      setTimeout(() => (this.dataSource.sort = this.sort));
      let id = localStorage.getItem('id_filecontrat');
      let datafile = this.rows.filter((x: any) => x.id == id);
      this.loading = false;
    }).catch((error) => {
      console.log(error);
    });
  }

  loadTablesegnali(loadOrNot:boolean) {
    this.loading=loadOrNot;
    this.sendcontrato.getSegnalisazione().then((data) => {
      this.toto = data.list;
      this.rowCount = data.list.length;
      if(this.toto.length != 0) {
        this.flag_segnali1 = true;
        this.flag_segnali2 = false;
      }else{
        this.flag_segnali1 = false;
        this.flag_segnali2 = true;
      }
      this.loading=false;
    }).catch((error) => {
      console.log(error);
    });
  }

  onChangefile(file: File) {
    console.log(file);
    this.file = file;
  }

  loadTable2(data: any) {
    console.log('vriwejhoggvwbovw');
    console.log(data);
    this.dataSource1 = new MatTableDataSource(data);
    this.cdr.detectChanges();
    setTimeout(() => (this.dataSource1.paginator = this.paginatorcontratmodal));
    setTimeout(() => (this.dataSource1.sort = this.sortcontratmodal));
  }

  async onfile() {
    console.log('fffffffffffff');
    this.fa2.value.id_contrat = this.fa.value.id_contrat;
    //console.log(this.fa.value.id_contrat);
    console.log(this.fa.value);
    if (this.fa2.invalid) {
      return null;
    }
    //console.log(this.fa2.value);
    this.loading_sfoglia_btn = true;
    await this.sendcontrato.uploadfile(this.file, this.fa2.value, this.fa.value.id_contrat).then((data) => {
      this.toastr.success(data.message, 'Sfoglia Contratti',{
        timeOut: 3000,
      });
      this.loading_sfoglia_btn = false;
      this.loadTable2(data.data.fileContrats);
    }).catch((error) => {
      console.log(error);
      this.loading_sfoglia_btn = false;
    })
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

  openEditModalFilecontrat(id: any, documente: any) {
    localStorage.setItem('id_filecontrat',id);
    localStorage.setItem('path_upload',documente);
  }

  private catchFileType(filename:string):any {
    let extension = filename.slice(8).split('.').pop();
      let mimeType = '';
      switch (extension) {
        case "png": case "gif": case "bmp": case "jpeg": case "jpg": case "JPG":
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
      //newWindow.location = url; // open in new window
    }
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

  public disableDeleteDocBtn() {
    return this.selection.selected.length === 0;
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
          console.log("response.json()===>"+JSON.stringify(response.json()));
          console.log("response.json(1)===>"+JSON.stringify(response));
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
        console.log(JSON.stringify(result));
      } else {
        console.log("cancellation===" + JSON.stringify(result));
      }
    });
  }

  async deletecontrat() {
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
        console.log("*******" + JSON.stringify(result));
        this.toastr.success(result.message, 'Elimina Contratti',{
          timeOut: 3000,
        });
        this.modalService.dismissAll();
        console.log(JSON.stringify(result));
      } else {
        console.log("cancellation===" + JSON.stringify(result));
      }
    });
  }

  edit1() {
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
      this.sendcontrato.create(this.fa.value).then(
        (data) => {
          this.submitted = false;
          this.loadTable(false);
          console.log("response" + JSON.stringify(data));
          console.log("create create");
          this.toastr.success(data.message, 'Nuova Contratti',{
            timeOut: 3000,
          });
          this.flag_create = false;
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
          console.log("faaaaaaaaaaaaaa");
          console.log(this.fa);
        }
      ).catch(
        (error) => {
          this.loading_salva_btn = false;
          this.toastr.error(error, 'Nuova Contratti',{
            timeOut: 3000,
          });
          console.log("error" + JSON.stringify(error));
        }
      )
    } else {
      this.submitted = true;
      this.loading_salva_btn = false;
      console.log("incompleted are ==" + this.findInvalidControls(this.fa));
    }
    return true;
  }

  edit2() {
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
      this.sendcontrato.update(this.fa.value).then(
        (data) => {
          console.log('contrat aggiorner avec succes');
          console.log(data);
          this.loadTable(true);
          this.flag_home = true;
          this.flag_modal = false;
          this.toastr.success(data.message, 'Salva Contratti',{
            timeOut: 3000,
          });
          this.loading_salva_btn = false;
        }
      ).catch(
        (error) => {
          this.toastr.error(error, 'Salva Contratti',{
            timeOut: 3000,
          });
          this.loading_salva_btn = false;
          console.log("error" + JSON.stringify(error));
        }
      )
    } else {
      this.submitted = true;
      this.loading_salva_btn = false;
      console.log("incompleted are ==" + this.findInvalidControls(this.fa));
    }
    return true;
  }

  opensegnali() {
    this.router.navigate(['segnalazioni']);
  }

  openinterrogazioni() {
    this.router.navigate(['interrogazioni']);
  }

  flag_aziende() {
    let id_role = localStorage.getItem('idRole');
    let id_societa = localStorage.getItem('id_societa');
    console.log('888888888888888888888888888888888888888888888888888888888')
    console.log(id_role);
    console.log(id_societa);
    if(id_role == '1' && id_societa == '2'){ // corisponde a solutions
      this.flag_becons = true;
      this.flag_ibe = true;
      this.flag_besfcs = true;
     }
    if(id_role == '1' && id_societa == '1'){ // corisponde a consulting
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
    this.arrayValore.length = 0;
    this.fa = this.validationService.detagliocontratoForm(null, '');
    this.fa2 = this.fb.group({
      'tipo_doc': [null, Validators.required],
      'id_contrat': [''],
      'documenti': [null],
      'note': [null, Validators.required],
    });
    this.dataSource1 = new MatTableDataSource(null);
  }

  Nouvo() {
    this.submitted = false;
    this.flag_normal = true;
    this.flag_edit = false;
    this.flag_home = false;
    this.flag_modal = true;
    this.flag_create = true;
    this.flag_seganli_nouvo = true;
    this.flag_seganli_edit = false;
    this.flag_readoly = false;
    this.flag_aziende();
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
    //localStorage.setItem('id_societa',data[0].societa.id);
    this.loadTable2(data[0].fileContrats);
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

    console.log("this.id==="+data[0].id);

    let id_user_role = localStorage.getItem('idRole');
    let id_societa = localStorage.getItem('id_societa');

    if (id_user_role == '1' && id_societa == data[0].societa.id) {
      trovato_user = 1;
    }
    console.log('trovato_user uuuuuuuuuuuuuuuuusssssssserrrrrrrrrrrrrr');
    console.log(id_user_role );
    console.log(data[0].user.roles[0].id);


    console.log(trovato_user);
    console.log(id_societa);
    console.log(data[0]);

    console.log(data[0].societa.id);



    if (id_user_role == '2' && data[0].user.roles[0].id == '2') {
      trovato_admin = 1;
    }
    if (id_user_role == '3' && data[0].user.roles[0].id == '3') { // role 3 logistica d apres le code
      trovato_logistica = 1;
    }
    if(id_user_role == '4') {
      trovato_super_admin = 1;
    }
    if(id_user_role == '5'){
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
    if(data[0].segnalazione!=null){
      this.segnailsazioni = data[0].segnalazione;
      this.flag_seganli_nouvo = false;
      this.flag_seganli_edit = true;
    }else{
      this.flag_seganli_nouvo = true;
      this.flag_seganli_edit = false;
    }
  }

  opensignalisazioni() {
    this.router.navigate(['segnalazioni']);
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
    this.loadTablesegnali(false);
    console.log(this.rows);
    this.loadTable(false);
    $("#menu-toggle").click(function (e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }

}



