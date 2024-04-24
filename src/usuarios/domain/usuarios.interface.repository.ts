import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Usuario } from './usuarios.entity';

export interface IUsuariosRepository {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorDocumento(documento: string): Promise<Usuario | null>;
  criar(usuario: DadosNovoUsuario): Promise<Usuario>;
}
