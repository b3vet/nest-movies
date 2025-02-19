import { Global, Module } from "@nestjs/common";
import SQLite from "better-sqlite3";
import { SqliteDialect } from "kysely";
import { Database } from "./database";
import { ConfigurableDatabaseModule } from "./database.moduleDefinition";

@Global()
@Module({
	exports: [Database],
	providers: [
		{
			provide: Database,
			useFactory: () => {
				const dialect = new SqliteDialect({
					database: new SQLite("db.db"),
				});

				const db = new Database({
					dialect,
				});

				db.schema
					.createTable("user")
					.ifNotExists()
					.addColumn("id", "integer", (column) =>
						column.primaryKey().autoIncrement(),
					)
					.addColumn("username", "text", (column) => column.notNull())
					.addColumn("password", "text", (column) => column.notNull())
					.addColumn("age", "integer", (column) => column.notNull())
					.addColumn("created_at", "integer", (column) => column.notNull())
					.addColumn("updated_at", "integer")
					.execute();

				return db;
			},
		},
	],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
