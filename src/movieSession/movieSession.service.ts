import { Injectable } from "@nestjs/common";
import { Transaction, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite";
import { Database, Tables } from "../database/database";
import { MovieService } from "../movie/movie.service";
import { SessionService } from "../session/session.service";
import {
	CreateMovieWithSessionsRequest,
	GetAllAvailableMoviesWithSessionsResponse,
	MoviesWithSessionsResponse,
} from "./movieSession.dto";

// TODO: Modifications
// TODO: Tests (later because structure might change)
@Injectable()
export class MovieSessionService {
	constructor(
		private readonly db: Database,
		private readonly movieService: MovieService,
		private readonly sessionService: SessionService,
	) {}

	async createMovieWithSessions(
		input: CreateMovieWithSessionsRequest,
	): Promise<MoviesWithSessionsResponse> {
		const movieToInsert = this.movieService.create(input.movie);
		const sessionsToInsert = input.sessions.map((session) =>
			this.sessionService.create(session),
		);

		return this.db.transaction().execute(async (trx) => {
			const insertedMovie = await trx
				.insertInto("movie")
				.values(movieToInsert)
				.returningAll()
				.executeTakeFirst();

			await trx
				.insertInto("session")
				.values(
					sessionsToInsert.map((session) => ({
						...session,
						movie_id: insertedMovie.id,
					})),
				)
				.execute();

			const movieWithSessions = await this.moviesWithSessionsBaseQuery(trx)
				.where("movie.id", "=", insertedMovie.id)
				.executeTakeFirst();

			return this.parseMovie(movieWithSessions);
		});
	}

	async getAllAvailableMovieSessions(): Promise<GetAllAvailableMoviesWithSessionsResponse> {
		const movies = await this.moviesWithSessionsBaseQuery()
			.where((eb) =>
				eb.exists(
					eb
						.selectFrom("session")
						.select("session.id")
						.whereRef("session.movie_id", "=", "movie.id")
						.where("session.date", ">", Date.now()),
				),
			)
			.execute();

		const parsedMovies = movies.map(this.parseMovie);

		return { movies: parsedMovies };
	}

	private moviesWithSessionsBaseQuery = (trx?: Transaction<Tables>) =>
		(trx ?? this.db).selectFrom("movie").select((eb) => [
			jsonObjectFrom(
				eb
					.selectFrom("movie as movieObjectCreator")
					.select([
						"movieObjectCreator.id",
						"movieObjectCreator.name",
						"movieObjectCreator.age_restriction",
					])
					.whereRef("movieObjectCreator.id", "=", "movie.id"),
			).as("movie"),
			jsonArrayFrom(
				eb
					.selectFrom("session")
					.select([
						"session.id",
						"session.slot",
						sql<string>`strftime('%Y-%m-%d', session.date / 1000, 'unixepoch')`.as(
							"date",
						),
						"session.room",
					])
					.whereRef("session.movie_id", "=", "movie.id")
					.where("session.date", ">", Date.now())
					.orderBy("date asc"),
			).as("sessions"),
		]);

	private parseMovie(
		movie: MoviesWithSessionsResponse,
	): MoviesWithSessionsResponse {
		return {
			movie:
				typeof movie.movie === "string" ? JSON.parse(movie.movie) : movie.movie, // Ensure it's parsed
			sessions:
				typeof movie.sessions === "string"
					? JSON.parse(movie.sessions)
					: movie.sessions, // Ensure it's parsed
		};
	}
}
