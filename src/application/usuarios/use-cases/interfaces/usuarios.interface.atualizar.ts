import { DadosAtualizarUsuario } from "src/infra/usuarios/controller/dtos/usuarios.dto.atualizar";
import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";

export interface IAtualizarUsuario {
    atualizarUsuario(
        documento: string,
        dados: DadosAtualizarUsuario,
    ): Promise<UsuarioEntidade>;
}