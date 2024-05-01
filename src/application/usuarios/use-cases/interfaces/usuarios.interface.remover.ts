import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";

export interface IRemoverUsuario {
    removerUsuario(documento: string): Promise<UsuarioEntidade>;
}