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
import { UsuarioResponse } from '../dtos/usuarios.dto.novo.response';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Carteira } from '../domain/usuarios.carteira.entity';

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
}
