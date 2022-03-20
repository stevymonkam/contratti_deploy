import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/service/validation/form-validation.service';

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
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  valid: boolean = false;
  displayedColumns1: string[] = ['sel', 'tipologia', 'contratto', 'note', 'documenti'];
  dataSource1:any=conttatoElement;
  fa: FormGroup;
  submitted: boolean = false;
  constructor(private validationService: FormValidationService) {
    this.fa = this.validationService.detagliocontratoForm(null,'');
  }

  edit(data: any) {
     this.submitted = true;
    if(this.fa.valid){

      alert('valide');
    }else{
      alert('not valide');
      console.log(this.fa.value);
    }
  }
  ngOnInit(): void {

    $("#menu-toggle").click(function(e) {
      e.preventDefault();
      $("#wrapper").toggleClass("toggled");
    });

  }

}
