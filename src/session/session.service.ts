import { BadRequestException, Injectable } from "@nestjs/common";
import { Transaction } from "kysely";
import { DateTime } from "luxon";
import { throwIfFalsy } from "../common/util";
import { Database, Tables } from "../database/database";
import { CreateSessionRequest, UpdateSessionRequest } from "./session.dto";
import { NewSession, Session, SessionUpdate } from "./session.entity";
import { Slots } from "./session.types";

// TODO: Tests
@Injectable()
export class SessionService {
	constructor(private readonly db: Database) {}

	async getById(id: number): Promise<Session | undefined> {
		return this.db
			.selectFrom("session")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}

	async create(input: CreateSessionRequest): Promise<NewSession> {
		const startOfDate = DateTime.fromFormat(input.date, "yyyy-MM-dd", {
			zone: "utc",
		}).startOf("day");

		await this.validateRoom(startOfDate, input.slot, input.room);

		return {
			...input,
			date: startOfDate.toMillis(),
			created_at: Date.now(),
		};
	}

	async insert(
		session: NewSession | NewSession[],
		trx?: Transaction<Tables>,
	): Promise<Session> {
		return (trx ?? this.db)
			.insertInto("session")
			.values(session)
			.returningAll()
			.executeTakeFirst();
	}

	async validateRoom(date: DateTime, slot: Slots, room: number): Promise<void> {
		const session = await this.getByDateAndSlotAndRoom(date, slot, room);

		throwIfFalsy(
			!session,
			new BadRequestException(
				`Session at ${date.toLocaleString()} / ${slot} / Room: ${room} already occupied!`,
			),
		);
	}

	async deleteByMovieId(
		movieId: number,
		trx?: Transaction<Tables>,
	): Promise<void> {
		await (trx ?? this.db)
			.deleteFrom("session")
			.where("movie_id", "=", movieId)
			.execute();
	}

	// TODO: Modifications
	update(input: UpdateSessionRequest): SessionUpdate {
		return {
			...input,
			date: DateTime.fromFormat(input.date, "yyyy-MM-dd")
				.startOf("day")
				.toMillis(),
			updated_at: Date.now(),
		};
	}

	async getByDateAndSlotAndRoom(
		date: DateTime,
		slot: Slots,
		room: number,
	): Promise<Session | undefined> {
		return this.db
			.selectFrom("session")
			.selectAll()
			.where("date", "=", date.toMillis())
			.where("slot", "=", slot)
			.where("room", "=", room)
			.executeTakeFirst();
	}
}
