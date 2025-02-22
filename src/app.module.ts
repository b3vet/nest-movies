import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { MovieSessionModule } from "./movieSession/movieSession.module";
import { TicketModule } from "./ticket/ticket.module";
import { UserModule } from "./user/user.module";
import { WatchModule } from "./watch/watch.module";

@Module({
	imports: [
		LoggerModule.forRoot(),
		DatabaseModule.forRoot({}),
		AuthModule,
		UserModule,
		MovieSessionModule,
		TicketModule,
		WatchModule,
	],
	controllers: [AppController],
	providers: [],
})
export class AppModule {}
