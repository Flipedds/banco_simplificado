import { UsuarioAutenticacao } from './autenticacao.entity';

export interface IRepositorioDeUsuariosAutenticacaoPrisma {
  buscarPorEmail(email: string): Promise<UsuarioAutenticacao | null>;
}
