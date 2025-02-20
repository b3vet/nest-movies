import { Global, Module } from "@nestjs/common";
import SQLite from "better-sqlite3";
import { SqliteDialect } from "kysely";
import { Database } from "./database";
import { ConfigurableDatabaseModule } from "./database.moduleDefinition";
import { seedDatabase } from "./database.util";

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

				seedDatabase(db);

				return db;
			},
		},
	],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
