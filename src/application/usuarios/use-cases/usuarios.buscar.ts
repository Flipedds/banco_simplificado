import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { IRepositorioDeUsuarios } from '../gateways/usuarios.interface';
import { IBuscarUsuario } from './interfaces/usuarios.interface.buscar';

export class BuscarUsuario implements IBuscarUsuario {
  constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
  async buscarUsuario(documento: string): Promise<UsuarioEntidade | null> {
    return this.repositorio.buscarUsuario(documento);
  }
}
