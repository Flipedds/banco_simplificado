import { HttpException } from '@nestjs/common';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';

export interface IRemoverUsuario {
  removerUsuario(documento: string): Promise<UsuarioResposta | HttpException>;
}
