import { ColumnType, Generated } from "kysely";

export interface TicketTable {
	id: Generated<number>;
	session_id: ColumnType<number, number, never>;
	user_id: ColumnType<number, number, never>;
	seat_number: number;
	price: number;

	created_at: ColumnType<Date, number, never>; // stored as timestamp
	updated_at: ColumnType<Date, never, number>; // stored as timestamp
}
