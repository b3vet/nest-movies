import { BadRequestException, NotFoundException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "../../user/user.service";
import { AuthService } from "../auth.service";

vi.mock("bcrypt", () => ({
	default: { compare: vi.fn(async () => true) },
}));

const mockUserService = {
	create: vi.fn(),
	getByUsername: vi.fn(),
};

const mockJwtService = {
	signAsync: vi.fn(),
};

describe("AuthService", () => {
	let authService: AuthService;

	beforeEach(() => {
		vi.clearAllMocks();
		authService = new AuthService(
			mockUserService as unknown as UserService,
			mockJwtService as unknown as JwtService,
		);
	});

	describe("register", () => {
		it("should register a user and return a token", async () => {
			// given
			const mockUser = {
				id: 1,
				username: "testuser",
				age: 1,
				password: "hashed",
			};
			const input = {
				username: "testuser",
				password: "password123",
				age: 18,
			};
			mockUserService.create.mockResolvedValue(mockUser);
			mockJwtService.signAsync.mockResolvedValue("mockToken");

			// when
			const result = await authService.register(input);

			// them
			expect(result).toEqual({ token: "mockToken" });
			expect(mockUserService.create).toHaveBeenCalledWith(input);
			expect(mockJwtService.signAsync).toHaveBeenCalledWith({
				sub: 1,
				username: "testuser",
			});
		});
	});

	describe("login", () => {
		it("should return a token for valid credentials", async () => {
			// given
			const mockUser = {
				id: 1,
				username: "testuser",
				age: 18,
				password: "hashedPass",
			};
			mockUserService.getByUsername.mockResolvedValue(mockUser);
			mockJwtService.signAsync.mockResolvedValue("mockToken");

			// when
			const result = await authService.login({
				username: "testuser",
				password: "password123",
			});

			// then
			expect(result).toEqual({ token: "mockToken" });
			expect(mockUserService.getByUsername).toHaveBeenCalledWith("testuser");
			expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPass");
			expect(mockJwtService.signAsync).toHaveBeenCalledWith({
				sub: 1,
				username: "testuser",
			});
		});

		it("should throw NotFoundException if user does not exist", async () => {
			// given
			mockUserService.getByUsername.mockResolvedValue(null);
			const input = { username: "nonexistent", password: "password" };

			// when
			try {
				await authService.login(input);
			} catch (e) {
				// then
				expect(e).toBeInstanceOf(NotFoundException);
			}
		});

		it("should throw BadRequestException for invalid password", async () => {
			// given
			const mockUser = {
				id: 1,
				username: "testuser",
				password: "hashedPass",
			};
			mockUserService.getByUsername.mockResolvedValue(mockUser);
			const input = { username: "testuser", password: "wrongpassword" };

			// when
			try {
				await authService.login(input);
			} catch (e) {
				// then
				expect(e).toBeInstanceOf(BadRequestException);
			}
		});
	});
});
