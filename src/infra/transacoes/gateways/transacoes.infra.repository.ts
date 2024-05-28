import { IRepositorioDeTransacoes } from 'src/application/transacoes/gateways/transacoes.interface';
import { Transacao } from 'src/domain/transacoes/transacoes';
import { Carteira } from 'src/infra/usuarios/persistence/usuarios.carteira.entity';
import { UsuarioEntidade } from 'src/infra/usuarios/persistence/usuarios.entity';
import { TransacaoEntidade } from '../persistence/transacoes.entity';
import { IRepositorioDeTransacoesPrisma } from '../persistence/transacoes.interface.repository';

export class RepositorioDeTransacoes implements IRepositorioDeTransacoes {
  constructor(private readonly repositorio: IRepositorioDeTransacoesPrisma) {}
  buscarCarteiraPorId(id: number): Promise<Carteira> {
    return this.repositorio.buscarCarteiraPorId(id);
  }
  buscarUsuarioPorEmail(email: string): Promise<UsuarioEntidade> {
    return this.repositorio.buscarPorEmail(email);
  }
  buscarUsuarioPorId(id: number): Promise<UsuarioEntidade> {
    return this.repositorio.buscarPorId(id);
  }
  listarTransacoes(id_carteira: number): Promise<TransacaoEntidade[]> {
    return this.repositorio.listar(id_carteira);
  }
  buscarUsuario(documento: string): Promise<UsuarioEntidade> {
    return this.repositorio.buscarPorDocumento(documento);
  }
  buscarCarteira(id_cliente: number): Promise<Carteira> {
    return this.repositorio.buscarCarteira(id_cliente);
  }
  atualizarCarteira(id: number, valor: number): Promise<void> {
    return this.repositorio.atualizarCarteira(id, valor);
  }
  novaTransacao(transacao: Transacao): Promise<TransacaoEntidade> {
    return this.repositorio.novaTransacao(transacao);
  }
}
