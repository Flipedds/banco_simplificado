import { Transacao } from "src/domain/transacoes/transacoes";
import { TransacaoEntidade } from "src/infra/transacoes/persistence/transacoes.entity";
import { Carteira } from "src/infra/usuarios/persistence/usuarios.carteira.entity";
import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";

export interface IRepositorioDeTransacoes {
    buscarUsuario(documento: string): Promise<UsuarioEntidade | null>;
    buscarCarteira(id_cliente: number): Promise<Carteira | null>;
    atualizarCarteira(id_cliente: number, valor: number): Promise<void>;
    novaTransacao(transacao: Transacao): Promise<TransacaoEntidade | null>;
}