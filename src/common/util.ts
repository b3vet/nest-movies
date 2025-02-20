export function throwIfFalsy(value: any, exception: Error): void {
	if (!value) {
		throw exception;
	}
}
