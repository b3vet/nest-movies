import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { HeaderUser } from "./auth.type";

export const CurrentUser = createParamDecorator(
	(data: any, context: ExecutionContext): HeaderUser => {
		const request = context.switchToHttp().getRequest();
		return request.user;
	},
);
