import { v4 as uuidv4 } from 'uuid';

export class Imovel {
    public id: string
    public clienteId: string
    public usuarioId: string
    public tipoImovel: string
    public urlImagem: string
    public rua: string
    public numero: string
    public complemento: string
    public bairro: string
    public cep: string
    public estadoId: string
    public cidadeId: string
    public cidadeNome: string
    public descricao: string
    public finalidade: string
    public situacao: string
    public areaContruida: string
    public areaTotal: string
    public valorVenda: string
    public valorAluguel: string
    public dormitorios: string
    public suite: string
    public vagasGaragem: string


    constructor(init?: Partial<Imovel>) {
        if (init) {
            Object.assign(this, init);
        } else {
            this.id = uuidv4();
        }
    }
}

