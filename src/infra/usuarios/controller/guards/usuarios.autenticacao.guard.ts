import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RequisicaoComPayload } from 'src/infra/transacoes/controller/guards/transacoes.autenticacao.guard';
import { AutenticacaoPayload } from 'src/infra/autenticacao/controller/types/autenticacao.types.payload';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }
  async canActivate(
    contexto: ExecutionContext,
  ): Promise<boolean> {
    const requisicao: RequisicaoComPayload = contexto.switchToHttp().getRequest<RequisicaoComPayload>();
    const token: string = this.extrairTokenDoCabecalho(requisicao);
    if (!token) throw new UnauthorizedException('Este recurso requer autenticação');
    try {
      const payload: AutenticacaoPayload = await this.jwtService.verifyAsync(token);
      requisicao.payload = payload;
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
