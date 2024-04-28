import { Body, Controller, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, Post } from "@nestjs/common";
import { CriarUsuario } from "src/application/usuarios/use-cases/usuarios.criar";
import { DadosNovoUsuario } from "./dtos/usuarios.dto.novo";
import { UsuarioResposta } from "./types/usuarios.types.resposta";
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiProduces } from "@nestjs/swagger";
import { BuscarUsuario } from "src/application/usuarios/use-cases/usuarios.buscar";
import { UsuarioEntidade } from "../persistence/usuarios.entity";
import { Carteira } from "../persistence/usuarios.carteira.entity";

@Controller()
export class UsuariosController {
    constructor(private readonly criarUsuario: CriarUsuario, private readonly buscarUsuario: BuscarUsuario) { }

    @Post('usuarios')
    @ApiNotFoundResponse({ description: 'Usuário não retornado' })
    @ApiCreatedResponse({ description: 'Usuário criado com sucesso' })
    @ApiInternalServerErrorResponse({ description: 'Erro ao criar usuário' })
    async novoUsuario(@Body() usuario: DadosNovoUsuario): Promise<UsuarioResposta | InternalServerErrorException> {
        try {
            const usuarioCriado = this.criarUsuario.criarUsuario(usuario);
            return usuarioCriado
                .then((usuarioCriado: { novoUsuario: UsuarioEntidade; novaCarteira: Carteira; }) => {
                    if (!usuarioCriado) throw new NotFoundException('Usuário não retornado');
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
                });
        }
        catch (error) {
            return new InternalServerErrorException('Erro ao criar usuário');
        }
    }

    @Get(':documento')
    @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
    @ApiInternalServerErrorResponse({ description: 'Erro ao buscar usuário' })
    @HttpCode(200)
    async buscarUsuarioPorDocumento(
        @Param('documento') documento: string
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
        }
        catch (error) {
            return new InternalServerErrorException('Erro ao buscar usuário');
        }
    }
}