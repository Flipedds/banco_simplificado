import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Usuario } from './usuarios.entity';

export interface IUsuariosService {
  criarUsuario(usuario: DadosNovoUsuario): Promise<Usuario>;
  buscarUsuario(documento: string): Promise<Usuario>;
}
