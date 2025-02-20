import { Insertable, Selectable, Updateable } from "kysely";
import { MovieTable } from "./movie.table";

export type Movie = Selectable<MovieTable>;
export type NewMovie = Insertable<MovieTable>;
export type MovieUpdate = Updateable<MovieTable>;
