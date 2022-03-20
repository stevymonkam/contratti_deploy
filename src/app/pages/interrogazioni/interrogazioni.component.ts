import { Component, OnInit, ViewChild  , ChangeDetectorRef, ElementRef,
} from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import * as $ from 'jquery';
import {  MatSort } from '@angular/material/sort';
import {MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/service/validation/form-validation.service';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ContratService } from 'src/app/service/contrat/contrat.service';
import { ThrowStmt } from '@angular/compiler';
import { Detagliocontrato } from 'src/app/models/detagliocontrato';
import {
  COMMA,
  ENTER
} from '@angular/cdk/keycodes';
import * as XLSX from 'xlsx';

import {
  Observable
} from 'rxjs';

import { data } from 'jquery';
import { listenerCount } from 'events';
import { SelectionModel } from '@angular/cdk/collections';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ToastrService } from 'ngx-toastr';
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
  selector: 'app-interrogazioni',
  templateUrl: './interrogazioni.component.html',
  styleUrls: ['./interrogazioni.component.scss']
})
export class InterrogazioniComponent implements OnInit {

  //@ViewChild(MatPaginator) paginator: MatPaginator;
  //@ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto', 'data_scadenza', 'data_disdetta', 'data_validata', 'preavviso', 'owner', 'fornitore','codice','iva','lop_cliente','note','data_rinnovo','periodo'];
  displayedColumns1: string[] = ['id', 'tipo_doc', 'id_contrat', 'note', 'documenti','botton'];


  //displayedColumnstipo: string[] = ['','azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto','segnalazione'];
  displayedColumnstipo: {key:string, value:string}[] = [{key:'', value:''},{key:'data_scadenza', value:'data scadenza'},{key:'data_disdetta', value:'data disdetta'},{key:'data_validata', value:'data validata'}];
 // displayedColumns2: string[] = ['stipula', 'rinnovo', 'scadenza', 'disdetta'];
  dataSource:any;
  dataSource1:any=conttatoElement;
  faCoffee = faCoffee;
  valid:boolean = false;
  fa1:any;
  fa2:any;
  fa:any;
  loading: boolean = false;
  rows:any;
  vet = [];
  toto = [];
  novo = [];

  trovato1: boolean = false;
  rowCount: any;
  submitted: boolean = false;
  flag_edit: boolean = false;
  flag_normal: boolean = false;
  data_milieu:any;
  date_milieu:any;
  search: any='';
  datapas = {de: '', a: '',list:{}};
  file: any;
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
  flag_gestione: boolean = false;
  flag_segnali1: boolean = false;
  flag_segnali2: boolean = true;
  excelfile: any = 'ExcelSheet.xlsx';
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  mailCtrl = new FormControl();
  filename: any;
  tipo: string = "azienda";
  component: string = "listacontratti";
  fileexcel: File | undefined;

  filteredMails: Observable < string[] > | undefined;
  @ViewChild("paginatorcontrat", {
    static: false
  }) paginatorcontrat: MatPaginator | undefined;
  @ViewChild("sortcontrat") sortcontrat: MatSort | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild("paginatorcontratmodal", {
    static: false
  }) paginatorcontratmodal: MatPaginator | undefined;
  @ViewChild("sortcontratmodal") sortcontratmodal: MatSort | undefined;
  arrayValore: { importo: string , valore: string }[] = [];
  added: boolean = false;
  allMails: string[] = [];
  selection = new SelectionModel<any>(true, []);
  selectedData: any = [];
  loading_sfoglia_btn: boolean = false;
  loading_salva_btn: boolean = false;
  fa3: any;

  selectable = true;
  selectable1 = true;
  loading_invia_btn: boolean = false;
  searchForm: FormGroup;
  azienda: any = '';
  id: any = '';
  tipologia_contratto: any = '';
  sede: any = '';
  stato_contratto: any = '';
  data_scadenza: any = '';
  preavviso: any = '';
  owner: any = '';
  fornitore: any = '';
  codice: any = '';
  iva: any = '';
  lop_cliente: any = '';
  rinnovo_automatico: any= '';
  note: any= '';
  mail_preavviso: any = '';
  data_rinnovo: any = '';
  periodo: any = '';
  tipodat: any = '';
  de: any = '';
  a: any = '';




  tipodate: any;
  tipodate1: string;

  constructor(
    private modalService: NgbModal,
    private router:Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private sendcontrato: ContratService,
    private validationService: FormValidationService ) {
      let id_user_role = localStorage.getItem('idRole');
      if(id_user_role == '5') {
        this.flag_gestione = true;
      }
    this.fa = this.validationService.detagliocontratoForm(null,'');
    this.loadTable(false);
    this.fa1 = fb.group({
      'tipo': [null, Validators.required],
      'data1': [null, Validators.required],
      'data2': [null, Validators.required],
    });
    this.flag_readoly = false;
    this.loadTable(false);


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
    this.loadTablesegnali(false);
    this.searchFormInit();
    /* Filter predicate used for filtering table per different columns
    *  */

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });
  }
   // displayedColumns: string[] = ['azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto', 'data_scadenza', 'preavviso', 'owner', 'fornitore'];

  searchFormInit() {
    this.searchForm = new FormGroup({
      azienda: new FormControl(''),
      id: new FormControl(''),
      tipologia_contratto: new FormControl(''),
      sede: new FormControl(''),
      stato_contratto: new FormControl(''),
      data_scadenza: new FormControl(''),
      data_disdetta: new FormControl(''),
      data_validata: new FormControl(''),
      preavviso: new FormControl(''),
      owner: new FormControl(''),
      fornitore: new FormControl(''),
      codice: new FormControl(''),
      tipo_importo: new FormControl(''),
      iva: new FormControl(''),
      lop_cliente: new FormControl(''),
      note: new FormControl(''),
      data_rinnovo: new FormControl(''),
      periodo: new FormControl('')















    });
  }

  applyFilter() {
    const azienda = this.searchForm.get('azienda').value;
    const id = this.searchForm.get('id').value;
    const tipologia_contratto = this.searchForm.get('tipologia_contratto').value;
    const sede = this.searchForm.get('sede').value;
    const stato_contratto = this.searchForm.get('stato_contratto').value;
    const data_scadenza = this.searchForm.get('data_scadenza').value;
    const preavviso = this.searchForm.get('preavviso').value;
    const owner = this.searchForm.get('owner').value;
    const fornitore = this.searchForm.get('fornitore').value;
    const codice = this.searchForm.get('codice').value;
    const iva = this.searchForm.get('iva').value;
    const lop_cliente = this.searchForm.get('lop_cliente').value;
    const note = this.searchForm.get('note').value;

    const periodo = this.searchForm.get('periodo').value;








    const date1 = this.fa1.get('data1').value;
    const date2 = this.fa1.get('data2').value;
    this.tipodat = this.fa1.get('tipo').value;
    this.de = this.fa1.get('data1').value;
    this.a = this.fa1.get('data2').value;



    this.azienda = azienda === null ? '' : azienda;
    this.id = id === null ? '' : id;
    this.tipologia_contratto = tipologia_contratto === null ? '' : tipologia_contratto;
    this.sede = sede === null ? '' : sede;
    this.stato_contratto = stato_contratto === null ? '' : stato_contratto;
    this.data_scadenza = data_scadenza === null ? '' : data_scadenza;
    this.preavviso = preavviso === null ? '' : preavviso;
    this.owner = owner === null ? '' : owner;
    this.fornitore = fornitore === null ? '' : fornitore;
    this.codice = codice === null ? '' : codice;
    this.iva = iva === null ? '' : iva;
    this.lop_cliente = lop_cliente === null ? '' : lop_cliente;
    this.note = note === null ? '' : note;
    this.periodo = periodo === null ? '' : periodo;









    this.tipodate = date1 === null ? '' : date1;
    this.tipodate1 = date2 === null ? '' : date2;

    // create string of our searching values and split if by '$'
    const filterValue = this.azienda + '$' +
    this.id + '$' +
    this.tipologia_contratto + '$' +
    this.sede + '$' +
    this.stato_contratto + '$' +
    this.data_scadenza + '$' +
    this.preavviso + '$' +
    this.owner + '$' +
    this.fornitore + '$' +
    this.codice + '$' +
    this.iva + '$' +
    this.lop_cliente + '$' +
    this.note + '$' +


    this.data_rinnovo + '$' +
    this.periodo + '$' +






    this.tipodate + '$' +
    this.tipodate1;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getFilterPredicate() {
    return (row: any, filters: string) => {
      // split string per '$' to array
      const filterArray = filters.split('$');
      const azienda = filterArray[0];
      const id = filterArray[1];
      const tipologia_contratto = filterArray[2];
      const sede = filterArray[3];
      const stato_contratto = filterArray[4];
      const data_scadenza = filterArray[5];
      const preavviso = filterArray[6];
      const owner = filterArray[7];
      const fornitore = filterArray[8];
      const codice = filterArray[9];
      const iva = filterArray[10];
      const lop_cliente = filterArray[11];
      const note = filterArray[12];
      const data_rinnovo = filterArray[13];
      const periodo = filterArray[14];







      const date1 = filterArray[17];
      const date2 = filterArray[18];

      const matchFilter = [];

      // Fetch data from row
      const columnAzienda = row.azienda;
      const columnId = ''+row.id;
      const columnTipologia_contratto = row.tipologia_contratto;
      const columnSede = row.sede;
      const columnStato_contratto = ''+row.stato_contratto;
      const columnData_scadenza = row.data_scadenza;
      const columnPreavviso = ''+row.preavviso;
      const columnOwner = row.owner;
      const columnFornitore = row.fornitore;
      const columnCodice = row.codice;
      const columnIva = row.iva;
      const columnLop_cliente = row.lop_cliente;
      const columnNote = row.note;
      const columnData_rinnovo = row.data_rinnovo;
      const columnPeriodo = row.periodo;









      // verify fetching data by our searching values
      if (this.fa1.value.tipo === 'data_scadenza' && this.fa1.valid) {
        const columnScadenza = row[this.fa1.value.tipo];
        const customFilterData_scadenza = (columnScadenza >= date1 && columnScadenza <= date2)?true:false ;
        matchFilter.push(customFilterData_scadenza);
      } else if(this.fa1.value.tipo === 'data_disdetta' && this.fa1.valid) {
        const columnDisdetta = row[this.fa1.value.tipo];
        const customFilterData_disdetta = (columnDisdetta >= date1 && columnDisdetta <= date2)?true:false ;
        matchFilter.push(customFilterData_disdetta);
      } else if (this.fa1.value.tipo === 'data_validata' && this.fa1.valid) {
        const columnValidata = row[this.fa1.value.tipo];
        const customFilterData_validata = (columnValidata >= date1 && columnValidata <= date2)?true:false ;
        matchFilter.push(customFilterData_validata);
      }

      const customFilterAzienda = columnAzienda.toLowerCase().includes(azienda);
      const customFilterId = columnId.toLowerCase().includes(id);
      const customFilterTipologia_contratto = columnTipologia_contratto.toLowerCase().includes(tipologia_contratto);
      const customFilterSede = columnSede.toLowerCase().includes(sede);
      const customFilterStato_contratto = columnStato_contratto.toLowerCase().includes(stato_contratto);
      const customFilterPreavviso = columnPreavviso.toLowerCase().includes(preavviso);
      const customFilterOwner = columnOwner.toLowerCase().includes(owner);
      const customFilterFornitore = columnFornitore.toLowerCase().includes(fornitore);
      const customFilterCodice = columnCodice.toLowerCase().includes(codice);
      const customFilterIva = columnIva.toLowerCase().includes(iva);
      const customFilterLop_cliente = columnLop_cliente.toLowerCase().includes(lop_cliente);
      const customFilterNote = columnNote.toLowerCase().includes(note);
      const customFilterData_rinnovo = columnData_rinnovo.toLowerCase().includes(data_rinnovo);
      const customFilterPeriodo = columnPeriodo.toLowerCase().includes(periodo);


      //const customFilterMail_preavviso = columnMail_preavviso.toLowerCase().includes(mail_preavviso);







      // push boolean values into array
      matchFilter.push(customFilterAzienda);
      matchFilter.push(customFilterId);
      matchFilter.push(customFilterTipologia_contratto);
      matchFilter.push(customFilterSede);
      matchFilter.push(customFilterStato_contratto);

      matchFilter.push(customFilterPreavviso);
      matchFilter.push(customFilterOwner);
      matchFilter.push(customFilterFornitore);
      matchFilter.push(customFilterCodice);
      matchFilter.push(customFilterIva);
      matchFilter.push(customFilterLop_cliente);
      matchFilter.push(customFilterNote);
      matchFilter.push(customFilterData_rinnovo);
      matchFilter.push(customFilterPeriodo);


     // matchFilter.push(customFilterMail_preavviso);







      // return true if all values in array is true
      // else return false

      return matchFilter.every(Boolean);
    };
  }

  public addValoreImporto(value:string, importo:string) {
    if (!this.fa.controls['tipo_importo'].valid || !this.fa.controls['valore_importo'].valid) {
      this.added = true;
      return null;
    }
    this.arrayValore.push({importo: importo, valore: value});
  }

  public removeValoreImporto(index:number) {
    console.log("getting the index =="+index);
    this.arrayValore.splice(index,1);
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
    this.filename = 'fileName' + new Date().getTime() + '.xlsx';;
    this.fileexcel = new File([data], this.filename, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
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

  onChangeSelect() {
    //console.log(hello);
  }

  opensegnali() {
    this.router.navigate(['segnalazioni']);
  }



  home() {
    this.router.navigate(['home']);
  }



  async loadTable(loadOrNot:boolean) {
    this.loading=loadOrNot;
    await this.sendcontrato.getAll().then((data) => {
      //console.log(data);
      this.rows = data.list;
      this.toto = data.list;
      this.rowCount = data.list.length;
      this.dataSource = new MatTableDataSource(this.rows);

      setTimeout(() => (this.dataSource.paginator = this.paginatorcontrat));
      setTimeout(() => (this.dataSource.sort = this.sortcontrat));
      this.dataSource.filterPredicate = this.getFilterPredicate();
      this.loading=false;
    }).catch((error) => {
      console.log(error);
    });
  }

  loadCacheTable(data) {
    this.dataSource = new MatTableDataSource(data);
    setTimeout(() => (this.dataSource.paginator = this.paginatorcontrat));
    setTimeout(() => (this.dataSource.sort = this.sortcontrat));
  }

 async filterInterrogazione(data) {
  console.log('foormmmmmmmmmmmmm');

   console.log(data);
  this.tipodat = this.fa1.value.tipo;
  this.datapas.de = this.fa1.value.data1;
  this.datapas.a = this.fa1.value.data2;
  this.datapas.list = this.novo;
  console.log( this.datapas);
  let de = new Date(this.datapas.de).getTime();
  let a = new Date(this.datapas.a).getTime();
  console.log("1.getTime()===>"+de);
  console.log("2.getTime()===>"+a);
  if (de > a ) {
    console.log("de > a==");
  }
  console.log("this.rows[i]==>"+this.rows.length);
  console.log("this.rows==>"+JSON.stringify(this.rows));
  if(!this.fa1.valid) {
    return null;
  }
  if (data.length === 0 ) {
    let tableData:any = [];
    for (let i = 0; i < data.length; i ++) {
      console.log("this.rows[i][this.fa1.value.tipo]==>"+data[i][this.fa1.value.tipo]);
      console.log("new Date(data[i][this.fa1.value.tipo]).getTime()=="+new Date(data[i][this.fa1.value.tipo]).getTime());
      console.log("de=="+de);
      if ( de <= new Date(data[i][this.fa1.value.tipo]).getTime() && a >= new Date(data[i][this.fa1.value.tipo]).getTime()   ) {
        console.log("has entered this for confditions :>"+data[i][this.fa1.value.tipo]);
        tableData.push(data[i]);
      }
    }
    this.dataSource = new MatTableDataSource(tableData);
  } else {
    let tableData:any = [];
    for (let i = 0; i < this.rows.length; i ++) {
      console.log("this.rows[i][this.fa1.value.tipo]==>"+this.rows[i][this.fa1.value.tipo]);
      console.log("new Date(this.rows[i][this.fa1.value.tipo]).getTime()=="+new Date(this.rows[i][this.fa1.value.tipo]).getTime());
      console.log("de=="+de);
      if ( de <= new Date(this.rows[i][this.fa1.value.tipo]).getTime() && a >= new Date(this.rows[i][this.fa1.value.tipo]).getTime()   ) {
        console.log("has entered this for confditions :>"+this.rows[i][this.fa1.value.tipo]);
        tableData.push(this.rows[i]);
      }
    }
    this.dataSource = new MatTableDataSource(tableData);
  }

  console.log("has traversé");
  /*
    await this.sendcontrato.filterInterrogazione(this.fa1.value.tipo, this.datapas).then((data) => {
      console.log('daaaaaaaaaaa');
      this.novo = data.list;
      console.log("this.novo==>"+JSON.stringify(this.novo));
      this.dataSource = new MatTableDataSource(this.novo);
      //console.log(this.novo);
    }).catch((error) =>{
      console.log(error);
    })
  */
  }

  public doFilter = (value:string) => {
    console.log('yespp' + value);
    if (value.length > 3) {
      this.dataSource.filter = value.trim().toLocaleLowerCase();
    }
    //this.loadCacheTable((this.dataSource.filteredData));
    console.log("this.dataSource.filter==>"+JSON.stringify(this.dataSource.filteredData));
  };
  // stampanti
  liste(list: any, value: string){
    return list;
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

  onChangeInput(value:string){
    console.log(value);
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      switch(value) {
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

  async loadTablesegnali(loadOrNot:boolean) {
    this.loading=loadOrNot;
    await this.sendcontrato.getSegnalisazione().then((data) => {
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

  loadTable2(data: any) {
    console.log('vriwejhoggvwbovw');
    console.log(data);
    this.dataSource1 = new MatTableDataSource(data);
    this.cdr.detectChanges();
    setTimeout(() => (this.dataSource1.paginator = this.paginatorcontratmodal));
    setTimeout(() => (this.dataSource1.sort = this.sortcontratmodal));
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
      //newWindow.location = url; // open in new window
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
    console.log('delllllllettttttte contrattttt');
    console.log(this.selection.selected);


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
    console.log("voici l'id click");
    console.log(documente);
    console.log(localStorage.getItem('id_filecontrat'));
    //this.id_filecontrat = id;

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
        (data)=>{
        this.submitted = false;
        this.loadTable(false);
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
        }
      ).catch(
        (error)=>{
          this.loading_salva_btn = false;
          this.toastr.error(error, 'Salva Contratti',{
            timeOut: 3000,
          });
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
      console.log(file);
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
      /* alert ("pas bon"); */
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

    console.log('qqqqq');

    this.flag_create = false;
    this.flag_normal = false;

    this.flag_edit = true;
    this.flag_home = false;
    this.flag_modal = true;
    // console.log('voici id');
    // console.log( this.rows[id].sede,
    // this.rows[id].azienda);
    let detaglio;
    console.log("this.rows == " + JSON.stringify(this.rows));
    console.log(this.rows);
    let data = this.rows.filter((x: any) => x.id == id);
    console.log("this.data == " + JSON.stringify(data));
    console.log('eccooooooooooooooo dattttttttttttt');
    console.log(data[0]);
    console.log(data[0].societa.id);
    //localStorage.setItem('id_societa',data[0].societa.id);
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
    console.log("id_user");
    console.log(id_user_role);
    console.log("admin");
    console.log(data[0].user.societas[0].id);

    if (id_user_role == '1' && id_societa == data[0].societa.id) {
      trovato_user = 1;
    }

    if (id_user_role == '2' && data[0].user.roles[0].id == '2') {
      trovato_admin = 1;
    }

    if (id_user_role == '3' && data[0].user.roles[0].id == '3') { // role 3 logistica d apres le code
      trovato_logistica = 1;
    }

    if (id_user_role == '4') {
      trovato_super_admin = 1;
    }
    if(id_user_role == '5') {
      this.flag_gestione = true;
    }
    console.log(this.rows);

    console.log('voici id');
    console.log(id);
    console.log(detaglio);

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

    if (data[0].segnalazione.length!=0) {
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

  onChange(a :any) {}

}
