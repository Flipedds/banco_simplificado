import { Body, Controller, InternalServerErrorException, NotFoundException, Post } from "@nestjs/common";
import { CriarUsuario } from "src/application/usuarios/use-cases/usuarios.criar";
import { DadosNovoUsuario } from "./dtos/usuarios.dto.novo";
import { UsuarioResposta } from "./types/usuarios.types.resposta";
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse } from "@nestjs/swagger";

@Controller()
export class UsuariosController {
    constructor(private readonly criarUsuario: CriarUsuario) { }

    @Post('usuarios')
    @ApiNotFoundResponse({ description: 'Usuário não retornado' })
    @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
    @ApiInternalServerErrorResponse({ description: 'Erro ao criar usuário' })
    async novoUsuario(@Body() usuario: DadosNovoUsuario): Promise<UsuarioResposta | InternalServerErrorException> {
        try {
            const usuarioCriado = await this.criarUsuario.criarUsuario(usuario);
            if (!usuarioCriado) return new NotFoundException('Usuário não criado');
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
        catch (error) {
            throw new InternalServerErrorException('Erro ao criar usuário');
        }
    }
}