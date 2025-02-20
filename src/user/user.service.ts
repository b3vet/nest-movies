import { Injectable } from "@nestjs/common";
import { RegisterRequest } from "../auth/auth.dto";
import { Database } from "../database/database";
import { NewUser, User } from "./user.entity";
import { hashPassword } from "./user.util";

@Injectable()
export class UserService {
	constructor(private readonly db: Database) {}

	async create(input: RegisterRequest): Promise<User> {
		const passwordHash = await hashPassword(input.password);

		const userToSave: NewUser = {
			username: input.username,
			password: passwordHash,
			role: "customer",
			age: input.age,
			created_at: Date.now(),
		};

		return this.db
			.insertInto("user")
			.values(userToSave)
			.returningAll()
			.executeTakeFirst();
	}

	async getByUsername(username: string): Promise<User | undefined> {
		return this.db
			.selectFrom("user")
			.selectAll()
			.where("username", "=", username)
			.executeTakeFirst();
	}
}
