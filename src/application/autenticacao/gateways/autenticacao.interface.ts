import { UsuarioAutenticacao } from 'src/infra/autenticacao/persistence/autenticacao.entity';

export interface IRepositorioDeAutenticacao {
  buscarUsuario(email: string): Promise<UsuarioAutenticacao | null>;
}
