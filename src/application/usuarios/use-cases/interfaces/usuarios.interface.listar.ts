import { HttpException } from '@nestjs/common';
import { UsuarioSeguro } from 'src/infra/usuarios/controller/types/usuarios.types.seguro';

export interface IListarUsuarios {
  listarUsuarios(): Promise<UsuarioSeguro[] | HttpException>;
}
