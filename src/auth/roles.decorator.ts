import { Reflector } from "@nestjs/core";
import { Role } from "./auth.type";

export const Roles = Reflector.createDecorator<Role[]>();
