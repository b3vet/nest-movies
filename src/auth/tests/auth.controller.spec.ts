import { INestApplication, UnauthorizedException } from "@nestjs/common";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthController } from "../auth.controller";
import { LoginRequest, RegisterRequest } from "../auth.dto";
import { AuthService } from "../auth.service";

const mockAuthService = {
	register: vi.fn(),
	login: vi.fn(),
};

describe("AuthController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
			],
		}).compile();

		app = moduleRef.createNestApplication<NestFastifyApplication>(
			new FastifyAdapter(),
		);

		await app.init();
		await app.getHttpAdapter().getInstance().ready();
	});

	describe("POST /auth/register", () => {
		it("should register a user and return a token", async () => {
			// given
			const registerDto: RegisterRequest = {
				username: "testuser",
				password: "password123",
				age: 18,
			};
			mockAuthService.register.mockResolvedValue({ token: "mockToken" });

			// when
			const response = await request(app.getHttpServer())
				.post("/auth/register")
				.send(registerDto)
				.expect(201);

			// then
			expect(response.body).toEqual({ token: "mockToken" });
			expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
		});
	});

	describe("POST /auth/login", () => {
		it("should log in a user and return a token", async () => {
			// given
			const loginDto: LoginRequest = {
				username: "testuser",
				password: "password123",
			};
			mockAuthService.login.mockResolvedValue({ token: "mockToken" });

			// when
			const response = await request(app.getHttpServer())
				.post("/auth/login")
				.send(loginDto)
				.expect(200);

			// then
			expect(response.body).toEqual({ token: "mockToken" });
			expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
		});

		it("should return 401 for invalid credentials", async () => {
			// given
			const loginDto: LoginRequest = {
				username: "testuser",
				password: "wrongpassword",
			};
			mockAuthService.login.mockRejectedValue(new UnauthorizedException());

			// when, then
			await request(app.getHttpServer())
				.post("/auth/login")
				.send(loginDto)
				.expect(401);
		});
	});
});
