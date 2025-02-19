import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { UserModule } from "./user/user.module";

@Module({
	imports: [
		LoggerModule.forRoot(),
		DatabaseModule.forRoot({}),
		AuthModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
