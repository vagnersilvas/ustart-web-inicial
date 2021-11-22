import { v4 as uuidv4 } from 'uuid';
import { Imovel } from '../imoveis/imoveis';

export class Cliente {
    public id: string
    public imovelId: string
    public imovel: Imovel
    public nome: string
    public RazaoSocial: string
    public CNPJ: string
    public CPF: string
    public Rua: string
    public Numero: string
    public Complemento: string
    public Bairro: string
    public EstadoId: string
    public CidadeId: string
    public CidadeNome: string
    public CEP: string
    public Fone: string
    public Email: string

    
    constructor(init?: Partial<Cliente>) {
        if (init) {
            Object.assign(this, init);
        } else {
            this.id = uuidv4();
        }
    }
}

