import { Module } from "@nestjs/common";
import { SessionModule } from "../session/session.module";
import { TicketController } from "./ticket.controller";
import { TicketService } from "./ticket.service";

@Module({
	imports: [SessionModule],
	controllers: [TicketController],
	providers: [TicketService],
	exports: [TicketService],
})
export class TicketModule {}
