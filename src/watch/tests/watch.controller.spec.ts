import { INestApplication, ValidationPipe } from "@nestjs/common";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthGuard } from "../../auth/auth.guard";
import { WatchController } from "../watch.controller";
import { WatchService } from "../watch.service";

const mockWatchService = {
	watchMovie: vi.fn(),
	getWatchHistory: vi.fn(),
};

const mockAuthGuard = {
	canActivate: vi.fn((context) => {
		const request = context.switchToHttp().getRequest();
		request.user = { sub: 1, username: "testuser", role: "user" };
		return true;
	}),
};

describe("WatchController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleRef = await Test.createTestingModule({
			controllers: [WatchController],
			providers: [
				{
					provide: WatchService,
					useValue: mockWatchService,
				},
				{
					provide: AuthGuard,
					useValue: mockAuthGuard,
				},
			],
		}).compile();

		app = moduleRef.createNestApplication<NestFastifyApplication>(
			new FastifyAdapter(),
		);

		app.useGlobalGuards(mockAuthGuard);
		app.useGlobalPipes(new ValidationPipe({ transform: true }));

		await app.init();
		await app.getHttpAdapter().getInstance().ready();
	});

	describe("POST /watch/movie/:id", () => {
		it("should allow a user to watch a movie", async () => {
			// given
			const user = { sub: 1 };
			const movieId = 123;
			mockWatchService.watchMovie.mockResolvedValue({ status: "success" });

			// when
			const response = await request(app.getHttpServer())
				.post(`/watch/movie/${movieId}`)
				.set("Authorization", "Bearer token")
				.send()
				.expect(200);

			// then
			expect(response.body).toEqual({ status: "success" });
			expect(mockWatchService.watchMovie).toHaveBeenCalledWith(
				user.sub,
				movieId,
			);
		});
	});

	describe("GET /watch/history", () => {
		it("should return the user's watch history", async () => {
			// given
			const user = { sub: 1 };
			const watchHistory = [
				{ movieId: 123, watchedAt: "2024-01-01T00:00:00Z" },
			];
			mockWatchService.getWatchHistory.mockResolvedValue(watchHistory);

			// when
			const response = await request(app.getHttpServer())
				.get("/watch/history")
				.set("Authorization", "Bearer token")
				.expect(200);

			// then
			expect(response.body).toEqual(watchHistory);
			expect(mockWatchService.getWatchHistory).toHaveBeenCalledWith(user.sub);
		});
	});
});
