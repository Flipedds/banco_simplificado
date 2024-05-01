import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { IListarUsuarios } from './interfaces/usuarios.interface.listar';

export class ListarUsuarios implements IListarUsuarios {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async listarUsuarios(): Promise<UsuarioEntidade[]> {
    return this.repositorio.listarUsuarios();
  }
}
