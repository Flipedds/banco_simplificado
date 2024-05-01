import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';

export interface IListarUsuarios {
  listarUsuarios(): Promise<UsuarioEntidade[]>;
}
