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
import { AutenticacaoController } from './infra/autenticacao/controller/autenticacao.controller';
import { RepositorioDeUsuariosAutenticacaoPrisma } from './infra/autenticacao/persistence/autenticacao.repository';
import { RepositorioDeAutenticacao } from './infra/autenticacao/gateways/autenticacao.infra.repository';
import { AutenticarUsuario } from './application/autenticacao/use-cases/autenticacao.autenticar';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RepositorioDeTransacoesPrisma } from './infra/transacoes/persistence/transacoes.repository';
import { RepositorioDeTransacoes } from './infra/transacoes/gateways/transacoes.infra.repository';
import { CriarTransacao } from './application/transacoes/use-cases/transacoes.criar';
import { TransacoesController } from './infra/transacoes/controller/transacoes.controller';
import { ListarTransacoes } from './application/transacoes/use-cases/transacoes.listar';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '10m' },
      }),
      inject: [ConfigService],
    }),
    CacheModule.register({ isGlobal: true, ttl: 10000 }),
  ],
  controllers: [
    AppController,
    UsuariosController,
    AutenticacaoController,
    TransacoesController,
  ],
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
    {
      provide: 'IRepositorioDeUsuariosAutenticacaoPrisma',
      useClass: RepositorioDeUsuariosAutenticacaoPrisma,
    },
    {
      provide: 'IRepositorioDeAutenticacao',
      useFactory: (repositorioDeUsuariosAutenticacaoPrisma) =>
        new RepositorioDeAutenticacao(repositorioDeUsuariosAutenticacaoPrisma),
      inject: ['IRepositorioDeUsuariosAutenticacaoPrisma'],
    },
    {
      provide: 'IAutenticarUsuario',
      useFactory: (repositorioDeAutenticacao, jwtService) =>
        new AutenticarUsuario(repositorioDeAutenticacao, jwtService),
      inject: ['IRepositorioDeAutenticacao', JwtService],
    },
    {
      provide: 'IRepositorioDeTransacoesPrisma',
      useClass: RepositorioDeTransacoesPrisma,
    },
    {
      provide: 'IRepositorioDeTransacoes',
      useFactory: (repositorioDeTransacoesPrisma) =>
        new RepositorioDeTransacoes(repositorioDeTransacoesPrisma),
      inject: ['IRepositorioDeTransacoesPrisma'],
    },
    {
      provide: 'ICriarTransacao',
      useFactory: (repositorioDeTransacoes) =>
        new CriarTransacao(repositorioDeTransacoes),
      inject: ['IRepositorioDeTransacoes'],
    },
    {
      provide: 'IListarTransacoes',
      useFactory: (repositorioDeTransacoes) =>
        new ListarTransacoes(repositorioDeTransacoes),
      inject: ['IRepositorioDeTransacoes'],
    }
  ],
})
export class AppModule { }
