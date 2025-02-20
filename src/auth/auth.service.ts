import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { User } from "../user/user.entity";
import { UserService } from "../user/user.service";
import {
	LoginRequest,
	LoginResponse,
	RegisterRequest,
	RegisterResponse,
} from "./auth.dto";
import { HeaderUser } from "./auth.type";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private jwtService: JwtService,
	) {}

	async register(input: RegisterRequest): Promise<RegisterResponse> {
		const user = await this.userService.create(input);

		return {
			token: await this.createToken(user),
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

		return {
			token: await this.createToken(user),
		};
	}

	private async createToken(user: User): Promise<string> {
		return this.jwtService.signAsync({
			sub: user.id,
			username: user.username,
			role: user.role,
		} satisfies HeaderUser);
	}

	private async comparePassword(
		password: string,
		hashedPassword: string,
	): Promise<boolean> {
		return bcrypt.compare(password, hashedPassword);
	}
}
