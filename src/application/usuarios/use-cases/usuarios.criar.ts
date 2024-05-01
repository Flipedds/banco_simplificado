import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import * as bcrypt from 'bcrypt';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { Carteira } from 'src/infra/usuarios/persistence/usuarios.carteira.entity';
import { DadosNovoUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.novo';
import { FabricaDeUsuarios } from 'src/domain/usuarios/usuarios.factory';
import { ICriarUsuario } from './interfaces/usuarios.interface.criar';

export class CriarUsuario implements ICriarUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async criarUsuario(usuario: DadosNovoUsuario): Promise<{
    novoUsuario: UsuarioEntidade;
    novaCarteira: Carteira;
  }> {
    const usuarioDeDominio =
      FabricaDeUsuarios.comTipoNomeCompletoDocumentoEmailESenha(
        usuario.tipo,
        usuario.nome_completo,
        usuario.documento,
        usuario.email,
        usuario.senha,
      );
    usuarioDeDominio.setSenha = await bcrypt.hash(
      usuarioDeDominio.getSenha,
      10,
    );
    return this.repositorio.cadastrarUsuario(usuarioDeDominio);
  }
}
