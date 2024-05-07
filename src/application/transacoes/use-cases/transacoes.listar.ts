import { AutenticacaoPayload } from "src/infra/autenticacao/controller/types/autenticacao.types.payload";
import { IRepositorioDeTransacoes } from "../gateways/transacoes.interface";
import { NotFoundException } from "@nestjs/common";
import { IListarTransacoes } from "./interfaces/transacoes.interface.listar";
import { TransacaoListar } from "src/infra/transacoes/controller/types/transacoes.types.listar";
import { Carteira } from "src/infra/usuarios/persistence/usuarios.carteira.entity";
import { TransacaoEntidade } from "src/infra/transacoes/persistence/transacoes.entity";

export class ListarTransacoes implements IListarTransacoes {
    constructor(private transacoesRepositorio: IRepositorioDeTransacoes) { }

    async executar(req: AutenticacaoPayload): Promise<TransacaoListar[]> {
        const { sub } = req;
        const documento: string = sub;
        return new Promise(async (resolve, reject) => {
            const usuario = await this.transacoesRepositorio.buscarUsuario(documento);
            if (!usuario) {
                reject(new NotFoundException('Usuário não encontrado'));
                return;
            }
            const carteira = await this.transacoesRepositorio.buscarCarteira(usuario.id);
            if (!carteira) {
                reject(new NotFoundException('Carteira não encontrada'));
                return;
            }
            const transacoes = await this.transacoesRepositorio.listarTransacoes(carteira.id);
            if (!transacoes) {
                reject(new NotFoundException('Transações não encontradas'));
                return;
            }
            resolve(transacoes.map(
                transacao => {
                    return {
                        valor: transacao.valor,
                        tipo: transacao.tipo,
                        status: this.validarStatus(carteira, transacao),
                        data: transacao.dt_criacao.toLocaleDateString('pt-BR'),
                        hora: transacao.dt_criacao.toLocaleTimeString('pt-BR'),
                    }
                }));
        });
    }

    private validarStatus(carteira: Carteira, transacao: TransacaoEntidade): string {
        if (transacao.tipo === 'SAQUE') {
            return 'retirado da sua conta';
        }
        if (transacao.tipo === 'DEPOSITO') {
            return 'depositado na sua conta';
        }
        if (transacao.tipo === 'TRANSFERENCIA' && transacao.id_destino === carteira.id) {
            return 'recebida';
        }
        if (transacao.tipo === 'TRANSFERENCIA' && transacao.id_origem === carteira.id) {
            return 'enviada';
        }
    }
}
