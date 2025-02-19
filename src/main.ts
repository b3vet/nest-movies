import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { config } from "dotenv";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";
import { GlobalErrorFilter } from "./globalError.filter";

(async () => {
	config();

	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
		{ bufferLogs: true },
	);

	const swaggerConfig = new DocumentBuilder()
		.setTitle("Movies API")
		.setDescription("A nice API for movies")
		.setVersion("1.0")
		.addBearerAuth(
			{ type: "http", scheme: "bearer", bearerFormat: "JWT" },
			"token",
		)
		.addTag("movies")
		.build();
	const documentFactory = () =>
		SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup("docs", app, documentFactory);

	const logger = app.get(Logger);

	app.useLogger(logger);
	app.enableCors();
	const httpAdapterHost = app.get(HttpAdapterHost);
	app.useGlobalFilters(new GlobalErrorFilter(httpAdapterHost));
	app.useGlobalPipes(new ValidationPipe());

	await app.listen(process.env.PORT ?? 3434, "0.0.0.0", (err, address) => {
		if (err) {
			logger.error(err);
			process.exit(1);
		}
		logger.log(`Server listening on ${address}`);
	});
})();
