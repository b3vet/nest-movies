import { Injectable } from "@nestjs/common";
import { Database } from "../database/database";
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

	create(input: CreateMovieRequest): NewMovie {
		return {
			...input,
			created_at: Date.now(),
		};
	}

	// TODO: Modifications
	update(input: UpdateMovieRequest): MovieUpdate {
		return {
			...input,
			updated_at: Date.now(),
		};
	}
}
