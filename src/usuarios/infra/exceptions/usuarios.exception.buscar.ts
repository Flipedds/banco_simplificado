import { HttpException } from '@nestjs/common';

export class ErroAoBuscarUsuario extends HttpException {
  constructor(error: string) {
    super('Não foi possível buscar o usuário: ' + error, 500);
  }
}
