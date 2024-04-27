import { HttpException } from '@nestjs/common';

export class ErroAoAtualizarUsuario extends HttpException {
  constructor(error: string) {
    super('Não foi possível atualizar o usuário: ' + error, 500);
  }
}