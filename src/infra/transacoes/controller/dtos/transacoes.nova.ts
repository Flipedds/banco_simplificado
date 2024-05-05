import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, Matches, MaxLength, Min, MinLength } from "class-validator";
import { TipoTransacao } from "../../../../domain/transacoes/transacoes.enums.tipo";

export class DadosNovaTransacao {
    @IsNotEmpty()
    @ApiProperty()
    @IsOptional()
    @Matches(/^(\d{11}|\d{14})$/, {
        message:
          'Documento carteira destino $value não aceito, apenas números 11 (cpf) ou 14 (cnpj) caracteres',
      })
    @MinLength(11, { message: 'Documento deve ter no mínimo 11 caracteres' })
    @MaxLength(14, { message: 'Documento deve ter no máximo 14 caracteres' })
    documentoCarteiraDestino?: string;

    @IsNotEmpty()
    @ApiProperty({ enum: TipoTransacao, enumName: 'TipoTransacao' })
    @IsEnum(TipoTransacao, { message: 'Tipo de transação $value inválida' })
    tipo: TipoTransacao;

    @IsNotEmpty()
    @ApiProperty()
    @Min(0.1, { message: 'Valor deve ser maior que 0' })
    valor: number;
}