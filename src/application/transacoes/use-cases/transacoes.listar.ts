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
        try {
            const usuario = await this.transacoesRepositorio.buscarUsuario(documento);
            if (!usuario) {
                throw new NotFoundException('Usuário não encontrado');
            }
            const carteira = await this.transacoesRepositorio.buscarCarteira(usuario.id);
            if (!carteira) {
                throw new NotFoundException('Carteira não encontrada');
            }
            const transacoes = await this.transacoesRepositorio.listarTransacoes(carteira.id);
            if (!transacoes) {
                throw new NotFoundException('Transações não encontradas');
            }
            let transacaoListar = await Promise.all(transacoes.map(
                async transacao => {
                    return {
                        valor: transacao.valor,
                        tipo: transacao.tipo,
                        status: await this.validarStatus(carteira, transacao),
                        data: transacao.dt_criacao.toLocaleDateString('pt-BR'),
                        hora: transacao.dt_criacao.toLocaleTimeString('pt-BR'),
                    }
                }
            ));
            return transacaoListar;
        } catch(error) {
            throw new NotFoundException('Transações não encontradas');
        }
    }

    private async validarStatus(carteira: Carteira, transacao: TransacaoEntidade): Promise<string> {
        if (transacao.tipo === 'SAQUE') {
            return 'retirado da sua conta';
        }
        if (transacao.tipo === 'DEPOSITO') {
            return 'depositado na sua conta';
        }
        if (transacao.tipo === 'TRANSFERENCIA' && transacao.id_destino === carteira.id) {
            let nome_completo = (await this.transacoesRepositorio.buscarUsuarioPorId(transacao.id_origem)).nome_completo;
            return `recebida de ${nome_completo}`;
        }
        if (transacao.tipo === 'TRANSFERENCIA' && transacao.id_origem === carteira.id) {
            let nome_completo = (await this.transacoesRepositorio.buscarUsuarioPorId(transacao.id_destino)).nome_completo;
            return `enviada para ${nome_completo}`;
        }
    }
}
