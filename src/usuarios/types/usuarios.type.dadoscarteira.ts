import { Carteira } from '../domain/usuarios.carteira.entity';

export type DadosCarteira = Omit<Carteira, 'id' | 'dt_alteracao'>;
