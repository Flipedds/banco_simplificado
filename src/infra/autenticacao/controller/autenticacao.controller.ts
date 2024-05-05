import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Inject,
  Post,
} from '@nestjs/common';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IAutenticarUsuario } from 'src/application/autenticacao/use-cases/interfaces/autenticacao.interface.autenticar';
import { CredenciaisUsuario } from './dtos/autenticacao.dto.usuario';

@ApiTags('Autenticação')
@Controller('autenticacao')
export class AutenticacaoController {
  constructor(
    @Inject('IAutenticarUsuario')
    private readonly autenticacao: IAutenticarUsuario,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiBadRequestResponse({ description: 'Email ou senha inválidos' })
  @ApiOkResponse({ description: 'Usuário autenticado com sucesso' })
  async autenticar(@Body() credenciais: CredenciaisUsuario): Promise<
    | {
        token: string;
      }
    | HttpException
  > {
    return this.autenticacao.autenticar(credenciais);
  }
}
