import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseIntPipe,
	Post,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam, ApiResponse } from "@nestjs/swagger";
import { HeaderUser } from "../auth/auth.type";
import { CurrentUser } from "../auth/currentUser.decorator";
import { WatchMovieResponse } from "./watch.dto";
import { WatchService } from "./watch.service";

@Controller("/watch")
@ApiBearerAuth("token")
export class WatchController {
	constructor(private readonly watchService: WatchService) {}

	@HttpCode(HttpStatus.OK)
	@Post("/movie/:id")
	@ApiResponse({
		status: HttpStatus.OK,
		type: WatchMovieResponse,
		description: "Movie watch status",
	})
	@ApiParam({ name: "id", type: Number, description: "Movie ID" })
	async watchMovie(
		@CurrentUser() user: HeaderUser,
		@Param("id", ParseIntPipe) movieId: number,
	) {
		return this.watchService.watchMovie(user.sub, movieId);
	}

	@Get("/history")
	async getWatchHistory(@CurrentUser() user: HeaderUser) {
		return this.watchService.getWatchHistory(user.sub);
	}
}
