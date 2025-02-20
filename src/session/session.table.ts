import { ColumnType, Generated } from "kysely";
import { Slots } from "./session.types";

export interface SessionTable {
	id: Generated<number>;
	movie_id: ColumnType<number, number, never>;
	date: number; // stored as timestamp of the start of the day
	room: number;
	slot: Slots;

	created_at: ColumnType<Date, number, never>; // stored as timestamp
	updated_at: ColumnType<Date, never, number>; // stored as timestamp
}
