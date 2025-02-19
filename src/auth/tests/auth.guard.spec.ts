import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { JWT_SECRET } from "../auth.constant";
import { AuthGuard } from "../auth.guard";

const mockJwtService = {
	verifyAsync: vi.fn(),
};

describe("AuthGuard", () => {
	let authGuard: AuthGuard;
	let mockContext: ExecutionContext;
	let mockRequest: Partial<FastifyRequest>;

	beforeEach(() => {
		authGuard = new AuthGuard(mockJwtService as unknown as JwtService);
		mockRequest = { headers: {} };
		mockContext = {
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
		await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
			UnauthorizedException,
		);
	});

	it("should throw UnauthorizedException for invalid token", async () => {
		// given
		mockRequest.headers.authorization = "Bearer invalidToken";
		mockJwtService.verifyAsync.mockRejectedValue(new Error("Invalid token"));

		// when, then
		await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
			UnauthorizedException,
		);
	});

	it("should return undefined if authorization header is malformed", async () => {
		// given
		mockRequest.headers.authorization = "InvalidHeader";

		// when, then
		await expect(authGuard.canActivate(mockContext)).rejects.toThrow(
			UnauthorizedException,
		);
	});
});
