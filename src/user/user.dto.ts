import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateUserDTO {
	@IsNotEmpty()
	@IsString()
	username: string;

	@IsNotEmpty()
	@IsString()
	password: string;

	@IsNotEmpty()
	@IsNumber()
	@Max(100)
	@Min(1)
	age: number;
}
