export const slots = [
	"10:00-12:00",
	"12:00-14:00",
	"14:00-16:00",
	"16:00-18:00",
	"18:00-20:00",
	"20:00-22:00",
	"22:00-00:00",
] as const;

export type Slots = (typeof slots)[number];
