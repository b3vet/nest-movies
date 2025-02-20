import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive } from "class-validator";
import { MovieResponse } from "../movie/movie.dto";
import { SessionResponse } from "../session/session.dto";

export class BuyTicketRequest {
	@IsNumber()
	@IsPositive()
	@IsNotEmpty()
	@ApiProperty({
		example: 1,
		description: "The ID of the session to buy a ticket for",
		minimum: 1,
	})
	session_id: number;

	@IsNumber()
	@IsPositive()
	@IsNotEmpty()
	@ApiProperty({
		example: 1,
		description: "The seat number to buy",
	})
	seat_number: number;

	@IsNumber()
	@IsPositive()
	@IsNotEmpty()
	@ApiProperty({
		example: 10,
		description: "The price of the ticket",
	})
	price: number;
}

export class TicketResponse {
	@ApiProperty({
		example: 1,
		description: "The ID of the ticket",
		minimum: 1,
	})
	id: number;

	@ApiProperty({
		description: "The details of the movie",
		type: MovieResponse,
	})
	movie: MovieResponse;

	@ApiProperty({
		description: "The details of the session",
		type: SessionResponse,
	})
	session: SessionResponse;

	@ApiProperty({
		example: 1,
		description: "The seat number",
	})
	seat_number: number;

	@ApiProperty({
		example: 10,
		description: "The price of the ticket",
	})
	price: number;
}
