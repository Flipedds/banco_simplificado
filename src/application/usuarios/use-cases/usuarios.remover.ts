import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { IRemoverUsuario } from './interfaces/usuarios.interface.remover';

export class RemoverUsuario implements IRemoverUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async removerUsuario(documento: string): Promise<UsuarioEntidade> {
    return this.repositorio.remover(documento);
  }
}
