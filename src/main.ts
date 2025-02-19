import { Logger } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { AppModule } from "./app.module";
import { GlobalErrorFilter } from "./globalError.filter";

(async () => {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	app.enableCors();

	const httpAdapterHost = app.get(HttpAdapterHost);
	app.useGlobalFilters(new GlobalErrorFilter(httpAdapterHost));

	const logger = app.get(Logger);

	await app.listen(process.env.PORT ?? 3434, "0.0.0.0", (err, address) => {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
		logger.log(`Server listening on ${address}`);
	});
})();
