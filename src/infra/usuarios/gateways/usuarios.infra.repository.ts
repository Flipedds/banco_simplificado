import { IRepositorioDeUsuarios } from "src/application/usuarios/gateways/usuarios.interface";
import { Usuario } from "src/domain/usuarios/usuarios";
import { IRepositorioDeUsuariosPrisma } from "../persistence/usuarios.interface.repository";
import { UsuarioEntidade } from "../persistence/usuarios.entity";
import { Carteira } from "../persistence/usuarios.carteira.entity";

export class RepositorioDeUsuarios implements IRepositorioDeUsuarios {
    constructor(private readonly repositorio: IRepositorioDeUsuariosPrisma) { }
    cadastrarUsuario(usuario: Usuario): Promise<{ novoUsuario: UsuarioEntidade; novaCarteira: Carteira }>{
        return this.repositorio.criar(usuario);
    }
}