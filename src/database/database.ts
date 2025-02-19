import { Kysely } from "kysely";
import { UserTable } from "../user/user.table";

interface Tables {
	user: UserTable;
}

export class Database extends Kysely<Tables> {}
