import { TipoTransacao } from "./transacoes.enums.tipo";

export class Transacao {
    private id_origem: number;
    private id_destino?: number;
    private valor: number;
    private tipo: TipoTransacao;

    constructor(id_origem: number, valor: number, tipo: TipoTransacao, id_destino?: number) {
        this.id_origem = id_origem;
        this.id_destino = id_destino;
        this.valor = valor;
        this.tipo = tipo;
    }

    public get getIdOrigem(): number {
        return this.id_origem;
    }

    public get getIdDestino(): number | undefined {
        return this.id_destino;
    }

    public get getValor(): number {
        return this.valor;
    }

    public get getTipo(): string {
        return this.tipo;
    }
}