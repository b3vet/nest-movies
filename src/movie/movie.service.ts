import { Injectable } from "@nestjs/common";
import { Database } from "../database/database";
import { CreateMovieRequest, UpdateMovieRequest } from "./movie.dto";
import { MovieUpdate, NewMovie } from "./movie.entity";

// TODO: Tests (later because structure might change)
@Injectable()
export class MovieService {
	constructor(private readonly db: Database) {}

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
