import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from "@nestjs/common";
import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/sqlite";
import { throwIfFalsy } from "../common/util";
import { Database } from "../database/database";
import { MovieService } from "../movie/movie.service";
import { SessionService } from "../session/session.service";
import { BuyTicketRequest, TicketResponse } from "./ticket.dto";
import { NewTicket, Ticket } from "./ticket.entity";

// TODO: Tests (later because structure might change)
// TODO: Refactor queries
@Injectable()
export class TicketService {
	constructor(
		private readonly db: Database,
		private readonly sessionService: SessionService,
	) {}

	async buy(input: BuyTicketRequest, userId: number): Promise<TicketResponse> {
		const session = await this.sessionService.getById(input.session_id);

		throwIfFalsy(session, new NotFoundException("Session not found"));

		const userTicket = await this.getTicketBySessionAndUserId(
			input.session_id,
			userId,
		);

		throwIfFalsy(
			!userTicket,
			new BadRequestException("User already has a ticket for this session"),
		);

		const ticket = await this.getTicketBySessionAndSeat(
			input.session_id,
			input.seat_number,
		);

		throwIfFalsy(!ticket, new BadRequestException("Seat is already taken"));

		const ticketToInsert: NewTicket = {
			...input,
			user_id: userId,
			created_at: Date.now(),
		};

		return this.db.transaction().execute(async (trx) => {
			const insertedTicket = await trx
				.insertInto("ticket")
				.values(ticketToInsert)
				.returningAll()
				.executeTakeFirst();

			const ticket = await trx
				.selectFrom("ticket")
				.select((eb) => [
					"ticket.id",
					"ticket.price",
					"ticket.seat_number",
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
							.where("session.id", "=", insertedTicket.session_id),
					).as("session"),
					jsonObjectFrom(
						eb
							.selectFrom("movie")
							.select(["movie.id", "movie.name", "movie.age_restriction"])
							.where("movie.id", "=", session.movie_id),
					).as("movie"),
				])
				.where("ticket.id", "=", insertedTicket.id)
				.executeTakeFirst();

			return this.parseTicket(ticket);
		});
	}

	async getByUserId(userId: number): Promise<TicketResponse[]> {
		const tickets = await this.db
			.selectFrom("ticket")
			.leftJoin("session", "session.id", "ticket.session_id")
			.select((eb) => [
				"ticket.id",
				"ticket.price",
				"ticket.seat_number",
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
						.where("session.id", "=", eb.ref("ticket.session_id")),
				).as("session"),
				jsonObjectFrom(
					eb
						.selectFrom("movie")
						.select((eb) => ["movie.id", "movie.name", "movie.age_restriction"])
						.where("movie.id", "=", eb.ref("session.movie_id")),
				).as("movie"),
			])
			.where("ticket.user_id", "=", userId)
			.execute();

		return tickets.map(this.parseTicket);
	}

	private async getTicketBySessionAndSeat(
		sessionId: number,
		seatNumber: number,
	): Promise<Ticket | undefined> {
		return this.db
			.selectFrom("ticket")
			.selectAll()
			.where("session_id", "=", sessionId)
			.where("seat_number", "=", seatNumber)
			.executeTakeFirst();
	}

	private async getTicketBySessionAndUserId(
		sessionId: number,
		userId: number,
	): Promise<Ticket | undefined> {
		return this.db
			.selectFrom("ticket")
			.selectAll()
			.where("session_id", "=", sessionId)
			.where("user_id", "=", userId)
			.executeTakeFirst();
	}

	private parseTicket(ticket: TicketResponse): TicketResponse {
		return {
			...ticket,
			session:
				typeof ticket.session === "string"
					? JSON.parse(ticket.session)
					: ticket.session,
			movie:
				typeof ticket.movie === "string"
					? JSON.parse(ticket.movie)
					: ticket.movie,
		};
	}
}
