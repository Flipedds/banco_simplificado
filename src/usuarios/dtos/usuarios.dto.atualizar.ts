import {
    IsEmail,
    IsOptional,
    IsStrongPassword,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailAlreadyExist } from '../validation/users.email.validation';

export class DadosAtualizarUsuario {
    @ApiProperty()
    @IsEmail()
    @IsEmailAlreadyExist({ message: 'Email $value já existe' })
    @IsOptional()
    email: string;

    @ApiProperty()
    @MinLength(8)
    @IsStrongPassword()
    @IsOptional()
    senha: string;
}