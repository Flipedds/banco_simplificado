import { DadosAtualizarUsuario } from '../dtos/usuarios.dto.atualizar';
import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Carteira } from './usuarios.carteira.entity';
import { Usuario } from './usuarios.entity';

export interface IUsuariosRepository {
  buscarPorEmail(email: string): Promise<Usuario | null>;
  buscarPorDocumento(documento: string): Promise<Usuario | null>;
  criar(
    usuario: DadosNovoUsuario,
  ): Promise<{ novoUsuario: Usuario; novaCarteira: Carteira }>;
  atualizar(documento: string, usuario: DadosAtualizarUsuario): Promise<Usuario>;
  remover(documento: string): Promise<Usuario>;
}
