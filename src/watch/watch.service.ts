import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { throwIfFalsy } from "../common/util";
import { Database } from "../database/database";
import { SessionService } from "../session/session.service";
import { TicketService } from "../ticket/ticket.service";
import {
	WatchHistory,
	WatchHistoryResponse,
	WatchMovieResponse,
} from "./watch.dto";
import { NewWatch } from "./watch.entity";

@Injectable()
export class WatchService {
	constructor(
		private readonly db: Database,
		private readonly ticketService: TicketService,
		private readonly sessionService: SessionService,
	) {}

	async watchMovie(
		userId: number,
		movieId: number,
	): Promise<WatchMovieResponse> {
		const watchedBefore = await this.db
			.selectFrom("watch")
			.selectAll()
			.leftJoin("session", "watch.session_id", "session.id")
			.where("watch.user_id", "=", userId)
			.where("session.movie_id", "=", movieId)
			.executeTakeFirst();

		throwIfFalsy(
			!watchedBefore,
			new BadRequestException("User already watched this movie!"),
		);

		const ticket = await this.ticketService.getByMovieAndUserId(
			movieId,
			userId,
		);

		throwIfFalsy(
			ticket,
			new BadRequestException("User doesn't have a ticket for this movie!"),
		);

		const session = await this.sessionService.getById(ticket.session_id);

		throwIfFalsy(session, new NotFoundException("Session not found"));

		const watchToInsert: NewWatch = {
			session_id: session.id,
			created_at: Date.now(),
			watched_at: Date.now(),
			user_id: userId,
		};

		const watch = await this.db
			.insertInto("watch")
			.values(watchToInsert)
			.returningAll()
			.executeTakeFirst();

		throwIfFalsy(
			watch,
			new InternalServerErrorException("Failed to watch movie!"),
		);

		return {
			message: "Movie watched successfully!",
		};
	}

	async getWatchHistory(userId: number): Promise<WatchHistoryResponse> {
		const watched = await this.db
			.selectFrom("watch")
			.leftJoin("session", "session.id", "watch.session_id")
			.select((eb) => [
				sql<string>`strftime('%Y-%m-%d', watch.watched_at / 1000, 'unixepoch')`.as(
					"watched_at",
				),
				jsonObjectFrom(
					eb
						.selectFrom("session")
						.select([
							"session.id",
							"session.slot",
							"session.room",
							sql<string>`strftime('%Y-%m-%d', session.date / 1000, 'unixepoch')`.as(
								"date",
							),
						])
						.where("session.id", "=", eb.ref("watch.session_id")),
				).as("session"),
				jsonObjectFrom(
					eb
						.selectFrom("movie")
						.select(["movie.id", "movie.name", "movie.age_restriction"])
						.where("movie.id", "=", eb.ref("session.movie_id")),
				).as("movie"),
			])
			.where("watch.user_id", "=", userId)
			.execute();

		return {
			watched: watched.map(this.parseWatch),
		};
	}

	private parseWatch(watch: WatchHistory): WatchHistory {
		return {
			...watch,
			session:
				typeof watch.session === "string"
					? JSON.parse(watch.session)
					: watch.session,
			movie:
				typeof watch.movie === "string" ? JSON.parse(watch.movie) : watch.movie,
		};
	}
}
