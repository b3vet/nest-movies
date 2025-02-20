import { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RolesGuard } from "../roles.guard";

const mockReflector = {
	get: vi.fn(),
};

describe("RolesGuard", () => {
	let rolesGuard: RolesGuard;
	let mockContext: ExecutionContext;
	let mockRequest: Partial<FastifyRequest>;

	beforeEach(() => {
		rolesGuard = new RolesGuard(mockReflector as unknown as Reflector);
		mockRequest = {
			headers: {},
		};

		(mockRequest as any).user = {
			role: "manager",
		};

		mockContext = {
			getHandler: () => {},
			switchToHttp: () => ({ getRequest: () => mockRequest }),
		} as unknown as ExecutionContext;
	});

	it("should return true for request with correct role header", async () => {
		// given
		mockReflector.get.mockReturnValue(["manager"]);

		// when
		const result = await rolesGuard.canActivate(mockContext);

		// then
		expect(result).toBe(true);
	});

	it("should return false for request with incorrect role header", async () => {
		// given
		mockReflector.get.mockReturnValue(["customer"]);

		// when
		const result = await rolesGuard.canActivate(mockContext);

		// then
		expect(result).toBe(false);
	});
});
