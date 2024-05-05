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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { DadosNovoUsuario } from './dtos/usuarios.dto.novo';
import { UsuarioResposta } from './types/usuarios.types.resposta';
import {
  ApiBearerAuth,
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
import { AutenticacaoGuard } from '../controller/guards/usuarios.autenticacao.guard';
import { RequisicaoComPayload } from 'src/infra/transacoes/controller/guards/transacoes.autenticacao.guard';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    @Inject('ICriarUsuario') private readonly criar: ICriarUsuario,
    @Inject('IBuscarUsuario') private readonly buscar: IBuscarUsuario,
    @Inject('IListarUsuarios') private readonly listar: IListarUsuarios,
    @Inject('IRemoverUsuario') private readonly remover: IRemoverUsuario,
    @Inject('IAtualizarUsuario') private readonly atualizar: IAtualizarUsuario,
  ) {}

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
                id_usuario: usuarioCriado.novaCarteira.id_usuario,
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

  @Get()
  @ApiOkResponse({ description: 'Usuário encontrado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao buscar usuário' })
  @UseInterceptors(CacheInterceptor)
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  async buscarUsuarioPorDocumento(
    @Req() req: RequisicaoComPayload
  ): Promise<UsuarioResposta | NotFoundException> {
    const documento = req.payload.sub;
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

  @Get('listar')
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

  @Delete()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao remover usuário' })
  @ApiOkResponse({ description: 'Usuário removido com sucesso' })
  @HttpCode(200)
  async removerUsuario(
    @Req() req: RequisicaoComPayload
  ): Promise<UsuarioResposta | HttpException> {
    const documento = req.payload.sub;
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

  @Patch()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth()
  @HttpCode(200)
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao atualizar usuário' })
  async atualizarUsuario(
    @Req() req: RequisicaoComPayload,
    @Body() usuario: DadosAtualizarUsuario,
  ): Promise<UsuarioResposta | HttpException> {
    const documento = req.payload.sub;
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
