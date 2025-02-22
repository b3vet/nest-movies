import { Module } from "@nestjs/common";
import { SessionModule } from "../session/session.module";
import { TicketModule } from "../ticket/ticket.module";
import { WatchController } from "./watch.controller";
import { WatchService } from "./watch.service";

@Module({
	imports: [TicketModule, SessionModule],
	controllers: [WatchController],
	providers: [WatchService],
	exports: [WatchService],
})
export class WatchModule {}
