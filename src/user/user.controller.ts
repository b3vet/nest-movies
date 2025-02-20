import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Roles } from "../auth/roles.decorator";
import { UserService } from "./user.service";

@Controller("user")
@ApiBearerAuth("token")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get("/guard-test")
	async guardTest() {
		return {
			message: "You are authenticated",
		};
	}

	@Roles(["manager"])
	@Get("/role-test")
	async roleTest() {
		return {
			message: "You are a manager! WOW!",
		};
	}
}
