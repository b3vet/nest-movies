import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
	IsArray,
	IsDateString,
	IsNumber,
	IsNumberString,
	IsOptional,
	IsString,
	ValidateNested,
} from "class-validator";
import { CreateMovieRequest, MovieResponse } from "../movie/movie.dto";
import { CreateSessionRequest, SessionResponse } from "../session/session.dto";

export class CreateMovieWithSessionsRequest {
	@ValidateNested()
	@Type(() => CreateMovieRequest)
	@ApiProperty({
		description: "Movie data",
		type: CreateMovieRequest,
		required: true,
	})
	movie: CreateMovieRequest;

	@ValidateNested({ each: true })
	@Type(() => CreateSessionRequest)
	@IsArray()
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

export class GetAllAvailableMoviesWithSessionsParams {
	@IsDateString()
	@IsOptional()
	@ApiProperty({
		description: "Start Date to filter sessions",
		required: false,
		example: "2024-01-01",
	})
	startDate?: string;

	@IsDateString()
	@IsOptional()
	@ApiProperty({
		description: "End Date to filter sessions",
		required: false,
		example: "2024-01-01",
	})
	endDate?: string;

	@IsString()
	@IsOptional()
	@ApiProperty({
		description: "Movie Name to filter sessions",
		required: false,
		example: "The Matrix",
	})
	movieName?: string;

	@IsNumberString()
	@IsOptional()
	@ApiProperty({
		description: "Minimum age to filter sessions",
		required: false,
		example: 13,
	})
	maxAge?: number;
}

export class DeleteMovieWithSessionsResponse {
	@ApiProperty({
		description: "Movie deleted status info",
		required: true,
	})
	message: string;
}

export class DeleteMovieWithSessionsBulkRequest {
	@IsArray()
	@IsNumber({}, { each: true })
	@ApiProperty({
		description: "Movie ids to delete",
		type: [Number],
		required: true,
	})
	movieIds: number[];
}
