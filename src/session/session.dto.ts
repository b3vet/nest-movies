import { ApiProperty } from "@nestjs/swagger";
import {
	IsDateString,
	IsIn,
	IsNotEmpty,
	IsNumber,
	IsString,
	Max,
	Min,
} from "class-validator";
import { Slots, slots } from "./session.types";

export class CreateSessionRequest {
	@IsString()
	@IsNotEmpty()
	@IsDateString()
	@ApiProperty({
		description: "Session date",
		example: "2021-10-10",
		type: String,
		required: true,
	})
	date: string;

	@IsNumber()
	@IsNotEmpty()
	@Min(1)
	@Max(100)
	@ApiProperty({
		description: "Room number",
		example: 1,
		type: Number,
		required: true,
		minimum: 1,
		maximum: 100,
	})
	room: number;

	@IsString()
	@IsNotEmpty()
	@IsIn(slots)
	@ApiProperty({
		description: "Session slot",
		example: "10:00-12:00",
		type: String,
		required: true,
	})
	slot: Slots;
}

export class UpdateSessionRequest {
	@IsNumber()
	@IsNotEmpty()
	@ApiProperty({
		description: "Slot ID",
		example: 1,
		type: Number,
		required: true,
	})
	id: number;

	@IsString()
	@IsDateString()
	@ApiProperty({
		description: "Session date",
		example: "2021-10-10",
		type: String,
	})
	date?: string;

	@IsNumber()
	@Min(1)
	@Max(100)
	@ApiProperty({
		description: "Room number",
		example: 1,
		type: Number,
		minimum: 1,
		maximum: 100,
	})
	room?: number;

	@IsString()
	@IsIn(slots)
	@ApiProperty({
		description: "Session slot",
		example: "10:00-12:00",
		type: String,
	})
	slot?: Slots;
}

export class SessionResponse {
	@ApiProperty({
		description: "Slot ID",
		example: 1,
		type: Number,
	})
	id: number;

	@ApiProperty({
		description: "Session date",
		example: "2021-10-10",
		type: String,
	})
	date: string;

	@ApiProperty({
		description: "Room number",
		example: 1,
		type: Number,
		minimum: 1,
		maximum: 100,
	})
	room: number;

	@ApiProperty({
		description: "Session slot",
		example: "10:00-12:00",
		type: String,
	})
	slot: Slots;
}
