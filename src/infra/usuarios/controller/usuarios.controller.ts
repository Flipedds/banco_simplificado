import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CriarUsuario } from 'src/application/usuarios/use-cases/usuarios.criar';
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
import { BuscarUsuario } from 'src/application/usuarios/use-cases/usuarios.buscar';
import { UsuarioEntidade } from '../persistence/usuarios.entity';
import { Carteira } from '../persistence/usuarios.carteira.entity';
import { ListarUsuarios } from 'src/application/usuarios/use-cases/usuarios.listar';
import { UsuarioSeguro } from './types/usuarios.types.seguro';
import { RemoverUsuario } from 'src/application/usuarios/use-cases/usuarios.remover';
import { AtualizarUsuario } from 'src/application/usuarios/use-cases/usuarios.atualizar';
import { DadosAtualizarUsuario } from './dtos/usuarios.dto.atualizar';

@ApiTags('Usuários')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    private readonly criarUsuario: CriarUsuario,
    private readonly buscarUsuario: BuscarUsuario,
    private readonly listarUsuarios: ListarUsuarios,
    private readonly remover: RemoverUsuario,
    private readonly atualizar: AtualizarUsuario,
  ) {}

  @Post()
  @ApiNotFoundResponse({ description: 'Usuário não retornado' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao criar usuário' })
  async novoUsuario(
    @Body() usuario: DadosNovoUsuario,
  ): Promise<UsuarioResposta | InternalServerErrorException> {
    try {
      const usuarioCriado = this.criarUsuario.criarUsuario(usuario);
      return usuarioCriado.then(
        (usuarioCriado: {
          novoUsuario: UsuarioEntidade;
          novaCarteira: Carteira;
        }) => {
          if (!usuarioCriado)
            throw new NotFoundException('Usuário não retornado');
          return {
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
          };
        },
      );
    } catch (error) {
      return new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  @Get(':documento')
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao buscar usuário' })
  @HttpCode(200)
  async buscarUsuarioPorDocumento(
    @Param('documento') documento: string,
  ): Promise<UsuarioResposta | NotFoundException> {
    try {
      const usuario = this.buscarUsuario.buscarUsuario(documento);
      return usuario.then((usuario: UsuarioEntidade) => {
        if (!usuario) throw new NotFoundException('Usuário não encontrado');
        return {
          mensagem: 'Usuário encontrado com sucesso',
          usuario: {
            id: usuario.id,
            nome_completo: usuario.nome_completo,
            email: usuario.email,
            tipo: usuario.tipo,
          },
        };
      });
    } catch (error) {
      return new InternalServerErrorException('Erro ao buscar usuário');
    }
  }

  @Get()
  @ApiNotFoundResponse({ description: 'Usuários não encontrados' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao listar usuários' })
  @ApiOkResponse({ description: 'Usuários listados com sucesso' })
  async listarUsuariosAscendente(): Promise<UsuarioSeguro[] | HttpException> {
    try {
      const usuarios = this.listarUsuarios.listarUsuarios();
      return usuarios.then((usuarios: UsuarioEntidade[]) => {
        if (!usuarios) throw new NotFoundException('Usuários não encontrados');
        return usuarios.map((usuario: UsuarioEntidade) => {
          return {
            id: usuario.id,
            nome_completo: usuario.nome_completo,
            email: usuario.email,
            tipo: usuario.tipo,
          };
        });
      });
    } catch (error) {
      return new InternalServerErrorException('Erro ao listar usuários');
    }
  }

  @Delete(':documento')
  @ApiParam({ name: 'documento', type: String })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  @ApiInternalServerErrorResponse({ description: 'Erro ao remover usuário' })
  @HttpCode(200)
  async removerUsuario(
    @Param('documento') documento: string,
  ): Promise<UsuarioResposta | HttpException> {
    try {
      return this.buscarUsuario
        .buscarUsuario(documento)
        .then(async (usuarioBuscado: UsuarioEntidade) => {
          if (!usuarioBuscado)
            throw new NotFoundException('Usuário não encontrado');
          const usuario = await this.remover.removerUsuario(documento);
          if (!usuario) throw new NotFoundException('Usuário não retornado');
          return {
            mensagem: 'Usuário removido com sucesso',
            usuario: {
              id: usuario.id,
              nome_completo: usuario.nome_completo,
              email: usuario.email,
              tipo: usuario.tipo,
            },
          };
        });
    } catch (error) {
      return new InternalServerErrorException('Erro ao remover usuário');
    }
  }

  @Patch(':documento')
  @HttpCode(200)
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @ApiParam({ name: 'documento', type: String })
  async atualizarUsuario(
    @Param('documento') documento: string,
    @Body() usuario: DadosAtualizarUsuario,
  ): Promise<UsuarioResposta | HttpException> {
    try {
      return this.buscarUsuario
        .buscarUsuario(documento)
        .then(async (usuarioBuscado: UsuarioEntidade) => {
          if (!usuarioBuscado)
            throw new NotFoundException('Usuário não encontrado');
          const usuarioAtualizado = await this.atualizar.atualizarUsuario(
            documento,
            usuario,
          );
          if (!usuarioAtualizado)
            throw new NotFoundException('Usuário não retornado');
          return {
            mensagem: 'Usuário atualizado com sucesso',
            usuario: {
              id: usuarioAtualizado.id,
              nome_completo: usuarioAtualizado.nome_completo,
              email: usuarioAtualizado.email,
              tipo: usuarioAtualizado.tipo,
            },
          };
        });
    } catch (error) {
      return new InternalServerErrorException('Erro ao atualizar usuário');
    }
  }
}
