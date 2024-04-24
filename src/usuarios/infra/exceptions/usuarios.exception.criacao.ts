import { HttpException } from '@nestjs/common';

export class ErroAoCriarUsuario extends HttpException {
  constructor(error: string) {
    super('Não foi possível criar o usuário: ' + error, 500);
  }
}
