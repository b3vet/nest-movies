import { Injectable } from "@nestjs/common";
import { DateTime } from "luxon";
import { Database } from "../database/database";
import { CreateSessionRequest, UpdateSessionRequest } from "./session.dto";
import { NewSession, SessionUpdate } from "./session.entity";

// TODO: Tests (later because structure might change)
@Injectable()
export class SessionService {
	constructor(private readonly db: Database) {}

	create(input: CreateSessionRequest): NewSession {
		const startOfDate = DateTime.fromFormat(input.date, "yyyy-MM-dd", {
			zone: "utc",
		}).startOf("day");

		return {
			...input,
			date: startOfDate.toMillis(),
			created_at: Date.now(),
		};
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
}
