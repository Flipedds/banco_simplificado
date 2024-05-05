import { Autenticacao } from './autenticacao';

export class FabricaDeAutenticacao {
  public static comEmailESenha(email: string, senha: string): Autenticacao {
    return new Autenticacao(email, senha);
  }
}
