import { Controller, Get, Injectable, Redirect } from "@nestjs/common";

@Injectable()
@Controller()
export class AppController {
	@Get("/")
	@Redirect("/docs")
	async redirectToDocs() {}

	@Get("/health")
	async healthCheck() {
		return {
			status: "ok",
		};
	}
}
