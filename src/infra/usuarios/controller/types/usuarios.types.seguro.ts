import { UsuarioEntidade } from "../../persistence/usuarios.entity";

export type UsuarioSeguro = Omit<UsuarioEntidade, 'senha' | 'documento'>;