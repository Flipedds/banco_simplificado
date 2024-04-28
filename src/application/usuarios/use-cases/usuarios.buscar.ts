import { UsuarioEntidade } from "src/infra/usuarios/persistence/usuarios.entity";
import { IRepositorioDeUsuarios } from "../gateways/usuarios.interface";

export class BuscarUsuario {
    constructor(private readonly repositorio: IRepositorioDeUsuarios) { }
    async buscarUsuario(documento: string): Promise<UsuarioEntidade | null> {
        return this.repositorio.buscarUsuario(documento);
    }
}