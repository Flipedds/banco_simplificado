import { AutenticacaoPayload } from "src/infra/autenticacao/controller/types/autenticacao.types.payload";
import { DadosNovaTransacao } from "src/infra/transacoes/controller/dtos/transacoes.nova";
import { TransacaoEntidade } from "src/infra/transacoes/persistence/transacoes.entity";

export interface ICriarTransacao {
    executar(req: AutenticacaoPayload, dadosNovaTransacao: DadosNovaTransacao) : Promise<TransacaoEntidade | null>;
}