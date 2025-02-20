import { Insertable, Selectable, Updateable } from "kysely";
import { SessionTable } from "./session.table";

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
