import { Reflector } from "@nestjs/core";

export type Role = "customer" | "manager";

export const Roles = Reflector.createDecorator<Role[]>();
