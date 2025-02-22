import { ColumnType, Generated } from "kysely";

export interface WatchTable {
	id: Generated<number>;
	user_id: ColumnType<number, number, never>;
	watched_at: ColumnType<Date, number, never>;
	session_id: ColumnType<number, number, never>;

	created_at: ColumnType<Date, number, never>; // stored as timestamp
	updated_at: ColumnType<Date, never, number>; // stored as timestamp
}
