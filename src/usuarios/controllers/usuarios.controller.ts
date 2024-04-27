import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IUsuariosService } from '../domain/usuarios.interface.service';
import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Usuario } from '../domain/usuarios.entity';
import { UsuarioResponse } from '../dtos/usuarios.dto.novo.response';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Carteira } from '../domain/usuarios.carteira.entity';
import { DadosAtualizarUsuario } from '../dtos/usuarios.dto.atualizar';
import { UsuarioSeguro } from '../types/usuarios.type.seguro';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(
    @Inject('IUsuariosService') private readonly service: IUsuariosService,
  ) {}

  @Post()
  @HttpCode(201)
  @ApiInternalServerErrorResponse()
  async novoUsuario(
    @Body() usuario: DadosNovoUsuario,
  ): Promise<UsuarioResponse> {
    const usuarioCriado: { novoUsuario: Usuario; novaCarteira: Carteira } =
      await this.service.criarUsuario(usuario);

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
  }

  @Get(':documento')
  @HttpCode(200)
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @ApiParam({ name: 'documento', type: String })
  async buscarUsuarioPorDocumento(
    @Param('documento') documento: string,
  ): Promise<UsuarioResponse> {
    const usuario: Usuario = await this.service.buscarUsuario(documento);
    return {
      mensagem: 'Usuário encontrado',
      usuario: {
        id: usuario.id,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    };
  }

  @Get()
  @HttpCode(200)
  @ApiInternalServerErrorResponse()
  async listarUsuarios(): Promise<UsuarioSeguro[]> {
    const usuarios: Usuario[] = await this.service.listarUsuarios();
    return usuarios.map((usuario) => {
      return {
        id: usuario.id,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        tipo: usuario.tipo,
      };
    });
  }

  @Patch(':documento')
  @HttpCode(200)
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @ApiParam({ name: 'documento', type: String })
  async atualizarUsuario(
    @Param('documento') documento: string,
    @Body() usuario: DadosAtualizarUsuario,
  ): Promise<UsuarioResponse> {
    const usuarioAtualizado: Usuario = await this.service.atualizarUsuario(
      documento,
      usuario,
    );

    return {
      mensagem: 'Usuário atualizado com sucesso',
      usuario: {
        id: usuarioAtualizado.id,
        nome_completo: usuarioAtualizado.nome_completo,
        email: usuarioAtualizado.email,
        tipo: usuarioAtualizado.tipo,
      },
    };
  }

  @Delete(':documento')
  @HttpCode(200)
  @ApiNotFoundResponse()
  @ApiInternalServerErrorResponse()
  @ApiParam({ name: 'documento', type: String })
  async removerUsuario(
    @Param('documento') documento: string,
  ): Promise<UsuarioResponse> {
    const usuarioRemovido: Usuario =
      await this.service.removerUsuario(documento);

    return {
      mensagem: 'Usuário removido com sucesso',
      usuario: {
        id: usuarioRemovido.id,
        nome_completo: usuarioRemovido.nome_completo,
        email: usuarioRemovido.email,
        tipo: usuarioRemovido.tipo,
      },
    };
  }
}
