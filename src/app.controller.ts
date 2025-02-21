import { Controller, Get, Injectable, Redirect } from "@nestjs/common";
import { Public } from "./auth/public.decorator";

@Injectable()
@Controller()
export class AppController {
	@Get("/")
	@Redirect("/docs")
	@Public()
	async redirectToDocs() {}

	@Get("/health")
	@Public()
	async healthCheck() {
		return {
			status: "ok",
		};
	}
}
