import { HttpException } from '@nestjs/common';

export class ErroAoRemoverUsuario extends HttpException {
  constructor(error: string) {
    super('Não foi possível remover o usuário: ' + error, 500);
  }
}