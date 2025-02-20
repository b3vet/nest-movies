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
	movie: MovieResponse;
	sessions: SessionResponse[];
}

export class GetAllAvailableMoviesWithSessionsResponse {
	movies: MoviesWithSessionsResponse[];
}
