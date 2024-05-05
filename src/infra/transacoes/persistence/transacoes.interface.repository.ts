import { Carteira } from "src/infra/usuarios/persistence/usuarios.carteira.entity";
import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";
import { TransacaoEntidade } from "./transacoes.entity";
import { Transacao } from "src/domain/transacoes/transacoes";

export interface IRepositorioDeTransacoesPrisma {
    buscarPorDocumento(documento: string): Promise<UsuarioEntidade | null>;
    buscarCarteira(idUsuario: number): Promise<Carteira>;
    novaTransacao(transacao: Transacao): Promise<TransacaoEntidade | null>;
    atualizarCarteira(idUsuario: number, valor: number): Promise<void>;
}