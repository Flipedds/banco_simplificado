import { Carteira } from '../domain/usuarios.carteira.entity';

export type DadosCarteira = Omit<Carteira, 'id_carteira' | 'dt_alteracao'>;
