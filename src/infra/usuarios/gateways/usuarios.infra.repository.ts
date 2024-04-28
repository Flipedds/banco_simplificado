import { IRepositorioDeUsuarios } from "src/application/usuarios/gateways/usuarios.interface";
import { Usuario } from "src/domain/usuarios/usuarios";
import { IRepositorioDeUsuariosPrisma } from "../persistence/usuarios.interface.repository";
import { UsuarioEntidade } from "../persistence/usuarios.entity";
import { Carteira } from "../persistence/usuarios.carteira.entity";

export class RepositorioDeUsuarios implements IRepositorioDeUsuarios {
    constructor(private readonly repositorio: IRepositorioDeUsuariosPrisma) { }
    remover(documento: string): Promise<UsuarioEntidade> {
        return this.repositorio.remover(documento);
    }
    listarUsuarios(): Promise<UsuarioEntidade[]> {
        return this.repositorio.listar();
    }
    buscarUsuario(documento: string): Promise<UsuarioEntidade | null> {
        return this.repositorio.buscarPorDocumento(documento);
    }
    cadastrarUsuario(usuario: Usuario): Promise<{ novoUsuario: UsuarioEntidade; novaCarteira: Carteira }>{
        return this.repositorio.criar(usuario);
    }
}