import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AppRoutes } from 'src/app/app-routes';
import { ClienteService } from 'src/app/data-services/clientes.service';
import { IbgeService } from 'src/app/data-services/ibge.service';
import { AssignFormHelper } from 'src/app/helper/AssignFormHelper';
import { Cliente } from 'src/app/models/clientes/cliente';
import { Cidade } from 'src/app/models/ibge/cidade';
import { Estado } from 'src/app/models/ibge/estado';

@Component({
  selector: 'app-cad-cliente',
  templateUrl: './cad-cliente.component.html',
  styleUrls: ['./cad-cliente.component.scss']
})
export class CadClienteComponent implements OnInit {

  private idSelecionado: string;
  public novoRegistro: boolean = false;
  public cliente: Cliente;
  public pessoaJuridica: boolean = true;

  public estados: Estado[] = [];
  public carregandoEstados: boolean = false;
  public estadoSelecionado: Number = 0;

  public cidades: Cidade[] = [];
  public carregandoCidades: boolean = false;
  public cidadeSelecionada: Number = 0;

  public form: FormGroup = new FormGroup({

    nome: new FormControl(null, [Validators.required]),
    razaoSocial: new FormControl(null, [Validators.required]),
    cnpj: new FormControl(null, []),
    cpf: new FormControl(null, []),
    rua: new FormControl(null, []),
    numero: new FormControl(null, []),
    complemento: new FormControl(null, []),
    bairro: new FormControl(null, []),
    estadoId: new FormControl(null),
    cidadeId: new FormControl(null, []),
    CidadeNome: new FormControl(null, []),
    cep: new FormControl(null, []),
    fone: new FormControl(null, []),
    email: new FormControl(null, [Validators.email]),

  })

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: NzModalService,
    private clienteService: ClienteService,
    private ibgeService: IbgeService
  ) {
    this.activatedRoute.params.subscribe(
      (params) => {

        //Carrega o id passado por parametro na URL
        this.idSelecionado = params.id;

        //Caso o parametro seja o valor "novo" então devemos gerar um novo registro
        if (this.idSelecionado == null || this.idSelecionado.toLowerCase() === 'novo') {
          this.novoRegistro = true;
          this.cliente = new Cliente();
          //Caso contrário devemos consultar na base para atualizar os valores
        } else {
          this.pesquisarPorId();
        }
      });
  }

  ngOnInit(): void {
    this.pessoaJuridicaChange();
    this.carregarEstados();
  }

  public pessoaJuridicaChange() {
    if (this.pessoaJuridica) {
      this.form.get("cnpj").setValidators(Validators.required)
    } else {
      this.form.get("cnpj").clearValidators()
    }

    if (this.pessoaJuridica == false) {
      this.form.get("cpf").setValidators(Validators.required)
    } else {
      this.form.get("cpf").clearValidators()
    }
  }

  private pesquisarPorId() {
    this.clienteService.getById(this.idSelecionado).subscribe(
      (result) => {
        this.cliente = result;
        this.carregarDados();
      },
      (err) => { }
    );
  }

  public cancelar(): void {
    this.router.navigateByUrl(AppRoutes.Cliente.base());
  }

  public salvar(): void {

    //Passa os valores do form para o objeto
    AssignFormHelper.assignFormValues<Cliente>(this.form, this.cliente);

    //Se o form estiver válido segue para o processo de salvar ou atualizar
    if (this.form.valid) {

      const operacao = this.novoRegistro
        ? this.clienteService.add(this.cliente)
        : this.clienteService.update(this.cliente);

      operacao.subscribe((result) => {
        this.cancelar();
      },
        (err) => {
          let msg: string = '';
          if (err.error) {
            for (const iterator of err.error) {
              msg += `<p>${iterator.message}</p>`
            }

          }
          this.modalService.error({
            nzTitle: 'Falha ao registrar o registro',
            nzContent: `<p>Verifique os dados e tente novamente.</p>
                      ${msg}`
          });

        })
    }
  }

  private carregarDados() {
    if (this.cliente) {
      this.form.get("nome").setValue(this.cliente.nome);
      this.form.get("razaoSocial").setValue(this.cliente.RazaoSocial);
      this.form.get("cnpj").setValue(this.cliente.CNPJ);
      this.form.get("cpf").setValue(this.cliente.CPF);
      this.form.get("rua").setValue(this.cliente.Rua);
      this.form.get("numero").setValue(this.cliente.Numero);
      this.form.get("complemento").setValue(this.cliente.Complemento);
      this.form.get("bairro").setValue(this.cliente.Bairro);
      this.form.get("estadoId").setValue(this.cliente.EstadoId);
      this.form.get("cidadeId").setValue(this.cliente.CidadeId);
      this.form.get("cidadeNome").setValue(this.cliente.CidadeNome);
      this.form.get("cep").setValue(this.cliente.CEP);
      this.form.get("fone").setValue(this.cliente.Fone);
      this.form.get("email").setValue(this.cliente.Email);

      // Campos 
      this.estadoSelecionado = Number(this.cliente.EstadoId);
      this.cidadeSelecionada = Number(this.cliente.CidadeId);
    }
  }

  private carregarEstados() {
    this.ibgeService.getEstados().subscribe(
      (estados) => {
        this.carregandoEstados = false;
        this.estados = estados;
      },
      (error) => {
        this.carregandoEstados = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar os estados',
          nzContent: 'Não foi possível carregar a lista de estados.'
        });
        console.log(error);
      });
  }

  public carregarCidades(estadoId: number): void {
    this.carregandoCidades = true;
    this.ibgeService.getCidades(estadoId).subscribe(
      (cidades) => {
        this.carregandoCidades = false;
        this.cidades = cidades;
      },
      (error) => {
        this.carregandoCidades = false;
        this.modalService.error({
          nzTitle: 'Falha ao carregar as cidades',
          nzContent: 'Não foi possível carregar a lista de cidades.'
        });
        console.log(error);
      })
  }

}
