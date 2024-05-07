import { AutenticacaoPayload } from "src/infra/autenticacao/controller/types/autenticacao.types.payload";
import { TransacaoListar } from "src/infra/transacoes/controller/types/transacoes.types.listar";

export interface IListarTransacoes {
  executar(req: AutenticacaoPayload): Promise<TransacaoListar[]>;
}