import { add, constructNow, differenceInCalendarDays, format } from "date-fns";
import { daycount } from "kolmafia";

export function convertToLocalDate(kolday: number): string {
	const koltoday = daycount();
	const dateFnsNow = constructNow(undefined);
	return format(add(dateFnsNow, { days: kolday - koltoday }), "yyyy-MM-dd HH:mm");
}

export function dateToKoLDaycount(date: Date): number {
	const koltoday = daycount();
	const today = constructNow(date);
	const difference = differenceInCalendarDays(date, today);
	return koltoday + difference;
}
