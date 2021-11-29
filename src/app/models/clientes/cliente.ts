import { v4 as uuidv4 } from 'uuid';
import { Imovel } from '../imoveis/imoveis';

export class Cliente {
    public id: string
    public imovelId: string
    public imovel: Imovel
    public nome: string
    public razaoSocial: string
    public cnpj: string
    public cpf : string
    public rua: string
    public numero: string
    public complemento: string
    public bairro: string
    public estadoId: string
    public cidadeId: string
    public cidadeNome: string
    public cep: string
    public fone: string
    public email: string

    
    constructor(init?: Partial<Cliente>) {
        if (init) {
            Object.assign(this, init);
        } else {
            this.id = uuidv4();
        }
    }
}

