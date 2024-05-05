export class Autenticacao {
  private email: string;
  private senha: string;
  constructor(email: string, senha: string) {
    this.email = email;
    this.senha = senha;
  }

  public getEmail(): string {
    return this.email;
  }
  public setEmail(email: string): void {
    this.email = email;
  }
  public getSenha(): string {
    return this.senha;
  }
  public setSenha(senha: string): void {
    this.senha = senha;
  }
}
