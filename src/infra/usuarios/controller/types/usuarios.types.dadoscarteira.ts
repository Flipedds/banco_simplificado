import { Carteira } from '../../persistence/usuarios.carteira.entity';

export type DadosCarteira = Omit<Carteira, 'id' | 'dt_alteracao'>;
