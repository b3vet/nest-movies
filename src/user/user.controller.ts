import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { AuthGuard } from "../auth/auth.guard";
import { UserService } from "./user.service";

@Controller("user")
@UseGuards(AuthGuard)
@ApiBearerAuth("token")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("/guard-test")
	async guardTest() {
		return {
			message: "You are authenticated",
		};
	}
}
