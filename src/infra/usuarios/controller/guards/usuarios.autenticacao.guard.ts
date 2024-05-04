import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }
  async canActivate(
    contexto: ExecutionContext,
  ): Promise<boolean> {
    const requisicao: Request = contexto.switchToHttp().getRequest();
    const token: string = this.extrairTokenDoCabecalho(requisicao);
    if (!token) throw new UnauthorizedException('Este recurso requer autenticação');
    try {
      await this.jwtService.verifyAsync(token);
    } catch (error) {
      throw new UnauthorizedException('Jwt inválido');
    }
    return true;
  }

  private extrairTokenDoCabecalho(requisicao: Request): string | undefined {
    const [tipo, token] = requisicao.headers.authorization?.split(' ') ?? [];
    return tipo === 'Bearer' ? token : undefined;
  }
}
