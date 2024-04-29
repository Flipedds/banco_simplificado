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
  @IsEmail({}, { message: 'Email inválido' })
  @IsEmailAlreadyExist({ message: 'Email $value já existe' })
  @IsOptional()
  email: string;

  @ApiProperty()
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @IsStrongPassword({}, { message: 'Senha fraca' })
  @IsOptional()
  senha: string;
}
