import { Body, Controller, Delete, Get, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse } from "@nestjs/swagger";
import { Roles } from "../auth/roles.decorator";
import {
	CreateMovieWithSessionsRequest,
	DeleteMovieWithSessionsBulkRequest,
	DeleteMovieWithSessionsResponse,
	GetAllAvailableMoviesWithSessionsParams,
	GetAllAvailableMoviesWithSessionsResponse,
	MoviesWithSessionsResponse,
} from "./movieSession.dto";
import { MovieSessionService } from "./movieSession.service";

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
	@ApiQuery({ type: GetAllAvailableMoviesWithSessionsParams })
	async getAllAvailableMoviesWithSessions(
		@Query() params: GetAllAvailableMoviesWithSessionsParams,
	) {
		return this.movieSessionService.getAllAvailableMoviesWithSessions(params);
	}

	@Delete("/:id")
	@Roles(["manager"])
	@ApiResponse({
		status: 200,
		description: "Movie deleted",
		type: DeleteMovieWithSessionsResponse,
	})
	async deleteMovieWithSessions(@Query("id") id: number) {
		return this.movieSessionService.deleteMovieWithSessions(id);
	}

	@Delete("/")
	@Roles(["manager"])
	@ApiResponse({
		status: 200,
		description: "All movies deleted",
		type: DeleteMovieWithSessionsResponse,
	})
	@ApiBody({
		type: DeleteMovieWithSessionsBulkRequest,
	})
	async deleteMovieWithSessionsBulk(
		@Body() input: DeleteMovieWithSessionsBulkRequest,
	) {
		return this.movieSessionService.deleteMovieWithSessionsBulk(input.movieIds);
	}
}
