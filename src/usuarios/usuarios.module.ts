import { Module } from '@nestjs/common';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuariosService } from './services/usuarios.service';
import { PrismaClient } from '@prisma/client';
import { UsuariosRespository } from './infra/repositories/usuarios.repository';
import { UserDocumentValidation } from './validation/users.documento.validation';
import { UserEmailValidation } from './validation/users.email.validation';

@Module({
  controllers: [UsuariosController],
  providers: [
    {
      provide: 'IUsuariosRepository',
      useClass: UsuariosRespository,
    },
    {
      provide: 'IUsuariosService',
      useClass: UsuariosService,
    },
    PrismaClient,
    UserEmailValidation,
    UserDocumentValidation,
  ],
})
export class UsuariosModule {}
