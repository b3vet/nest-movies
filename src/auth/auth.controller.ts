import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "./auth.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiBody({ type: RegisterRequest })
	@ApiResponse({
		status: HttpStatus.CREATED,
		description: "User registered",
		type: RegisterResponse,
	})
	@HttpCode(HttpStatus.CREATED)
	@Post("/register")
	async register(@Body() registerRequest: RegisterRequest) {
		return this.authService.register(registerRequest);
	}

	@ApiBody({ type: LoginRequest })
	@ApiResponse({
		status: HttpStatus.OK,
		description: "User logged in",
		type: LoginResponse,
	})
	@HttpCode(HttpStatus.OK)
	@Post("/login")
	async login(@Body() loginRequest: LoginRequest) {
		return this.authService.login(loginRequest);
	}
}
