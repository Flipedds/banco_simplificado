import { DadosAtualizarUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.atualizar';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import * as bcrypt from 'bcrypt';
import { IAtualizarUsuario } from './interfaces/usuarios.interface.atualizar';

export class AtualizarUsuario implements IAtualizarUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) {}
  async atualizarUsuario(
    documento: string,
    dados: DadosAtualizarUsuario,
  ): Promise<UsuarioEntidade> {
    if (dados.senha) dados.senha = await bcrypt.hash(dados.senha, 10);
    return this.repositorio.atualizar(documento, dados);
  }
}
