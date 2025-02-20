import { Kysely } from "kysely";
import { MovieTable } from "../movie/movie.table";
import { SessionTable } from "../session/session.table";
import { TicketTable } from "../ticket/ticket.table";
import { UserTable } from "../user/user.table";

export interface Tables {
	user: UserTable;
	movie: MovieTable;
	session: SessionTable;
	ticket: TicketTable;
}

export class Database extends Kysely<Tables> {}
