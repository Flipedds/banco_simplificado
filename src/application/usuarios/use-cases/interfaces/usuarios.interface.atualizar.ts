import { HttpException } from '@nestjs/common';
import { DadosAtualizarUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.atualizar';
import { UsuarioResposta } from 'src/infra/usuarios/controller/types/usuarios.types.resposta';

export interface IAtualizarUsuario {
  atualizarUsuario(
    documento: string,
    dados: DadosAtualizarUsuario,
  ): Promise<UsuarioResposta | HttpException>;
}
