import { Transacao } from './transacoes';
import { TipoTransacao } from './transacoes.enums.tipo';

export class FabricaDeTransacoes {
  public static comIdOrigemIdDestinoValorETipo(
    id_origem: number,
    valor: number,
    tipo: TipoTransacao,
    id_destino?: number,
  ) {
    return new Transacao(id_origem, valor, tipo, id_destino);
  }
}
