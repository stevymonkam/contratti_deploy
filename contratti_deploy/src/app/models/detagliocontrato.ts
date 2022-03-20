export class Detagliocontrato {
  id_contrat:Number;
  id_user: Number;
  owner: string;
  sede: string;
  azienda: string;
  codice: string;
  tipo_importo: string;
  fornitore: string;
  iva: string;
  lop_cliente: string;
  tipologia_contratto: string;
  stato_contratto: string;
  data_validata: Date;
  rinnovo_automatico: String;
  data_disdetta: Date; //doit etre une date
  note: string;
  mail_preavviso: Number;
  mail_contratto: Number;
  data_rinnovo: Date;
  periodo: string;
  preavviso: Number; // doit etre une date
  data_scadenza:Date;
  segnalazioni:string;




  constructor(
    id_contrat:Number,
    id_user: Number,
    owner: string,
    sede: string,
    azienda: string,
    codice: string,
    tipo_importo: string,
    fornitore: string,
    iva: string,
    lop_cliente: string,
    tipologia_contratto: string,
    stato_contratto: string,
    data_validata: Date,
    rinnovo_automatico: string,
    data_disdetta: Date,
    note: string,
    mail_preavviso: Number,
    mail_contratto: Number,
    data_rinnovo: Date,
    periodo: string,
    preavviso: Number,
    data_scadenza:Date,
    segnalazioni:string,

  ) {
    this.id_contrat = id_contrat;
    this.id_user = id_user;
    this.owner = owner;
    this.sede = sede;
    this.azienda = azienda;
    this.codice = codice;
    this.tipo_importo = tipo_importo;
    this.fornitore = fornitore;
    this.iva = iva;
    this.lop_cliente = lop_cliente;
    this.tipologia_contratto = tipologia_contratto;
    this.stato_contratto = stato_contratto;
    this.data_validata = data_validata;
    this.rinnovo_automatico = rinnovo_automatico;
    this.data_disdetta = data_disdetta;
    this.note = note;
    this.mail_preavviso = mail_preavviso;
    this.mail_contratto = mail_contratto;
    this.data_rinnovo = data_rinnovo;
    this.periodo = periodo;
    this.preavviso = preavviso;
    this.data_scadenza = data_scadenza;
    this.segnalazioni = segnalazioni;
  }
}
