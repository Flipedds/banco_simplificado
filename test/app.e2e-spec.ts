import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/infra/app/app.module';
import { TipoUsuario } from '../src/domain/usuarios/usuarios.enums.tipo';
import { DadosNovoUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.novo';
import { faker } from '@faker-js/faker';
import { randomInt } from 'crypto';
import { DadosAtualizarUsuario } from 'src/infra/usuarios/controller/dtos/usuarios.dto.atualizar';
import { ConfigModule } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ConfigModule],
      providers: [],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Api Está Rodando !');
  });

  describe('USUARIOS', () => {
    const nome_completo = faker.person.fullName();
    const email = faker.internet.email();
    const documento = randomInt(10000000000, 99999999999).toString();
    const senha = faker.internet.password();
    it(`Dado que eu preencha corretamente os dados do usuário
        Quando enviar a solicitação 
        Então deve retornar 201 e o retorno esperado`, async () => {
      const usuario: DadosNovoUsuario = {
        tipo: TipoUsuario.COMUM,
        nome_completo: nome_completo,
        documento: documento,
        email: email,
        senha: senha,
      };
      const retornoEsperado = {
        mensagem: 'Usuário criado com sucesso',
        usuario: {
          id: expect.any(Number),
          nome_completo: nome_completo,
          email: email,
          tipo: 'COMUM',
        },
        carteira: {
          id_usuario: expect.any(Number),
          saldo: 0,
          dt_criacao: expect.any(String),
        },
      };
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .set('Accept', 'application/json')
        .send(usuario);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(retornoEsperado);
    });

    it('/autenticacao (POST)', async () => {
      const response = await request(app.getHttpServer())
        .post('/autenticacao')
        .send({
          email: email,
          senha: senha,
        });
      expect(response.status).toBe(200);
      token = response.body.token;
    });

    it(`Dado que eu preencha os dados do usuário com email já cadastrado
        Quando enviar a solicitação deve retornar 500 e o retorno esperado`, async () => {
      const usuario: DadosNovoUsuario = {
        tipo: TipoUsuario.COMUM,
        nome_completo: nome_completo,
        documento: randomInt(10000000000, 99999999999).toString(),
        email: email,
        senha: senha,
      };
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .set('Accept', 'application/json')
        .send(usuario);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        mensagem: 'Erro ao criar usuário',
        error: {
          name: 'PrismaClientKnownRequestError',
          code: 'P2002',
          clientVersion: '5.13.0',
          meta: { modelName: 'tb_usuario', target: 'email' },
        },
      });
    });

    it(`Dado que eu preencha os dados do usuário com documento já cadastrado
        Quando enviar a solicitação deve retornar 500 e o retorno esperado`, async () => {
      const usuario: DadosNovoUsuario = {
        tipo: TipoUsuario.COMUM,
        nome_completo: nome_completo,
        documento: documento,
        email: faker.internet.email(),
        senha: senha,
      };
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .set('Accept', 'application/json')
        .send(usuario);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        mensagem: 'Erro ao criar usuário',
        error: {
          name: 'PrismaClientKnownRequestError',
          code: 'P2002',
          clientVersion: '5.13.0',
          meta: { modelName: 'tb_usuario', target: 'documento' },
        },
      });
    });

    it(`Dado que eu pesquise os dados do usuário
        Quando enviar a solicitação 
        Então deve retornar 200 e o retorno esperado`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/usuarios`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        mensagem: 'Usuário encontrado com sucesso',
        usuario: {
          id: expect.any(Number),
          nome_completo: nome_completo,
          email: email,
          tipo: 'COMUM',
        },
        carteira: {
          saldo: 0,
          id_usuario: expect.any(Number),
          dt_criacao: expect.any(String),
        }
      });
    });

    it(`Dado que eu preencha os dados do usuário para atualizar corretamente
        Quando enviar a solicitação
        Então deve retornar 200 e o retorno esperado`, async () => {
      const dadosAtualizar: DadosAtualizarUsuario = {
        email: faker.internet.email(),
      };
      const response = await request(app.getHttpServer())
        .patch(`/usuarios`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send(dadosAtualizar);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        mensagem: 'Usuário atualizado com sucesso',
        usuario: {
          id: expect.any(Number),
          nome_completo: nome_completo,
          email: dadosAtualizar.email,
          tipo: 'COMUM',
        },
      });
    });

    it(`Dado que eu preencha os dados do usuário para atualizar com email já cadastrado
        Quando enviar a solicitação
        Então deve retornar 500 e o retorno esperado`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/usuarios`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'joaodesouza@gmail.com' });
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        mensagem: 'Erro ao atualizar usuário',
        error: {
          name: 'PrismaClientKnownRequestError',
          code: 'P2002',
          clientVersion: '5.13.0',
          meta: { modelName: 'tb_usuario', target: 'email' },
        },
      });
    });
    it(`Dado que eu preecha o documento do usuário para remover
        Quando enviar a solicitação
        Então deve retornar 200 e o retorno esperado`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/usuarios`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        mensagem: 'Usuário removido com sucesso',
        usuario: {
          id: expect.any(Number),
          nome_completo: nome_completo,
          email: expect.any(String),
          tipo: 'COMUM',
        },
      });
    });
  });
});
