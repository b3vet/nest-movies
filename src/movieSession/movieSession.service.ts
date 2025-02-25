import { Injectable } from "@nestjs/common";
import { Transaction, sql } from "kysely";
import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/sqlite";
import { DateTime } from "luxon";
import { Database, Tables } from "../database/database";
import { MovieService } from "../movie/movie.service";
import { SessionService } from "../session/session.service";
import {
	CreateMovieWithSessionsRequest,
	DeleteMovieWithSessionsResponse,
	GetAllAvailableMoviesWithSessionsParams,
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
		const movieToInsert = await this.movieService.create(input.movie);
		const sessionsToInsert = await Promise.all(
			input.sessions.map((session) => this.sessionService.create(session)),
		);

		return this.db.transaction().execute(async (trx) => {
			const insertedMovie = await this.movieService.insert(movieToInsert, trx);

			await this.sessionService.insert(
				sessionsToInsert.map((session) => ({
					...session,
					movie_id: insertedMovie.id,
				})),
				trx,
			);

			const movieWithSessions = await this.moviesWithSessionsBaseQuery(trx)
				.where("movie.id", "=", insertedMovie.id)
				.executeTakeFirst();

			return this.parseMovie(movieWithSessions);
		});
	}

	async getAllAvailableMoviesWithSessions(
		params: GetAllAvailableMoviesWithSessionsParams,
	): Promise<GetAllAvailableMoviesWithSessionsResponse> {
		let query = this.moviesWithSessionsBaseQuery();

		if (params.startDate) {
			query = query.where((eb) =>
				eb.exists(
					eb
						.selectFrom("session")
						.select("session.id")
						.whereRef("session.movie_id", "=", "movie.id")
						.where(
							"session.date",
							">",
							DateTime.fromFormat(params.startDate, "yyyy-MM-dd").toMillis(),
						),
				),
			);
		}

		if (params.endDate) {
			query = query.where((eb) =>
				eb.exists(
					eb
						.selectFrom("session")
						.select("session.id")
						.whereRef("session.movie_id", "=", "movie.id")
						.where(
							"session.date",
							"<",
							DateTime.fromFormat(params.endDate, "yyyy-MM-dd").toMillis(),
						),
				),
			);
		}

		if (params.maxAge) {
			query = query.where("movie.age_restriction", "<=", params.maxAge);
		}

		if (params.movieName) {
			query = query.where("movie.name", "ilike", `%${params.movieName}%`);
		}

		const movies = await query.execute();

		const parsedMovies = movies.map(this.parseMovie);

		return { movies: parsedMovies };
	}

	async deleteMovieWithSessions(
		id: number,
	): Promise<DeleteMovieWithSessionsResponse> {
		await this.db.transaction().execute(async (trx) => {
			await this.movieService.delete(id, trx);
			await this.sessionService.deleteByMovieId(id, trx);
		});

		return {
			message: "Movie and sessions deleted successfully",
		};
	}

	async deleteMovieWithSessionsBulk(
		movieIds: number[],
	): Promise<DeleteMovieWithSessionsResponse> {
		await this.db.transaction().execute(async (trx) => {
			await Promise.all(
				movieIds.map(async (id) => {
					await this.movieService.delete(id, trx);
					await this.sessionService.deleteByMovieId(id, trx);
				}),
			);
		});

		return {
			message: "Movies and sessions deleted successfully",
		};
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
