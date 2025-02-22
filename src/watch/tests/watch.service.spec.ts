import { BadRequestException, NotFoundException } from "@nestjs/common";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Database } from "../../database/database";
import { SessionService } from "../../session/session.service";
import { TicketService } from "../../ticket/ticket.service";
import { WatchService } from "../watch.service";

const mockDb = {
	selectFrom: vi.fn(() => ({
		leftJoin: vi.fn(() => ({
			select: vi.fn(() => ({
				where: vi.fn(() => ({
					execute: vi.fn(() => [
						{
							movieId: 123,
							watchedAt: "2024-01-01T00:00:00Z",
						},
					]),
				})),
			})),
		})),
		selectAll: vi.fn(() => ({
			leftJoin: vi.fn(() => ({
				where: vi.fn(() => ({
					where: vi.fn(() => ({
						executeTakeFirst: vi.fn(),
					})),
				})),
			})),
		})),
	})),
	insertInto: vi.fn(() => ({
		values: vi.fn(() => ({
			returningAll: vi.fn(() => ({
				executeTakeFirst: vi.fn(() => ({ id: 1 })),
			})),
		})),
	})),
};

const mockTicketService = {
	getByMovieAndUserId: vi.fn(),
};

const mockSessionService = {
	getById: vi.fn(),
};

describe("WatchService", () => {
	let watchService: WatchService;

	beforeEach(() => {
		vi.clearAllMocks();
		watchService = new WatchService(
			mockDb as unknown as Database,
			mockTicketService as unknown as TicketService,
			mockSessionService as unknown as SessionService,
		);
	});

	describe("watchMovie", () => {
		it("should throw BadRequestException if the user already watched the movie", async () => {
			// given
			mockDb
				.selectFrom()
				.selectAll()
				.leftJoin()
				.where()
				.where()
				.executeTakeFirst.mockResolvedValue(undefined);

			// when-then
			await expect(watchService.watchMovie(1, 1)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("should throw BadRequestException if the user does not have a ticket", async () => {
			// given
			mockDb
				.selectFrom()
				.selectAll()
				.leftJoin()
				.where()
				.where()
				.executeTakeFirst.mockResolvedValue(null);
			mockTicketService.getByMovieAndUserId.mockResolvedValue(null);

			// when-then
			await expect(watchService.watchMovie(1, 1)).rejects.toThrow(
				BadRequestException,
			);
		});

		it("should throw NotFoundException if the session does not exist", async () => {
			// given
			mockDb
				.selectFrom()
				.selectAll()
				.leftJoin()
				.where()
				.where()
				.executeTakeFirst.mockResolvedValue(null);
			mockTicketService.getByMovieAndUserId.mockResolvedValue({
				session_id: 2,
			});
			mockSessionService.getById.mockResolvedValue(null);

			// when-then
			await expect(watchService.watchMovie(1, 1)).rejects.toThrow(
				NotFoundException,
			);
		});

		it("should insert a new watch record and return it", async () => {
			// given
			const mockSession = { id: 2 };
			const expectedResult = {
				message: "Movie watched successfully!",
			};
			mockDb
				.selectFrom()
				.selectAll()
				.leftJoin()
				.where()
				.where()
				.executeTakeFirst.mockResolvedValue(null);
			mockTicketService.getByMovieAndUserId.mockResolvedValue({
				session_id: 2,
			});
			mockSessionService.getById.mockResolvedValue(mockSession);

			// when
			const result = await watchService.watchMovie(1, 1);

			// then
			expect(result).toEqual(expectedResult);
			expect(mockDb.insertInto).toHaveBeenCalled();
		});
	});

	describe("getWatchHistory", () => {
		it("should return the user's watch history", async () => {
			// given
			const expectedResult = {
				watched: [
					{
						movieId: 123,
						watchedAt: "2024-01-01T00:00:00Z",
					},
				],
			};

			// when
			const result = await watchService.getWatchHistory(1);

			// then
			expect(result).toEqual(expectedResult);
		});
	});
});
