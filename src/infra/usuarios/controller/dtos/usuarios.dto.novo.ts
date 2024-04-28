import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsStrongPassword,
    MaxLength,
    MinLength,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  import { IsEmailAlreadyExist } from '../validation/users.email.validation';
  import { IsDocumentAlreadyExist } from '../validation/users.documento.validation';
import { TipoUsuario } from 'src/domain/usuarios/usuarios.enums.tipo';
  
  export class DadosNovoUsuario {
    @IsNotEmpty()
    @ApiProperty({ enum: TipoUsuario, enumName: 'TipoUsuario' })
    @IsEnum(TipoUsuario, { message: 'Tipo de usuário $value inválido' })
    tipo: TipoUsuario;
  
    @MinLength(6, { message: 'Nome completo deve ter no mínimo 6 caracteres' })
    @ApiProperty()
    nome_completo: string;
  
    @ApiProperty()
    @MinLength(11, { message: 'Documento deve ter no mínimo 11 caracteres' })
    @MaxLength(14, { message: 'Documento deve ter no máximo 14 caracteres' })
    @IsDocumentAlreadyExist({ message: 'Documento $value já existe' })
    documento: string;
  
    @ApiProperty()
    @IsEmail({}, { message: 'Email inválido' })
    @IsEmailAlreadyExist({ message: 'Email $value já existe' })
    email: string;
  
    @ApiProperty()
    @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
    @IsStrongPassword({}, { message: 'Senha fraca'})
    senha: string;
  }