import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';

export interface IBuscarUsuario {
  buscarUsuario(documento: string): Promise<UsuarioEntidade | null>;
}
