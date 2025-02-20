import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateMovieRequest {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "Movie name",
		example: "The Matrix",
		required: true,
		type: String,
	})
	name: string;

	@IsNotEmpty()
	@IsNumber()
	@Min(1)
	@Max(100)
	@ApiProperty({
		description: "Age restriction",
		example: 18,
		required: true,
		type: Number,
		minimum: 1,
		maximum: 100,
	})
	age_restriction: number;
}

export class UpdateMovieRequest {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({
		description: "Movie ID",
		example: 1,
		type: Number,
		required: true,
	})
	id: number;

	@IsString()
	@ApiProperty({
		description: "Movie name",
		example: "The Matrix",
		type: String,
	})
	name?: string;

	@IsNumber()
	@Min(1)
	@Max(100)
	@ApiProperty({
		description: "Age restriction",
		example: 18,
		type: Number,
		minimum: 1,
		maximum: 100,
	})
	age_restriction?: number;
}

export class MovieResponse {
	@IsNumber()
	@ApiProperty({
		description: "Movie ID",
		example: 1,
		type: Number,
	})
	id: number;

	@IsString()
	@ApiProperty({
		description: "Movie name",
		example: "The Matrix",
		type: String,
	})
	name: string;

	@IsNumber()
	@ApiProperty({
		description: "Age restriction",
		example: 18,
		type: Number,
	})
	age_restriction: number;
}
