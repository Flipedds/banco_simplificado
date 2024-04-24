import { Usuario } from '../domain/usuarios.entity';

export type UsuarioSeguro = Omit<Usuario, 'senha' | 'documento'>;
