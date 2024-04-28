import { DadosCarteira } from "../types/usuarios.types.dadoscarteira";
import { UsuarioSeguro } from "../types/usuarios.types.seguro";

export type UsuarioResposta = {
  mensagem: string;
  usuario: UsuarioSeguro;
  carteira?: DadosCarteira;
}