import {
  addDays,
  differenceInCalendarDays,
  differenceInMonths,
  differenceInSeconds,
  format,
  isAfter,
  parseISO,
  subDays,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

function getHourFormated() {
  return format(new Date(), "HH:mm");
}

function getDateUTC() {
  return formatInTimeZone(new Date(), "America/Sao_Paulo", "yyyy-MM-dd");
}

function convertISO(hour: string) {
  const day: string = getDateUTC().split("T")[0];
  const formatedDate: string = `${day}T${hour}:00.000`;
  return formatedDate;
}

function convertHourISO(dateStr: string) {
  const formatedDate: string = `${dateStr}T00:00:00.000`;
  return formatedDate;
}

function getTodayFormated() {
  return getDateUTC().split("T")[0];
}

function getDateFormated() {
  const fullDate: string = format(new Date(), "EEEE, dd 'de' MMMM", {
    locale: ptBR,
  });
  const formatedDate: string =
    fullDate.charAt(0).toUpperCase() + fullDate.slice(1);

  return formatedDate;
}

function formatedDate(dateStr: string) {
  return format(parseISO(dateStr), "dd/MM/yyyy");
}

function formatedDayYear(dataStr: string) {
  const fullDate: string = format(parseISO(dataStr), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });
  return fullDate;
}

function calculateDaysFormated(
  dayInitial: Date | string,
  operator: "more" | "less" | "none",
) {
  let dateFull: string = "";

  if (operator === "more") {
    dateFull = format(addDays(dayInitial, 1), "EEEE, dd 'de' MMMM", {
      locale: ptBR,
    });
    dateFull = dateFull.charAt(0).toUpperCase() + dateFull.slice(1);
  } else if (operator === "less") {
    dateFull = format(subDays(dayInitial, 1), "EEEE, dd 'de' MMMM", {
      locale: ptBR,
    });
    dateFull = dateFull.charAt(0).toUpperCase() + dateFull.slice(1);
  } else if (operator === "none") {
    dateFull = format(dayInitial, "EEEE, dd 'de' MMMM", {
      locale: ptBR,
    });
    dateFull = dateFull.charAt(0).toUpperCase() + dateFull.slice(1);
  }

  return dateFull;
}

function subHoursFormated(startTime: string, endTime: string) {
  const today = getTodayFormated();
  const startTimeFormated: string = `${today}T${startTime}:00.000Z`;
  const endTimeFormated: string = `${today}T${endTime}:00.000Z`;

  const dateStart: Date = parseISO(startTimeFormated);
  const dateEnd: Date = parseISO(endTimeFormated);

  if (!isAfter(dateStart, dateEnd)) {
    const totalSeconds: number = Math.abs(
      differenceInSeconds(dateEnd, dateStart),
    );

    const hours: number = Math.floor(totalSeconds / 3600);
    const minutes: number = Math.floor((totalSeconds % 3600) / 60);

    const totalTime: string = `${hours}h:${minutes}min`;

    return totalTime;
  }

  return false;
}

function subYearsFormated(startDate: string | undefined) {
  if (!startDate) return "0.0";
  const months: number = differenceInMonths(new Date(), parseISO(startDate));
  return (months / 12).toFixed(1);
}

function subMonthsFormated(startDate: string | undefined) {
  if (!startDate) return 0;
  const months: number = differenceInMonths(new Date(), parseISO(startDate));
  return months;
}

function subDaysFormated(startTime: string) {
  const days: number = differenceInCalendarDays(
    new Date(),
    parseISO(startTime),
  );
  if (days === 0) {
    return "Hoje";
  } else if (days === 1) {
    return "Ontem";
  } else {
    return `Há ${days} dias`;
  }
}

export default {
  getHourFormated,
  getDateUTC,
  getDateFormated,
  formatedDate,
  calculateDaysFormated,
  subHoursFormated,
  subYearsFormated,
  subMonthsFormated,
  subDaysFormated,
  formatedDayYear,
  getTodayFormated,
  convertISO,
  convertHourISO,
  get date() {
    return new Date();
  },
};
