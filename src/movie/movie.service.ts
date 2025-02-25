import { BadRequestException, Injectable } from "@nestjs/common";
import { Transaction } from "kysely";
import { throwIfFalsy } from "../common/util";
import { Database, Tables } from "../database/database";
import { CreateMovieRequest, UpdateMovieRequest } from "./movie.dto";
import { Movie, MovieUpdate, NewMovie } from "./movie.entity";

// TODO: Tests (later because structure might change)
@Injectable()
export class MovieService {
	constructor(private readonly db: Database) {}

	async getById(id: number): Promise<Movie | undefined> {
		return this.db
			.selectFrom("movie")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}

	async create(input: CreateMovieRequest): Promise<NewMovie> {
		await this.validateName(input.name);

		return {
			...input,
			created_at: Date.now(),
		};
	}

	async validateName(name: string): Promise<void> {
		const movie = await this.getByName(name);

		throwIfFalsy(
			!movie,
			new BadRequestException(`Movie with name ${name} already exists!`),
		);
	}

	async insert(
		movie: NewMovie | NewMovie[],
		trx?: Transaction<Tables>,
	): Promise<Movie> {
		return (trx ?? this.db)
			.insertInto("movie")
			.values(movie)
			.returningAll()
			.executeTakeFirst();
	}

	async getByName(name: string): Promise<Movie | undefined> {
		return this.db
			.selectFrom("movie")
			.selectAll()
			.where("name", "=", name)
			.executeTakeFirst();
	}

	async delete(id: number, trx?: Transaction<Tables>): Promise<void> {
		await (trx ?? this.db).deleteFrom("movie").where("id", "=", id).execute();
	}

	// TODO: Modifications
	update(input: UpdateMovieRequest): MovieUpdate {
		return {
			...input,
			updated_at: Date.now(),
		};
	}
}
