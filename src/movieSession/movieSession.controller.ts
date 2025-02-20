import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import { Roles } from "../auth/roles.decorator";
import {
	CreateMovieWithSessionsRequest,
	GetAllAvailableMoviesWithSessionsResponse,
	MoviesWithSessionsResponse,
} from "./movieSession.dto";
import { MovieSessionService } from "./movieSession.service";

// TODO: Tests (later because structure might change)
@Controller("/movie-session")
@ApiBearerAuth("token")
export class MovieSessionController {
	constructor(private readonly movieSessionService: MovieSessionService) {}

	@Post("/")
	@Roles(["manager"])
	@ApiBody({ type: CreateMovieWithSessionsRequest })
	@ApiResponse({
		status: 201,
		type: MoviesWithSessionsResponse,
		description: "Create a new movie with sessions",
	})
	async createMovieWithSessions(@Body() input: CreateMovieWithSessionsRequest) {
		return this.movieSessionService.createMovieWithSessions(input);
	}

	@Get("/")
	@ApiResponse({
		status: 200,
		type: GetAllAvailableMoviesWithSessionsResponse,
		description: "All movies with sessions after now",
	})
	async getAllAvailableMovieSessions() {
		return this.movieSessionService.getAllAvailableMovieSessions();
	}
}
