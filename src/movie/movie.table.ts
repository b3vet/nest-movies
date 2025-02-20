import { ColumnType, Generated } from "kysely";

export interface MovieTable {
	id: Generated<number>;
	name: string;
	age_restriction: number;

	created_at: ColumnType<Date, number, never>; // stored as timestamp
	updated_at: ColumnType<Date, never, number>; // stored as timestamp
}
