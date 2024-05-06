import { HttpException } from '@nestjs/common';
import { DadosNovoUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.novo';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';

export interface ICriarUsuario {
  criarUsuario(usuario: DadosNovoUsuario): Promise<UsuarioResposta | HttpException>;
}
