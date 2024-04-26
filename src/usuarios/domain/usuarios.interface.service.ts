import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Carteira } from './usuarios.carteira.entity';
import { Usuario } from './usuarios.entity';

export interface IUsuariosService {
  criarUsuario(
    usuario: DadosNovoUsuario,
  ): Promise<{ novoUsuario: Usuario; novaCarteira: Carteira }>;
  buscarUsuario(documento: string): Promise<Usuario>;
}
