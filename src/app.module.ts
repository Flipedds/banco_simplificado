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
import { BuscarUsuario } from './application/usuarios/use-cases/usuarios.buscar';
import { ListarUsuarios } from './application/usuarios/use-cases/usuarios.listar';
import { RemoverUsuario } from './application/usuarios/use-cases/usuarios.remover';
import { AtualizarUsuario } from './application/usuarios/use-cases/usuarios.atualizar';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        url: configService.get('REDIS_URL'),
        ttl: 10 * 1000,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, UsuariosController],
  providers: [
    AppService,
    {
      provide: 'ICriarUsuario',
      useFactory: (repositorioDeUsuarios) =>
        new CriarUsuario(repositorioDeUsuarios),
      inject: ['IRepositorioDeUsuarios'],
    },
    {
      provide: 'IBuscarUsuario',
      useFactory: (repositorioDeUsuarios) =>
        new BuscarUsuario(repositorioDeUsuarios),
      inject: ['IRepositorioDeUsuarios'],
    },
    {
      provide: 'IListarUsuarios',
      useFactory: (repositorioDeUsuarios) =>
        new ListarUsuarios(repositorioDeUsuarios),
      inject: ['IRepositorioDeUsuarios'],
    },
    {
      provide: 'IRemoverUsuario',
      useFactory: (repositorioDeUsuarios) =>
        new RemoverUsuario(repositorioDeUsuarios),
      inject: ['IRepositorioDeUsuarios'],
    },
    {
      provide: 'IAtualizarUsuario',
      useFactory: (repositorioDeUsuarios) =>
        new AtualizarUsuario(repositorioDeUsuarios),
      inject: ['IRepositorioDeUsuarios'],
    },
    PrismaClient,
    UserDocumentValidation,
    UserEmailValidation,
    {
      provide: 'IRepositorioDeUsuarios',
      useFactory: (repositorioPrisma) =>
        new RepositorioDeUsuarios(repositorioPrisma),
      inject: ['IRepositorioDeUsuariosPrisma'],
    },
    {
      provide: 'IRepositorioDeUsuariosPrisma',
      useClass: RepositorioDeUsuariosPrisma,
    },
  ],
})
export class AppModule {}
