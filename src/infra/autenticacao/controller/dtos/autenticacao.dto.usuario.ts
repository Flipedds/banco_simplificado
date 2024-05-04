import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class CredenciaisUsuario {
    @IsEmail({}, { message: 'Email inválido'})
    @ApiProperty()
    email: string;

    @ApiProperty()
    @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
    senha: string;
}