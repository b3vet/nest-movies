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
					database: new SQLite(":memory:"),
				});

				return new Database({
					dialect,
				});
			},
		},
	],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
