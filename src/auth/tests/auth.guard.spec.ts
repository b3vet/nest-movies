import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JWT_SECRET } from "../auth.constant";
import { AuthGuard } from "../auth.guard";

const mockJwtService = {
	verifyAsync: vi.fn(),
};
const mockReflector = {
	get: vi.fn(),
};

describe("AuthGuard", () => {
	let authGuard: AuthGuard;
	let mockContext: ExecutionContext;
	let mockRequest: Partial<FastifyRequest>;

	beforeEach(() => {
		authGuard = new AuthGuard(
			mockJwtService as unknown as JwtService,
			mockReflector as unknown as Reflector,
		);
		mockRequest = { headers: {} };
		mockContext = {
			getHandler: () => {},
			switchToHttp: () => ({ getRequest: () => mockRequest }),
		} as unknown as ExecutionContext;
	});

	it("should return true for valid token", async () => {
		// given
		mockRequest.headers.authorization = "Bearer validToken";
		mockJwtService.verifyAsync.mockResolvedValue({
			id: "123",
			username: "testuser",
		});
		mockReflector.get.mockReturnValue(false);

		// when
		const result = await authGuard.canActivate(mockContext);

		// then
		expect(result).toBe(true);
		expect(mockJwtService.verifyAsync).toHaveBeenCalledWith("validToken", {
			secret: JWT_SECRET,
		});
		expect((mockRequest as any).user).toEqual({
			id: "123",
			username: "testuser",
		});
	});

	it("should throw UnauthorizedException if no token is provided", async () => {
		// given, when, then
		mockReflector.get.mockReturnValue(false);
		await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
			UnauthorizedException,
		);
	});

	it("should throw UnauthorizedException for invalid token", async () => {
		// given
		mockRequest.headers.authorization = "Bearer invalidToken";
		mockJwtService.verifyAsync.mockRejectedValue(new Error("Invalid token"));
		mockReflector.get.mockReturnValue(false);

		// when, then
		await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
			UnauthorizedException,
		);
	});

	it("should return undefined if authorization header is malformed", async () => {
		// given
		mockRequest.headers.authorization = "InvalidHeader";
		mockReflector.get.mockReturnValue(false);

		// when, then
		await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
			UnauthorizedException,
		);
	});

	it("should return true for public route", async () => {
		// given
		mockReflector.get.mockReturnValue(true);

		// when
		const result = await authGuard.canActivate(mockContext);

		// then
		expect(result).toBe(true);
	});
});
