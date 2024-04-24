import { HttpException } from '@nestjs/common';

export class UsuarioNaoEncontrado extends HttpException {
  constructor() {
    super('Usuário não encontrado !', 404);
  }
}
