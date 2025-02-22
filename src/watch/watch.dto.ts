import { ApiProperty } from "@nestjs/swagger";
import { MovieResponse } from "../movie/movie.dto";
import { SessionResponse } from "../session/session.dto";

export class WatchMovieResponse {
	@ApiProperty({
		type: String,
		description: "Message to confirm the movie was watched",
		example: "Movie watched successfully",
	})
	message: string;
}

export class WatchHistory {
	@ApiProperty({
		type: MovieResponse,
		description: "Watched movie details",
	})
	movie: MovieResponse;

	@ApiProperty({
		type: SessionResponse,
		description: "Session details",
	})
	session: SessionResponse;

	@ApiProperty({
		type: String,
		description: "Date and time when the movie was watched",
		example: "2021-08-01T12:00:00.000Z",
	})
	watched_at: string;
}

export class WatchHistoryResponse {
	@ApiProperty({
		type: [WatchHistory],
		description: "Watched movies history",
	})
	watched: WatchHistory[];
}
