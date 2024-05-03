import { Usuario } from './usuarios';

export class FabricaDeUsuarios {
  public static comTipoNomeCompletoDocumentoEmailESenha(
    tipo: string,
    nome_completo: string,
    documento: string,
    email: string,
    senha: string,
  ): Usuario {
    return new Usuario(tipo, nome_completo, documento, email, senha);
  }
}
