import { Test, TestingModule } from '@nestjs/testing';
import { IUsuariosService } from './domain/usuarios.interface.service';
import { UsuariosService } from './services/usuarios.service';
import { TipoUsuario } from './enums/usuarios.enums.tipo';
import { Usuario } from './domain/usuarios.entity';
import { UsuariosController } from './controllers/usuarios.controller';
import { UsuarioResponse } from './dtos/usuarios.dto.novo.response';
import { Carteira } from './domain/usuarios.carteira.entity';

const usuario: Usuario = {
  id_usuario: 1,
  tipo: TipoUsuario.COMUM,
  nome_completo: 'mario da silva',
  documento: '19483948392',
  email: 'mariodasilva@gmail.com',
  senha: 'OWoGV0I(C427',
};

const carteira: Carteira = {
  id_carteira: 1,
  saldo: 0,
  id_usuario: 1,
  dt_criacao: new Date(Date.parse('2024-04-25')),
  dt_alteracao: new Date(Date.parse('2024-04-25')),
};

describe('UsuariosService', () => {
  let app: TestingModule;
  let service: IUsuariosService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [
        {
          provide: 'IUsuariosRepository',
          useValue: {
            criar: jest
              .fn()
              .mockReturnValue(
                new Promise<{ novoUsuario: Usuario; novaCarteira: Carteira }>(
                  (resolve) =>
                    resolve({ novoUsuario: usuario, novaCarteira: carteira }),
                ),
              ),
            buscarPorDocumento: jest
              .fn()
              .mockReturnValue(
                new Promise<Usuario>((resolve) => resolve(usuario)),
              ),
          },
        },
        {
          provide: 'IUsuariosService',
          useClass: UsuariosService,
        },
      ],
    }).compile();
    service = app.get<IUsuariosService>('IUsuariosService');
  });

  describe('CRIANDO USUARIOS', () => {
    it('deve criar um novo usuario', async () => {
      const novoUsuario = {
        tipo: TipoUsuario.COMUM,
        nome_completo: 'mario da silva',
        documento: '19483948392',
        email: 'mariodasilva@gmail.com',
        senha: 'OWoGV0I(C427',
      };
      const usuario = await service.criarUsuario(novoUsuario);

      const usuarioRecebido: Usuario = {
        id_usuario: 1,
        tipo: TipoUsuario.COMUM,
        nome_completo: 'mario da silva',
        documento: '19483948392',
        email: 'mariodasilva@gmail.com',
        senha: 'OWoGV0I(C427',
      };
      expect(usuario.novoUsuario).toStrictEqual(usuarioRecebido);
      expect(usuario.novaCarteira).toStrictEqual(carteira);
    });
  });

  describe('BUSCANDO USUARIOS', () => {
    it('deve buscar um usuario', async () => {
      const usuario = await service.buscarUsuario('19483948392');
      const usuarioRecebido: Usuario = {
        id_usuario: 1,
        tipo: TipoUsuario.COMUM,
        nome_completo: 'mario da silva',
        documento: '19483948392',
        email: 'mariodasilva@gmail.com',
        senha: 'OWoGV0I(C427',
      };
      expect(usuario).toStrictEqual(usuarioRecebido);
    });
  });
});

describe('UsuariosController', () => {
  let app: TestingModule;
  let controller: UsuariosController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: 'IUsuariosRepository',
          useValue: {
            criar: jest
              .fn()
              .mockReturnValue(
                new Promise<{ novoUsuario: Usuario; novaCarteira: Carteira }>(
                  (resolve) =>
                    resolve({ novoUsuario: usuario, novaCarteira: carteira }),
                ),
              ),
            buscarPorDocumento: jest
              .fn()
              .mockReturnValue(
                new Promise<Usuario>((resolve) => resolve(usuario)),
              ),
          },
        },
        {
          provide: 'IUsuariosService',
          useValue: {
            criarUsuario: jest
              .fn()
              .mockReturnValue(
                new Promise<{ novoUsuario: Usuario; novaCarteira: Carteira }>(
                  (resolve) =>
                    resolve({ novoUsuario: usuario, novaCarteira: carteira }),
                ),
              ),
            buscarUsuario: jest
              .fn()
              .mockReturnValue(
                new Promise<Usuario>((resolve) => resolve(usuario)),
              ),
          },
        },
      ],
    }).compile();
    controller = app.get<UsuariosController>(UsuariosController);
  });

  describe('CRIANDO USUARIOS', () => {
    it('deve criar um novo usuario', async () => {
      const novoUsuario = {
        tipo: TipoUsuario.COMUM,
        nome_completo: 'mario da silva',
        documento: '19483948392',
        email: 'mariodasilva@gmail.com',
        senha: 'OWoGV0I(C427',
      };
      const response = await controller.novoUsuario(novoUsuario);

      const usuarioRecebido: UsuarioResponse = {
        mensagem: 'Usuário criado com sucesso',
        usuario: {
          id_usuario: 1,
          tipo: TipoUsuario.COMUM,
          nome_completo: 'mario da silva',
          email: 'mariodasilva@gmail.com',
        },
        carteira: {
          id_usuario: 1,
          saldo: 0,
          dt_criacao: new Date(Date.parse('2024-04-25')),
        },
      };
      expect(response).toStrictEqual(usuarioRecebido);
    });
  });

  describe('BUSCANDO USUARIOS', () => {
    it('deve buscar um usuario', async () => {
      const response =
        await controller.buscarUsuarioPorDocumento('19483948392');
      const usuarioRecebido: UsuarioResponse = {
        mensagem: 'Usuário encontrado',
        usuario: {
          id_usuario: 1,
          tipo: TipoUsuario.COMUM,
          nome_completo: 'mario da silva',
          email: 'mariodasilva@gmail.com',
        },
      };
      expect(response).toStrictEqual(usuarioRecebido);
    });
  });
});
