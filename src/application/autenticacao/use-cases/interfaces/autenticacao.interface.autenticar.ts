import { HttpException } from "@nestjs/common";
import { CredenciaisUsuario } from "src/infra/autenticacao/controller/dtos/autenticacao.dto.usuario";

export interface IAutenticarUsuario {
    autenticar(credenciais: CredenciaisUsuario): Promise<{ token: string } | HttpException>;
}