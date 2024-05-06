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
  ApiTags,
} from '@nestjs/swagger';
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
  ) { }

  @Post()
  @ApiNotFoundResponse({ description: 'Usuário não retornado' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao criar usuário' })
  async novoUsuario(
    @Body() usuario: DadosNovoUsuario,
  ): Promise<UsuarioResposta | InternalServerErrorException> {
    return this.criar.criarUsuario(usuario);
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
    @Req() req: RequisicaoComPayload,
  ): Promise<UsuarioResposta | NotFoundException> {
    const documento = req.payload.sub;
    return this.buscar.buscarUsuario(documento);
  }

  @Get('listar')
  @ApiNotFoundResponse({ description: 'Usuários não encontrados' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao listar usuários' })
  @ApiOkResponse({ description: 'Usuários listados com sucesso' })
  @UseInterceptors(CacheInterceptor)
  async listarUsuariosAscendente(): Promise<UsuarioSeguro[] | HttpException> {
    return this.listar.listarUsuarios();
  }

  @Delete()
  @UseGuards(AutenticacaoGuard)
  @ApiBearerAuth()
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao remover usuário' })
  @ApiOkResponse({ description: 'Usuário removido com sucesso' })
  @HttpCode(200)
  async removerUsuario(
    @Req() req: RequisicaoComPayload,
  ): Promise<UsuarioResposta | HttpException> {
    const documento = req.payload.sub;
    return this.remover.removerUsuario(documento);
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
    return this.atualizar.atualizarUsuario(documento, usuario);
  }
}
