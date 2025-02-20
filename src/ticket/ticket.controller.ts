import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse } from "@nestjs/swagger";
import { HeaderUser } from "../auth/auth.type";
import { CurrentUser } from "../auth/currentUser.decorator";
import { BuyTicketRequest, TicketResponse } from "./ticket.dto";
import { TicketService } from "./ticket.service";

// TODO: Tests
@Controller("ticket")
@ApiBearerAuth("token")
export class TicketController {
	constructor(private readonly ticketService: TicketService) {}

	@Get("/")
	@ApiResponse({ status: 200, type: [TicketResponse] })
	async getMyTickets(@CurrentUser() user: HeaderUser) {
		return this.ticketService.getByUserId(user.sub);
	}

	@Post("/buy")
	@ApiBody({ type: BuyTicketRequest })
	@ApiResponse({ status: 201, type: TicketResponse })
	async buyTicket(
		@Body() input: BuyTicketRequest,
		@CurrentUser() user: HeaderUser,
	) {
		return this.ticketService.buy(input, user.sub);
	}
}
