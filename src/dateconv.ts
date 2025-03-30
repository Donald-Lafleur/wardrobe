import { add, constructNow, differenceInCalendarDays, format } from "date-fns";
import { daycount } from "kolmafia";

export function convertToLocalDate(kolday: number, formatstring = "yyyy-MM-dd HH:mm"): string {
	const koltoday = daycount();
	const dateFnsNow = constructNow(undefined);
	return format(add(dateFnsNow, { days: kolday - koltoday }), formatstring);
}

export function dateToKoLDaycount(date: Date): number {
	const koltoday = daycount();
	const today = constructNow(date);
	const difference = differenceInCalendarDays(date, today);
	return koltoday + difference;
}
