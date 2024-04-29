export class Usuario {
  private tipo: string;
  private nome_completo: string;
  private documento: string;
  private email: string;
  private senha: string;

  constructor(
    tipo: string,
    nome_completo: string,
    documento: string,
    email: string,
    senha: string,
  ) {
    this.tipo = tipo;
    this.nome_completo = nome_completo;
    this.documento = documento;
    this.email = email;
    this.senha = senha;
  }

  public get getTipo(): string {
    return this.tipo;
  }
  public get getNomeCompleto(): string {
    return this.nome_completo;
  }
  public get getDocumento(): string {
    return this.documento;
  }
  public get getEmail(): string {
    return this.email;
  }
  public get getSenha(): string {
    return this.senha;
  }
  public set setSenha(senha: string) {
    this.senha = senha;
  }
}
