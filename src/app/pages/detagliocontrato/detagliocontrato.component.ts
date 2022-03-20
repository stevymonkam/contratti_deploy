 import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    OnInit,
    ViewChild
  } from '@angular/core';
  import {
    faCoffee
  } from '@fortawesome/free-solid-svg-icons';
  import * as $ from 'jquery';
  import {
    MatSort
  } from '@angular/material/sort';
  import {
    MatTableDataSource
  } from '@angular/material/table';
  import {
    MatPaginator,
    MatPaginatorIntl
  } from '@angular/material/paginator';
  import {
    NgbModal
  } from '@ng-bootstrap/ng-bootstrap';
  import {
    Router
  } from '@angular/router';
  import {
    FormGroup,
    FormBuilder,
    FormControl,
    Validators
  } from '@angular/forms';
  import {
    FormValidationService
  } from 'src/app/service/validation/form-validation.service';
  import {
    AuthService
  } from 'src/app/service/auth/auth.service';
  import {
    ContratService
  } from 'src/app/service/contrat/contrat.service';
  import {
    ThrowStmt
  } from '@angular/compiler';
  import {
    Detagliocontrato
  } from 'src/app/models/detagliocontrato';
  import * as XLSX from 'xlsx';
  import * as FileSaver from 'file-saver';
  import {
    COMMA,
    ENTER
  } from '@angular/cdk/keycodes';
  import {
    map,
    startWith
  } from 'rxjs/operators';
  import {
    Observable
  } from 'rxjs';
  import {
    MatAutocomplete,
    MatAutocompleteSelectedEvent
  } from '@angular/material/autocomplete';
  import {
    MatChipInputEvent
  } from '@angular/material/chips';
  import {
    HeaderComponent
  } from 'src/app/layout/header/header.component';
import { ToastrService } from 'ngx-toastr';
  const EXCEL_EXTENSION = '.xlsx';
  const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';


@Component({
  selector: 'app-detagliocontrato',
  templateUrl: './detagliocontrato.component.html',
  styleUrls: ['./detagliocontrato.component.scss']
})
  export class DetagliocontratoComponent implements OnInit {

    //@ViewChild(MatPaginator) paginator: MatPaginator;
    //@ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = ['azienda', 'id', 'tipologia_contratto', 'sede', 'stato_contratto', 'data_scadenza', 'preavviso', 'owner', 'fornitore'];
    displayedColumns1: string[] = ['id', 'tipo_doc', 'id_contrat', 'note', 'documenti'];
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
    fileName: any;
    rows_file: any;
    contrafile: any = 'https://bulma.io/images/placeholders/480x480.png';
    file: any;
    flag_edit: boolean = false;
    flag_normal: boolean = false;
    flag_home: boolean = true;
    flag_modal: boolean = false;
    flag_create: boolean = true;

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

    filteredMails: Observable < string[] > | undefined;
    mails: string[] = [];
    ccmails: string[] = [];
    allMails: string[] = [];
    selectable = true;
    selectable1 = true;
    flag_readoly: boolean = false;
    id_filecontrat: any;
    // mailInputcc
    @ViewChild('mailInput') mailInput: ElementRef < HTMLInputElement > | undefined;
    @ViewChild('mailInputcc') mailInputcc: ElementRef < HTMLInputElement > | undefined;
    @ViewChild('auto') matAutocomplete: MatAutocomplete | undefined;
    @ViewChild('autocc') matAutocompletecc: MatAutocomplete | undefined;
    mailscc: string[] = [];
    dataSource: any;
    fa3: any;
    visible = true;

    constructor(
      private modalService: NgbModal, 
      private toastr: ToastrService,
      private router: Router, 
      private cdr: ChangeDetectorRef,
      private validationService: FormValidationService, private auth: AuthService, private sendcontrato: ContratService, private fb: FormBuilder
    ) {

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

      /*this.loadEmails();
      this.fa3 = fb.group({
        'a': [null, Validators.required],
        'cc': [null],
        'oggetto': [null, Validators.required],
        'corpo': [null, Validators.required],
      });*/
      /* this.fa3.get('a').valueChanges.pipe(
         startWith(null),
       map((mail: string | null) => mail ? this._filter(mail) : this.allMails.slice()));

       this.fa3.get('cc').valueChanges.pipe(
         startWith(null),
       map((mail: string | null) => mail ? this._filter(mail) : this.allMails.slice()));*/
    }

    // edit(data: any) {}
    /* async edit(data: any) {
       await this.auth.login(data).subscribe((res: any)=>{
         console.log("one school=="+JSON.stringify(res));

       }, err =>{
         console.log("get the error ==="+JSON.stringify(err));
       });

     }*/

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

    /*loadEmails() {
      this.sendcontrato.getEmails().then((data:any)=>{
        console.log("load all emails ===>"+JSON.stringify(data));
        this.allMails = data.data;
      }).catch((error:any)=>{
        console.log(error);
      });
    }*/

    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      // Add our mail
      if ((value || '').trim()) {
        this.mails.push(value.trim());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.mailCtrl.setValue(null);
    }

    remove(fruit: string): void {
      const index = this.mails.indexOf(fruit);
      if (index >= 0) {
        this.mails.splice(index, 1);
      }
    }

    selected(event: MatAutocompleteSelectedEvent): void {
      this.mails.push(event.option.viewValue);
      this.mailInput ? this.mailInput.nativeElement.value = '' : this.mailInput = undefined;
      this.mailCtrl.setValue(null);
    }

    selectedcc(event: MatAutocompleteSelectedEvent): void {
      this.mailscc.push(event.option.viewValue);
      this.mailInput ? this.mailInput.nativeElement.value = '' : this.mailInput = undefined;
      this.mailCtrl.setValue(null);
    }

    addcc(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
      // Add our mail
      if ((value || '').trim()) {
        this.mailscc.push(value.trim());
      }
      // Reset the input value
      if (input) {
        input.value = '';
      }
      this.mailCtrl.setValue(null);
    }

    removecc(mail: string): void {
      const index = this.mailscc.indexOf(mail);
      if (index >= 0) {
        this.mailscc.splice(index, 1);
      }
    }

    private _filter(value: string): string[] {
      console.log("from _filter" + value);
      const filterValue = value.toLowerCase();
      return this.allMails.filter(mail => mail.toLowerCase().indexOf(filterValue) === 0);
    }

    /* end tag input or chip input */

    invia() {
      this.submitted = true;
      console.log("this.mails" + JSON.stringify(this.mails));
      console.log("this.mailscc" + JSON.stringify(this.mailscc));
      console.log(this.fa3.value);
      let data = {
        a: this.mails,
        cc: this.mailscc,
        oggetto: this.fa3.value.oggetto,
        filename: this.filename,
        type: 'edit',
        id_contrat: this.fa.value.id_contrat,
        corpo: this.fa3.value.corpo
      }
      console.log("incompleted are ==" + this.findInvalidControls(this.fa3));
      if (!this.fa3.valid) return;
      this.sendcontrato.envoiMail(data, this.fileexcel).then((data) => {
        this.toastr.success(data.message, 'Invia Mail',{
          timeOut: 3000,
        });
        console.log("hello" + JSON.stringify(data));
      }).catch((error) => {
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
      this.filename = 'fileName' + new Date().getTime();
      this.fileexcel = new File([data], this.filename, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      //FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    }
    /*edit(data: any) {
     if(this.fa.valid){

      console.log("ecoooo fa contrat");
        console.log(this.fa.value);
        this.sendcontrato.sendContrato(this.fa.value).subscribe( (res) =>{
          console.log("ecoooo fa contrat dedans");

          console.log(res);
        }, err =>{
          console.log('errooo');
        })

       alert('valide');
     }else{
      this.submitted = true;

       alert('not valide');
       console.log("this.fa");
       console.log(this.fa.value);
       console.log("incompleted are =="+this.findInvalidControls(this.fa));

     }
   }*/

    /*listeContra() {

     this.sendcontrato.GetList().then(
       (res)=> {
         console.log(res);

         this.dataSource = ELEMENT_DATA;
         console.log('this.dataSource');

         console.log(this.dataSource);
       }
     ).catch(
       (error)=>{
         console.log("error"+JSON.stringify(error));
       }
     )
    }*/
    /*
   doFilter() {
   // console.log(this.fa1.value);

  if(this.fa1.value.cars == 'sede'){
   for(let i =0; i< this.rows.length; i++) {

      if(this.rows[i].sede == this.fa1.value.value) {

          this.vet.push(this.toto[i]);

      }
    }
    this.dataSource = new MatTableDataSource(this.vet);
    this.vet = [];
  }

  if(this.fa1.value.cars == 'tipologia_contratto'){
    for(let i =0; i< this.rows.length; i++) {

       if(this.rows[i].tipologia_contratto == this.fa1.value.value) {

           this.vet.push(this.toto[i]);

       }
     }
     this.dataSource = new MatTableDataSource(this.vet);
     this.vet = [];
   }

   if(this.fa1.value.cars == 'azienda'){
    for(let i =0; i< this.rows.length; i++) {

       if(this.rows[i].azienda == this.fa1.value.value) {

           this.vet.push(this.toto[i]);

       }
     }
     this.dataSource = new MatTableDataSource(this.vet);
     this.vet = [];
   }
   if(this.fa1.value.cars == 'owner'){
    for(let i =0; i< this.rows.length; i++) {

       if(this.rows[i].owner == this.fa1.value.value) {

           this.vet.push(this.toto[i]);

       }
     }
     this.dataSource = new MatTableDataSource(this.vet);
     this.vet = [];
   }
   if(this.fa1.value.cars == 'fornitore'){
    for(let i =0; i< this.rows.length; i++) {

       if(this.rows[i].fornitore == this.fa1.value.value) {

           this.vet.push(this.toto[i]);

       }
     }
     this.dataSource = new MatTableDataSource(this.vet);
     this.vet = [];
   }
   if(this.fa1.value.cars == "" || this.fa1.value.cars == null || this.fa1.value.value == null || this.fa1.value.value == "") {

    this.loadTable(false);
   }






  };
  */
    /*onChangeSelect2(value: string) {
      //console.log(value);

     localStorage.setItem('value1',value);

    }*/

    public doFilter = () => {
      this.dataSource.filter = this.search.trim().toLocaleLowerCase();
    };

    onChange(value: string) {
      console.log(value);
      this.dataSource.filterPredicate = (data: any, filter: string) => {
        switch (value) {
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
        console.log(data);
        this.rows = data.list;
        this.toto = data.list;
        this.rowCount = data.list.length;
        this.dataSource = new MatTableDataSource(this.rows);
        console.log(this.rows);

        setTimeout(() => (this.dataSource.paginator = this.paginatorcontrat));
        setTimeout(() => (this.dataSource.sort = this.sort));
        this.loading = false;
      }).catch((error) => {
        console.log(error);
      });
    }

    onChangefile(file: File) {

      console.log(file);
      this.file = file;

    }
    loadTable2(data: any) {
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
      //console.log(this.fa2.value);

      await this.sendcontrato.uploadfile(this.file, this.fa2.value, this.fa.value.id_contrat).then((data) => {
        //alert('upload succes');
        console.log(JSON.stringify(data));
        console.log('upload');
        console.log(data);
        this.loadTable2(data.data.fileContrats);

        // this.loadTable2(data.data);

      }).catch((error) => {
        console.log(error);
      })

    }


    deletecontrat() {

      this.sendcontrato.deleteContat(this.fa.value).then(
        (data) => {

          alert('contrat delete dans la bd');
          console.log(data);

          //this.modalService.dismissAll();

        }
      ).catch(
        (error) => {
          alert('contrat error delete dans la bd');

          console.log("error" + JSON.stringify(error));
        }
      )

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
      case "bebe": {
        localStorage.setItem('idAzienda', '3');
        break;
      }
      case "bethink": {
        localStorage.setItem('idAzienda', '4');
        break;
      }
      case "besfcs": {
        localStorage.setItem('idAzienda', '5');
        break;
      }
      }

      // console.log("form data"+JSON.stringify(this.fa.value));
      //console.log(this.fa.value);

      if (this.fa.valid) {
        this.sendcontrato.create(this.fa.value).then(
          (data) => {
            //this.flag_home = true;
            //this.flag_modal = false;
            this.loadTable(false);
            console.log("response" + JSON.stringify(data));
            console.log("create create");

            //console.log(data);
            alert('contrat enreigistre dans la bd ');
            this.flag_create = false;
            //this.modalService.dismissAll();
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
            this.fa = this.validationService.detagliocontratoForm(detaglio, 'edit');
            console.log("faaaaaaaaaaaaaa");
            console.log(this.fa);
          }
        ).catch(
          (error) => {
            console.log("error" + JSON.stringify(error));
          }
        )
        //alert('cest bon');
      } else {
        this.submitted = true;
        console.log("incompleted are ==" + this.findInvalidControls(this.fa));
        /* alert ("pas bon"); */
      }
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
      case "bebe": {
        localStorage.setItem('idAzienda', '3');
        break;
      }
      case "bethink": {
        localStorage.setItem('idAzienda', '4');
        break;
      }
      case "besfcs": {
        localStorage.setItem('idAzienda', '5');
        break;
      }
      }

      //alert('edit');
      console.log('azienda');
      console.log(this.fa.value.azienda);
      console.log('idazienda');
      console.log(localStorage.getItem('idAzienda'));
      console.log('this.fa.value');
      console.log(this.fa.value);
      if (this.fa.valid) {
        alert('dedans');
        this.sendcontrato.update(this.fa.value).then(
          (data) => {

            console.log('contrat aggiorner avec succes');
            console.log(data);
            this.loadTable(true);
            this.flag_home = true;
            this.flag_modal = false;

          }
        ).catch(
          (error) => {
            alert('erroooooor');
            console.log("error" + JSON.stringify(error));
          }
        )
      } else {
        this.submitted = true;
        console.log("incompleted are ==" + this.findInvalidControls(this.fa));
        /* alert ("pas bon"); */
      }
    }

    onChangeSelect() {
      //console.log(hello);
    }
    opensegnali() {

      this.router.navigate(['segnalazioni']);
    }

    openinterrogazioni() {
      this.router.navigate(['detagliocontrato']);

    }

    async openModalAdd() {

      this.flag_normal = true;
      this.flag_edit = false;
      this.flag_home = false;
      this.flag_modal = true;
      this.fa = this.validationService.detagliocontratoForm(null, '');

      /*this.modalService.open(targetModal, {
        centered: true,
        backdrop: "static",
        size: 'xl',
      });*/
    }

    openEditModalFilecontrat(id: any) {

      this.id_filecontrat = id;

    }
    dismiss(){
      this.flag_home = true;
      this.flag_modal = false;
      this.loadTable(false);

    }
    eliminadoc(){
      console.log("voici l-id file contrat");

      /*this.sendcontrato.deleteContatfile(this.id_filecontrat).then(
        (data) => {

          alert('contrat delete dans la bd');
          console.log(data);
          this.loadTable(false);
          //this.modalService.dismissAll();

        }
      ).catch(
        (error) => {
          alert('contrat error delete dans la bd');
          this.loadTable(false);
          console.log("error" + JSON.stringify(error));
        }
      )*/

    }
    openEditModal2(id: any) {

      this.fa.controls.fornitore.disable();
      let trovato_user = 0;
      let trovato_admin = 0;
      let trovato_logistica = 0;

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
      //this.loadTable2(data[0].file_contrat);
      detaglio = new Detagliocontrato(
        data[0].id,
        data[0].id_user,
        data[0].owner,
        data[0].sede,
        data[0].azienda,
        data[0].codice,
        data[0].tipo_importo,
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
      console.log(this.rows);

      console.log('voici id');
      console.log(id);
      console.log(detaglio);

      let tabl: any[] = [];
      tabl.push(detaglio);
      if (trovato_user == 1 || trovato_admin == 1 || trovato_logistica == 1) {
        this.fa = this.validationService.detagliocontratoForm(detaglio, 'edit');

      }
      if (trovato_user == 0 && trovato_admin == 0 && trovato_logistica == 0) {
        this.flag_readoly = true;
        this.fa = this.validationService.detagliocontratoForm(detaglio, 'edit');

      }
      console.log(this.fa);

      /* this.modalService.open(targetModal, {
         centered: true,
         backdrop: "static",
         size: 'xl',
       });*/
    }

    opensignalisazioni() {

      this.router.navigate(['segnalazioni']);
    }
    ngOnInit(): void {
      console.log(this.rows);
      this.loadTable(false);
      $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
      });
    }

  }






