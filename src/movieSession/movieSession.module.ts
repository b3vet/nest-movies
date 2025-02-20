import { Module } from "@nestjs/common";
import { MovieModule } from "../movie/movie.module";
import { SessionModule } from "../session/session.module";
import { MovieSessionController } from "./movieSession.controller";
import { MovieSessionService } from "./movieSession.service";

@Module({
	imports: [MovieModule, SessionModule],
	controllers: [MovieSessionController],
	providers: [MovieSessionService],
	exports: [MovieSessionService],
})
export class MovieSessionModule {}
