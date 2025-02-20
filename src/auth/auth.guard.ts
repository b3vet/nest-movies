import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { JWT_SECRET } from "./auth.constant";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get("public", context.getHandler());

		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest<FastifyRequest>();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			(request as any).user = await this.jwtService.verifyAsync(token, {
				secret: JWT_SECRET,
			});
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(request: FastifyRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		return type === "Bearer" ? token : undefined;
	}
}
