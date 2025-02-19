import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class RegisterRequest {
	@ApiProperty({
		description: "Username",
		example: "johndoe",
		required: true,
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({
		description: "Password",
		example: "12345678",
		required: true,
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty({
		description: "Age",
		example: 18,
		required: true,
		type: Number,
		minimum: 1,
		maximum: 100,
	})
	@IsNotEmpty()
	@IsNumber()
	@Max(100)
	@Min(1)
	age: number;
}

export class LoginRequest {
	@ApiProperty({
		description: "Username",
		example: "johndoe",
		required: true,
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({
		description: "Password",
		example: "12345678",
		required: true,
		type: String,
	})
	@IsNotEmpty()
	@IsString()
	password: string;
}

export class RegisterResponse {
	@ApiProperty({
		description: "Token",
		example: "my-very-long-jwt-token",
	})
	token: string;
}

export class LoginResponse extends RegisterResponse {}
