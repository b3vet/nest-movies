import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(Error)
export class GlobalErrorFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(error: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const { httpAdapter } = this.httpAdapterHost;

		const httpStatus =
			error instanceof HttpException
				? error.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		console.error(error);

		const responseBody = {
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
			message: error.message ?? "Unknown error?",
			stackTrace: error.stack,
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
