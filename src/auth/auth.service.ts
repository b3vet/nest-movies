import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { UserService } from "../user/user.service";
import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "./auth.dto";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	async register(input: RegisterRequest): Promise<RegisterResponse> {
		const user = await this.userService.create(input);

		const token = await this.jwtService.signAsync({
			sub: user.id,
			username: user.username,
		});

		return {
			token,
		};
	}

	async login(input: LoginRequest): Promise<LoginResponse> {
		const user = await this.userService.getByUsername(input.username);

		if (!user) {
			throw new NotFoundException();
		}

		const passwordMatch = await this.comparePassword(
			input.password,
			user.password,
		);

		if (!passwordMatch) {
			throw new BadRequestException("Invalid password");
		}

		const token = await this.jwtService.signAsync({
			sub: user.id,
			username: user.username,
		});

		return {
			token,
		};
	}

	private async comparePassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}
}
