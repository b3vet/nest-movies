import { Body, Controller, Get, Post } from "@nestjs/common";
import {
	ApiBearerAuth,
	ApiBody,
	ApiExtraModels,
	ApiResponse,
} from "@nestjs/swagger";
import { Roles } from "../auth/roles.decorator";
import { CreateMovieRequest } from "../movie/movie.dto";
import { CreateSessionRequest } from "../session/session.dto";
import {
	CreateMovieWithSessionsRequest,
	GetAllAvailableMoviesWithSessionsResponse,
	MoviesWithSessionsResponse,
} from "./movieSession.dto";
import { MovieSessionService } from "./movieSession.service";

// TODO: Tests (later because structure might change)
@Controller("/movie-session")
@ApiBearerAuth("token")
@ApiExtraModels(
	CreateMovieWithSessionsRequest,
	CreateMovieRequest,
	CreateSessionRequest,
)
export class MovieSessionController {
	constructor(private readonly movieSessionService: MovieSessionService) {}

	@Post("/")
	@Roles(["manager"])
	@ApiBody({ type: CreateMovieWithSessionsRequest })
	@ApiResponse({ status: 201, type: MoviesWithSessionsResponse })
	async createMovieWithSessions(@Body() input: CreateMovieWithSessionsRequest) {
		return this.movieSessionService.createMovieWithSessions(input);
	}

	@Get("/")
	async getAllAvailableMovieSessions(): Promise<GetAllAvailableMoviesWithSessionsResponse> {
		return this.movieSessionService.getAllAvailableMovieSessions();
	}
}
