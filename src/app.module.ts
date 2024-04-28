import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaClient } from '@prisma/client';
import { CriarUsuario } from './application/usuarios/use-cases/usuarios.criar';
import { UsuariosController } from './infra/usuarios/controller/usuarios.controller';
import { UserDocumentValidation } from './infra/usuarios/controller/validation/users.documento.validation';
import { UserEmailValidation } from './infra/usuarios/controller/validation/users.email.validation';
import { RepositorioDeUsuariosPrisma } from './infra/usuarios/persistence/usuarios.repository';
import { RepositorioDeUsuarios } from './infra/usuarios/gateways/usuarios.infra.repository';

@Module({
  imports: [],
  controllers: [AppController, UsuariosController],
  providers: [
    AppService,
    {
      provide: CriarUsuario,
      useFactory: (repositorioDeUsuarios) => new CriarUsuario(repositorioDeUsuarios),
      inject: ['IRepositorioDeUsuarios']
    },
    PrismaClient,
    UserDocumentValidation,
    UserEmailValidation,
    {
      provide: 'IRepositorioDeUsuarios',
      useFactory: (repositorioPrisma) => new RepositorioDeUsuarios(repositorioPrisma),
      inject: ['IRepositorioDeUsuariosPrisma']
    },
    {
      provide: 'IRepositorioDeUsuariosPrisma',
      useClass: RepositorioDeUsuariosPrisma,
    }],
})
export class AppModule { }
