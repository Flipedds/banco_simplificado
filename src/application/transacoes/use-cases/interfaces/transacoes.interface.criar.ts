import { DadosNovaTransacao } from "src/infra/transacoes/controller/dtos/transacoes.nova";
import { TransacaoEntidade } from "src/infra/transacoes/persistence/transacoes.entity";

export interface ICriarTransacao {
    executar(dadosNovaTransacao: DadosNovaTransacao) : Promise<TransacaoEntidade | null>;
}