import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TipoUsuario } from '../enums/usuarios.enums.tipo';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmailAlreadyExist } from '../validation/users.email.validation';
import { IsDocumentAlreadyExist } from '../validation/users.documento.validation';

export class DadosNovoUsuario {
  @IsNotEmpty()
  @ApiProperty({ enum: TipoUsuario, enumName: 'TipoUsuario' })
  tipo: TipoUsuario;

  @MinLength(6)
  @ApiProperty()
  nome_completo: string;

  @ApiProperty()
  @MinLength(11)
  @MaxLength(14)
  @IsDocumentAlreadyExist({ message: 'Documento $value já existe' })
  documento: string;

  @ApiProperty()
  @IsEmail()
  @IsEmailAlreadyExist({ message: 'Email $value já existe' })
  email: string;

  @ApiProperty()
  @MinLength(8)
  @IsStrongPassword()
  senha: string;
}
