import { Autenticacao } from "src/domain/autenticacao/autenticacao";
import { CredenciaisUsuario } from "../../../infra/autenticacao/controller/dtos/autenticacao.dto.usuario";
import { IRepositorioDeAutenticacao } from "../gateways/autenticacao.interface";
import { FabricaDeAutenticacao } from "../../../domain/autenticacao/autenticacao.factory";
import { UsuarioAutenticacao } from "src/infra/autenticacao/persistence/autenticacao.entity";
import { BadRequestException, HttpException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { IAutenticarUsuario } from "./interfaces/autenticacao.interface.autenticar";
import { JwtService } from "@nestjs/jwt";
import { AutenticacaoPayload } from "src/infra/autenticacao/controller/types/autenticacao.types.payload";

export class AutenticarUsuario implements IAutenticarUsuario {
    constructor(private readonly repositorio: IRepositorioDeAutenticacao, private jwtService: JwtService) { }
    async autenticar(credenciais: CredenciaisUsuario): Promise<{ token: string } | HttpException> {
        const autenticacao: Autenticacao = FabricaDeAutenticacao.comEmailESenha(credenciais.email, credenciais.senha);
        return new Promise((resolve, reject) => {
            this.repositorio.buscarUsuario(autenticacao.getEmail())
                .then(async (usuario: UsuarioAutenticacao) => {
                    if (!usuario || !bcrypt.compareSync(autenticacao.getSenha(), usuario.senha)) {
                        reject(new BadRequestException("Email ou senha inválidos"));
                    }
                    const payload: AutenticacaoPayload = {
                        sub: usuario.email,
                        nome: usuario.nome_completo,
                    }
                    resolve({ token: await this.jwtService.signAsync(payload) });
                })
                .catch((error) => reject(
                    new InternalServerErrorException({
                        mensagem: 'Erro ao autenticar usuário',
                        error: error,
                    })
                ));
        });
    };
}