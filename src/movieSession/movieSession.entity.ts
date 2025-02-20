import { Movie } from "../movie/movie.entity";
import { Session } from "../session/session.entity";

export type MovieWithSession = {
	movie: Movie;
	sessions: Session[];
};
