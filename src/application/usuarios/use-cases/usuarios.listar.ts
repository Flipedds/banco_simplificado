import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";
import { IRepositorioDeUsuarios } from "../gateways/usuarios.interface";

export class ListarUsuarios {
    constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
    async listarUsuarios(): Promise<UsuarioEntidade[]> {
        return this.repositorio.listarUsuarios();
    }
}