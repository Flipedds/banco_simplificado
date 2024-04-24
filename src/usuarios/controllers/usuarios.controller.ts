import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { IUsuariosService } from '../domain/usuarios.interface.service';
import { DadosNovoUsuario } from '../dtos/usuarios.dto.novo';
import { Usuario } from '../domain/usuarios.entity';
import { UsuarioResponse } from '../domain/usuarios.novo.response';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

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
    const usuarioCriado: Usuario = await this.service.criarUsuario(usuario);

    return {
      mensagem: 'Usuário criado com sucesso',
      usuario: {
        id_usuario: usuarioCriado.id_usuario,
        nome_completo: usuarioCriado.nome_completo,
        email: usuarioCriado.email,
        tipo: usuarioCriado.tipo,
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
        id_usuario: usuario.id_usuario,
        nome_completo: usuario.nome_completo,
        email: usuario.email,
        tipo: usuario.tipo,
      },
    };
  }
}
