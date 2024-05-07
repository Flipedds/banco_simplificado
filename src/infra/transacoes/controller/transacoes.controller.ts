import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { ICriarTransacao } from 'src/application/transacoes/use-cases/interfaces/transacoes.interface.criar';
import { DadosNovaTransacao } from './dtos/transacoes.nova';
import {
  AutenticacaoTransacoesGuard,
  RequisicaoComPayload,
} from './guards/transacoes.autenticacao.guard';
import { TransacaoEntidade } from '../persistence/transacoes.entity';
import { IListarTransacoes } from 'src/application/transacoes/use-cases/interfaces/transacoes.interface.listar';
import { TransacaoListar } from './types/transacoes.types.listar';

@ApiTags('Transações')
@Controller('transacoes')
export class TransacoesController {
  constructor(
    @Inject('ICriarTransacao') private readonly criar: ICriarTransacao,
    @Inject('IListarTransacoes') private readonly listar: IListarTransacoes,
  ) { }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AutenticacaoTransacoesGuard)
  async criarTransacao(
    @Body() dadosNovaTransacao: DadosNovaTransacao,
    @Req() req: RequisicaoComPayload,
  ): Promise<TransacaoEntidade> {
    return this.criar.executar(req.payload, dadosNovaTransacao);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AutenticacaoTransacoesGuard)
  @ApiNotFoundResponse({ description: 'Transações não encontradas' })
  @ApiNotFoundResponse({ description: 'Carteira não encontrada' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })  
  async listarTransacoes(@Req() req: RequisicaoComPayload): Promise<TransacaoListar[]> {
    return this.listar.executar(req.payload);
  }
}
