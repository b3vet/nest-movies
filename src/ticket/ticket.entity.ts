import { Insertable, Selectable, Updateable } from "kysely";
import { TicketTable } from "./ticket.table";

export type Ticket = Selectable<TicketTable>;
export type NewTicket = Insertable<TicketTable>;
export type TicketUpdate = Updateable<TicketTable>;
