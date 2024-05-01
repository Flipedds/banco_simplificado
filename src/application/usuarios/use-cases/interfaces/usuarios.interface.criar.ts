import { DadosNovoUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.novo';
import { Carteira } from 'src/infra/usuarios/persistence/usuarios.carteira.entity';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';

export interface ICriarUsuario {
  criarUsuario(usuario: DadosNovoUsuario): Promise<{
    novoUsuario: UsuarioEntidade;
    novaCarteira: Carteira;
  }>;
}
