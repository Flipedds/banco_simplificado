import { DadosCarteira } from '../types/usuarios.type.dadoscarteira';
import { UsuarioSeguro } from '../types/usuarios.type.seguro';

export class UsuarioResponse {
  mensagem: string;
  usuario: UsuarioSeguro;
  carteira?: DadosCarteira;
}
