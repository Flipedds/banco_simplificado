import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';

export interface IBuscarUsuario {
  buscarUsuario(documento: string): Promise<UsuarioResposta | null>;
}
