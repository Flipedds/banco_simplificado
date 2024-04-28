import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";
import { IRepositorioDeUsuarios } from "../gateways/usuarios.interface";

export class RemoverUsuario {
    constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
    async removerUsuario(documento: string): Promise<UsuarioEntidade> {
        return this.repositorio.remover(documento);
    }
}