import { ApiProperty } from "@nestjs/swagger";
import { CreateMovieRequest, MovieResponse } from "../movie/movie.dto";
import { CreateSessionRequest, SessionResponse } from "../session/session.dto";

export class CreateMovieWithSessionsRequest {
	@ApiProperty({
		description: "Movie data",
		type: CreateMovieRequest,
		required: true,
	})
	movie: CreateMovieRequest;

	@ApiProperty({
		description: "Session data",
		type: [CreateSessionRequest],
		required: true,
	})
	sessions: CreateSessionRequest[];
}

export class MoviesWithSessionsResponse {
	@ApiProperty({
		description: "Movie details",
		type: MovieResponse,
		required: true,
	})
	movie: MovieResponse;

	@ApiProperty({
		description: "Session details",
		type: [SessionResponse],
		required: true,
	})
	sessions: SessionResponse[];
}

export class GetAllAvailableMoviesWithSessionsResponse {
	@ApiProperty({
		description: "Movies result",
		type: [MoviesWithSessionsResponse],
		required: true,
	})
	movies: MoviesWithSessionsResponse[];
}
