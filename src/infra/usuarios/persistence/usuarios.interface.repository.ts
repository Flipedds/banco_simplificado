import { DadosAtualizarUsuario } from '../controller/dtos/usuarios.dto.atualizar';
import { Carteira } from './usuarios.carteira.entity';
import { UsuarioEntidade } from './usuarios.entity';
import { Usuario } from 'src/domain/usuarios/usuarios';

export interface IRepositorioDeUsuariosPrisma {
  buscarPorEmail(email: string): Promise<UsuarioEntidade | null>;
  buscarPorDocumento(documento: string): Promise<{ usuario: UsuarioEntidade; carteira: Carteira; }>;
  criar(
    usuario: Usuario,
  ): Promise<{ novoUsuario: UsuarioEntidade; novaCarteira: Carteira }>;
  atualizar(
    documento: string,
    usuario: DadosAtualizarUsuario,
  ): Promise<UsuarioEntidade>;
  remover(documento: string): Promise<UsuarioEntidade>;
  listar(): Promise<UsuarioEntidade[]>;
  buscarPorDocumentoValidacao(documento: string): Promise<UsuarioEntidade | null>;
}
