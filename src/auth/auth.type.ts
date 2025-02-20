export type Role = "customer" | "manager";

export type HeaderUser = {
	sub: number;
	username: string;
	role: Role;
};
