import { IRepositorioDeAutenticacao } from "src/application/autenticacao/gateways/autenticacao.interface";
import { UsuarioAutenticacao } from "../persistence/autenticacao.entity";
import { IRepositorioDeUsuariosAutenticacaoPrisma } from "../persistence/autenticacao.interface.repository";


export class RepositorioDeAutenticacao implements IRepositorioDeAutenticacao {
    constructor(private readonly repositorio: IRepositorioDeUsuariosAutenticacaoPrisma){}

    buscarUsuario(email: string): Promise<UsuarioAutenticacao | null> {
        return this.repositorio.buscarPorEmail(email);
    }
}