import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ICriarTransacao } from "src/application/transacoes/use-cases/interfaces/transacoes.interface.criar";
import { DadosNovaTransacao } from "./dtos/transacoes.nova";

@ApiTags('Transações')
@Controller('transacoes')
export class TransacoesController {
    constructor(
        @Inject('ICriarTransacao') private readonly criar: ICriarTransacao,
    ) { }

    @Post()
    @ApiBearerAuth()
    async criarTransacao(
        @Body() dadosNovaTransacao: DadosNovaTransacao,
    ) {
        return this.criar.executar(dadosNovaTransacao);
    }
}