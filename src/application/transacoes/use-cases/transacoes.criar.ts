import { DadosNovaTransacao } from 'src/infra/transacoes/controller/dtos/transacoes.nova';
import { IRepositorioDeTransacoes } from '../gateways/transacoes.interface';
import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FabricaDeTransacoes } from '../../../domain/transacoes/transacoes.factory';
import { TransacaoEntidade } from 'src/infra/transacoes/persistence/transacoes.entity';
import { ICriarTransacao } from './interfaces/transacoes.interface.criar';
import { AutenticacaoPayload } from 'src/infra/autenticacao/controller/types/autenticacao.types.payload';

export class CriarTransacao implements ICriarTransacao {
  constructor(private transacoesRepositorio: IRepositorioDeTransacoes) {}

  public async executar(
    req: AutenticacaoPayload,
    dadosNovaTransacao: DadosNovaTransacao,
  ): Promise<TransacaoEntidade | null> {
    const { sub } = req;
    const documentoCarteiraOrigem = sub;
    const { emailDestino, tipo, valor } = dadosNovaTransacao;
    return new Promise(async (resolve, reject) => {
      if (valor <= 0) {
        reject(new BadRequestException('Valor deve ser maior que 0'));
        return;
      }
      if (tipo === 'SAQUE') {
        const usuario = this.transacoesRepositorio.buscarUsuario(
          documentoCarteiraOrigem,
        );
        usuario
          .then(async (usuarioBuscado) => {
            if (!usuarioBuscado) {
              reject(
                new BadRequestException('Usuário de origem não encontrado'),
              );
              return;
            }
            const carteira = await this.transacoesRepositorio.buscarCarteira(
              usuarioBuscado.id,
            );
            if (carteira.saldo < valor) {
              reject(
                new BadRequestException(
                  `Saldo: ${carteira.saldo} insuficiente para saque`,
                ),
              );
              return;
            }
            this.transacoesRepositorio.atualizarCarteira(
              carteira.id,
              carteira.saldo - valor,
            );
            resolve(
              this.transacoesRepositorio.novaTransacao(
                FabricaDeTransacoes.comIdOrigemIdDestinoValorETipo(
                  carteira.id,
                  dadosNovaTransacao.valor,
                  dadosNovaTransacao.tipo,
                ),
              ),
            );
          })
          .catch((error) =>
            reject(
              new InternalServerErrorException({
                mensagem: 'Erro ao criar transacao: saque',
                error: error,
              }),
            ),
          );
      }
      if (tipo === 'DEPOSITO') {
        const usuario = this.transacoesRepositorio.buscarUsuario(
          documentoCarteiraOrigem,
        );
        usuario
          .then(async (usuarioBuscado) => {
            if (!usuarioBuscado) {
              reject(
                new BadRequestException('Usuário de origem não encontrado'),
              );
              return;
            }
            if (usuarioBuscado.tipo === 'LOJISTA') {
              reject(
                new BadRequestException(
                  'Usuário de origem não pode ser lojista',
                ),
              );
              return;
            }
            const carteira = await this.transacoesRepositorio.buscarCarteira(
              usuarioBuscado.id,
            );
            this.transacoesRepositorio.atualizarCarteira(
              carteira.id,
              carteira.saldo + valor,
            );
            resolve(
              this.transacoesRepositorio.novaTransacao(
                FabricaDeTransacoes.comIdOrigemIdDestinoValorETipo(
                  carteira.id,
                  dadosNovaTransacao.valor,
                  dadosNovaTransacao.tipo,
                ),
              ),
            );
          })
          .catch((error) =>
            reject(
              new InternalServerErrorException({
                mensagem: 'Erro ao criar transacao: deposito',
                error: error,
              }),
            ),
          );
      }

      if (tipo === 'TRANSFERENCIA') {
        const destinoUsuario = (await this.transacoesRepositorio.buscarUsuarioPorEmail(emailDestino));
        if(!destinoUsuario){
          reject(
            new NotFoundException('Usuário de destino não encontrado'),
          );
          return;
        }
        const documentoCarteiraDestino = destinoUsuario.documento;
        if (
          documentoCarteiraOrigem === documentoCarteiraDestino &&
          tipo === 'TRANSFERENCIA'
        ) {
          reject(
            new BadRequestException(
              'Documento de origem e destino não podem ser iguais',
            ),
          );
          return;
        }
        if (tipo === 'TRANSFERENCIA' && !documentoCarteiraDestino) {
          reject(
            new BadRequestException(
              'Documento de destino é obrigatório para transferência',
            ),
          );
          return;
        }
        const usuarioOrigem = this.transacoesRepositorio.buscarUsuario(
          documentoCarteiraOrigem,
        );
        const usuarioDestino = this.transacoesRepositorio.buscarUsuario(
          documentoCarteiraDestino,
        );
        usuarioOrigem
          .then(async (usuarioOrigemBuscado) => {
            if (!usuarioOrigemBuscado) {
              reject(
                new BadRequestException('Usuário de origem não encontrado'),
              );
              return;
            }
            if (usuarioOrigemBuscado.tipo === 'LOJISTA') {
              reject(
                new BadRequestException(
                  'Usuário de origem não pode ser lojista',
                ),
              );
              return;
            }
            usuarioDestino
              .then(async (usuarioDestinoBuscado) => {
                if (!usuarioDestinoBuscado) {
                  reject(
                    new BadRequestException(
                      'Usuário de destino não encontrado',
                    ),
                  );
                  return;
                }
                const carteiraOrigem =
                  await this.transacoesRepositorio.buscarCarteira(
                    usuarioOrigemBuscado.id,
                  );
                const carteiraDestino =
                  await this.transacoesRepositorio.buscarCarteira(
                    usuarioDestinoBuscado.id,
                  );
                if (carteiraOrigem.saldo < valor) {
                  reject(
                    new BadRequestException(
                      `Saldo: ${carteiraOrigem.saldo} insuficiente para transferência`,
                    ),
                  );
                  return;
                }
                this.transacoesRepositorio.atualizarCarteira(
                  carteiraOrigem.id,
                  carteiraOrigem.saldo - valor,
                );
                this.transacoesRepositorio.atualizarCarteira(
                  carteiraDestino.id,
                  carteiraDestino.saldo + valor,
                );
                resolve(
                  this.transacoesRepositorio.novaTransacao(
                    FabricaDeTransacoes.comIdOrigemIdDestinoValorETipo(
                      carteiraOrigem.id,
                      dadosNovaTransacao.valor,
                      dadosNovaTransacao.tipo,
                      carteiraDestino.id,
                    ),
                  ),
                );
              })
              .catch((error) =>
                reject(
                  new InternalServerErrorException({
                    mensagem: 'Erro ao criar transacao: transferencia',
                    error: error,
                  }),
                ),
              );
          })
          .catch((error) =>
            reject(
              new InternalServerErrorException({
                mensagem: 'Erro ao criar transacao: transferencia',
                error: error,
              }),
            ),
          );
      }
    });
  }
}
