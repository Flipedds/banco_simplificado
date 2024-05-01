import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { DadosNovoUsuario } from './dtos/usuarios.dto.novo';
import { UsuarioResposta } from './types/usuarios.types.resposta';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UsuarioEntidade } from '../persistence/usuarios.entity';
import { Carteira } from '../persistence/usuarios.carteira.entity';
import { UsuarioSeguro } from './types/usuarios.types.seguro';
import { DadosAtualizarUsuario } from './dtos/usuarios.dto.atualizar';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ICriarUsuario } from 'src/application/usuarios/use-cases/interfaces/usuarios.interface.criar';
import { IBuscarUsuario } from 'src/application/usuarios/use-cases/interfaces/usuarios.interface.buscar';
import { IListarUsuarios } from 'src/application/usuarios/use-cases/interfaces/usuarios.interface.listar';
import { IRemoverUsuario } from 'src/application/usuarios/use-cases/interfaces/usuarios.interface.remover';
import { IAtualizarUsuario } from 'src/application/usuarios/use-cases/interfaces/usuarios.interface.atualizar';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    @Inject('ICriarUsuario') private readonly criar: ICriarUsuario,
    @Inject('IBuscarUsuario') private readonly buscar: IBuscarUsuario,
    @Inject('IListarUsuarios') private readonly listar: IListarUsuarios,
    @Inject('IRemoverUsuario') private readonly remover: IRemoverUsuario,
    @Inject('IAtualizarUsuario') private readonly atualizar: IAtualizarUsuario,
  ) { }

  @Post()
  @ApiNotFoundResponse({ description: 'Usuário não retornado' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao criar usuário' })
  async novoUsuario(
    @Body() usuario: DadosNovoUsuario,
  ): Promise<UsuarioResposta | InternalServerErrorException> {
    return new Promise((resolve, reject) => {
      this.criar
        .criarUsuario(usuario)
        .then(
          (usuarioCriado: {
            novoUsuario: UsuarioEntidade;
            novaCarteira: Carteira;
          }) => {
            if (!usuarioCriado)
              reject(new NotFoundException('Usuário não retornado'));
            resolve({
              mensagem: 'Usuário criado com sucesso',
              usuario: {
                id: usuarioCriado.novoUsuario.id,
                nome_completo: usuarioCriado.novoUsuario.nome_completo,
                email: usuarioCriado.novoUsuario.email,
                tipo: usuarioCriado.novoUsuario.tipo,
              },
              carteira: {
                id_usuario: usuarioCriado.novaCarteira.id,
                saldo: usuarioCriado.novaCarteira.saldo,
                dt_criacao: usuarioCriado.novaCarteira.dt_criacao,
              },
            });
          },
        )
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao criar usuário',
              error: error,
            }),
          );
        });
    });
  }

  @Get(':documento')
  @ApiOkResponse({ description: 'Usuário encontrado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao buscar usuário' })
  @UseInterceptors(CacheInterceptor)
  @HttpCode(200)
  async buscarUsuarioPorDocumento(
    @Param('documento') documento: string,
  ): Promise<UsuarioResposta | NotFoundException> {
    return new Promise((resolve, reject) => {
      this.buscar
        .buscarUsuario(documento)
        .then((usuario: UsuarioEntidade) => {
          if (!usuario) reject(new NotFoundException('Usuário não encontrado'));
          resolve({
            mensagem: 'Usuário encontrado com sucesso',
            usuario: {
              id: usuario.id,
              nome_completo: usuario.nome_completo,
              email: usuario.email,
              tipo: usuario.tipo,
            },
          });
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao buscar usuário',
              error: error,
            }),
          );
        });
    });
  }

  @Get()
  @ApiNotFoundResponse({ description: 'Usuários não encontrados' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao listar usuários' })
  @ApiOkResponse({ description: 'Usuários listados com sucesso' })
  @UseInterceptors(CacheInterceptor)
  async listarUsuariosAscendente(): Promise<UsuarioSeguro[] | HttpException> {
    return new Promise((resolve, reject) => {
      this.listar
        .listarUsuarios()
        .then((usuarios: UsuarioEntidade[]) => {
          if (!usuarios)
            reject(new NotFoundException('Usuários não encontrados'));
          resolve(
            usuarios.map((usuario: UsuarioEntidade) => {
              return {
                id: usuario.id,
                nome_completo: usuario.nome_completo,
                email: usuario.email,
                tipo: usuario.tipo,
              };
            }),
          );
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao listar usuários',
              error: error,
            }),
          );
        });
    });
  }

  @Delete(':documento')
  @ApiParam({ name: 'documento', type: String })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao remover usuário' })
  @ApiOkResponse({ description: 'Usuário removido com sucesso' })
  @HttpCode(200)
  async removerUsuario(
    @Param('documento') documento: string,
  ): Promise<UsuarioResposta | HttpException> {
    return new Promise((resolve, reject) => {
      this.buscar
        .buscarUsuario(documento)
        .then(async (usuarioBuscado: UsuarioEntidade) => {
          if (!usuarioBuscado)
            reject(new NotFoundException('Usuário não encontrado'));
          this.remover
            .removerUsuario(documento)
            .then((usuario: UsuarioEntidade) => {
              if (!usuario)
                reject(new NotFoundException('Usuário não retornado'));
              resolve({
                mensagem: 'Usuário removido com sucesso',
                usuario: {
                  id: usuario.id,
                  nome_completo: usuario.nome_completo,
                  email: usuario.email,
                  tipo: usuario.tipo,
                },
              });
            })
            .catch((error) => {
              reject(
                new InternalServerErrorException({
                  mensagem: 'Erro ao remover usuário',
                  error: error,
                }),
              );
            });
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao remover usuário',
              error: error,
            }),
          );
        });
    });
  }

  @Patch(':documento')
  @HttpCode(200)
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao atualizar usuário' })
  @ApiParam({ name: 'documento', type: String })
  async atualizarUsuario(
    @Param('documento') documento: string,
    @Body() usuario: DadosAtualizarUsuario,
  ): Promise<UsuarioResposta | HttpException> {
    return new Promise((resolve, reject) => {
      this.buscar
        .buscarUsuario(documento)
        .then(async (usuarioBuscado: UsuarioEntidade) => {
          if (!usuarioBuscado)
            reject(new NotFoundException('Usuário não encontrado'));
          this.atualizar
            .atualizarUsuario(documento, usuario)
            .then((usuarioAtualizado: UsuarioEntidade) => {
              if (!usuarioAtualizado)
                reject(new NotFoundException('Usuário não retornado'));
              resolve({
                mensagem: 'Usuário atualizado com sucesso',
                usuario: {
                  id: usuarioAtualizado.id,
                  nome_completo: usuarioAtualizado.nome_completo,
                  email: usuarioAtualizado.email,
                  tipo: usuarioAtualizado.tipo,
                },
              });
            })
            .catch((error) => {
              reject(
                new InternalServerErrorException({
                  mensagem: 'Erro ao atualizar usuário',
                  error: error,
                }),
              );
            });
        })
        .catch((error) => {
          reject(
            new InternalServerErrorException({
              mensagem: 'Erro ao atualizar usuário',
              error: error,
            }),
          );
        });
    });
  }
}
