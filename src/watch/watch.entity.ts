import { Insertable, Selectable, Updateable } from "kysely";
import { WatchTable } from "./watch.table";

export type Watch = Selectable<WatchTable>;
export type NewWatch = Insertable<WatchTable>;
export type WatchUpdate = Updateable<WatchTable>;
