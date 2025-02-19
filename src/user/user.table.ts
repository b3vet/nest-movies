import { ColumnType, Generated } from "kysely";

export type Role = "manager" | "customer";

export interface UserTable {
	id: Generated<number>;
	username: string;
	password: string;
	age: number;
	role: Role;

	created_at: ColumnType<Date, number, never>; // stored as timestamp
	updated_at: ColumnType<Date, never, number>; // stored as timestamp
}
