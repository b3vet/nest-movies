import { Database } from "./database";

export function seedDatabase(db: Database): void {
	db.schema
		.createTable("user")
		.ifNotExists()
		.addColumn("id", "integer", (column) => column.primaryKey().autoIncrement())
		.addColumn("username", "text", (column) => column.notNull())
		.addColumn("password", "text", (column) => column.notNull())
		.addColumn("age", "integer", (column) => column.notNull())
		.addColumn("role", "text", (column) => column.notNull())
		.addColumn("created_at", "integer", (column) => column.notNull())
		.addColumn("updated_at", "integer")
		.execute();

	db.schema
		.createTable("movie")
		.ifNotExists()
		.addColumn("id", "integer", (column) => column.primaryKey().autoIncrement())
		.addColumn("name", "text", (column) => column.notNull())
		.addColumn("age_restriction", "integer", (column) => column.notNull())
		.addColumn("created_at", "integer", (column) => column.notNull())
		.addColumn("updated_at", "integer")
		.execute();

	db.schema
		.createTable("session")
		.ifNotExists()
		.addColumn("id", "integer", (column) => column.primaryKey().autoIncrement())
		.addColumn("movie_id", "integer", (column) => column.notNull())
		.addColumn("slot", "text", (column) => column.notNull())
		.addColumn("room", "integer", (column) => column.notNull())
		.addColumn("date", "integer", (column) => column.notNull())
		.addColumn("created_at", "integer", (column) => column.notNull())
		.addColumn("updated_at", "integer")
		.execute();

	db.selectFrom("user")
		.selectAll()
		.where("username", "=", "admin")
		.executeTakeFirst()
		.then((user) => {
			if (!user) {
				db.insertInto("user")
					.values({
						username: "admin",
						password:
							"$2b$10$OLDbI6A1DwjcOTuSzb6DiOC1HUXoVg.Xdys9C37mWUJGTxUqUojb2",
						role: "manager",
						age: 18,
						created_at: Date.now(),
					})
					.execute();
			}
		});
}
