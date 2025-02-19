import { Insertable, Selectable, Updateable } from "kysely";
import { UserTable } from "./user.table";

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
