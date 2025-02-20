import { Kysely } from "kysely";
import { MovieTable } from "../movie/movie.table";
import { SessionTable } from "../session/session.table";
import { UserTable } from "../user/user.table";

export interface Tables {
	user: UserTable;
	movie: MovieTable;
	session: SessionTable;
}

export class Database extends Kysely<Tables> {}
