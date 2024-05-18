import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { TipoTransacao } from '../../../../domain/transacoes/transacoes.enums.tipo';

export class DadosNovaTransacao {
  @ApiProperty()
  @IsEmail({}, { message: 'Email inválido' })
  emailDestino: string;

  @IsNotEmpty()
  @ApiProperty({ enum: TipoTransacao, enumName: 'TipoTransacao' })
  @IsEnum(TipoTransacao, { message: 'Tipo de transação $value inválida' })
  tipo: TipoTransacao;

  @IsNotEmpty()
  @ApiProperty()
  @Min(0.1, { message: 'Valor deve ser maior que 0' })
  valor: number;
}
