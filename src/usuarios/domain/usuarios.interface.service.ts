import { DadosAtualizarUsuario } from '../dtos/usuarios.dto.atualizar';
import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Carteira } from './usuarios.carteira.entity';
import { Usuario } from './usuarios.entity';

export interface IUsuariosService {
  criarUsuario(
    usuario: DadosNovoUsuario,
  ): Promise<{ novoUsuario: Usuario; novaCarteira: Carteira }>;
  buscarUsuario(documento: string): Promise<Usuario>;
  atualizarUsuario(documento: string, usuario: DadosAtualizarUsuario): Promise<Usuario>;
  removerUsuario(documento: string): Promise<Usuario>;
}
