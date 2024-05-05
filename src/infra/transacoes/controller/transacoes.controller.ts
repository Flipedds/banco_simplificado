import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ICriarTransacao } from "src/application/transacoes/use-cases/interfaces/transacoes.interface.criar";
import { DadosNovaTransacao } from "./dtos/transacoes.nova";
import { AutenticacaoTransacoesGuard } from "./guards/transacoes.autenticacao.guard";
import { TransacaoEntidade } from "../persistence/transacoes.entity";

@ApiTags('Transações')
@Controller('transacoes')
export class TransacoesController {
    constructor(
        @Inject('ICriarTransacao') private readonly criar: ICriarTransacao,
    ) { }

    @Post()
    @ApiBearerAuth()
    @UseGuards(AutenticacaoTransacoesGuard)
    async criarTransacao(
        @Body() dadosNovaTransacao: DadosNovaTransacao,
    ): Promise<TransacaoEntidade> {
        return this.criar.executar(dadosNovaTransacao);
    }
}