import { Prisma } from '@prisma/client';
import EventGetPayload = Prisma.EventGetPayload;
import EventInclude = Prisma.EventInclude;
import { getLanguage } from '@/modules/i18n/client';

type Event = EventGetPayload<{ include: EventInclude }>;

export const groupEventsByDay = (events: Event[]) => {
  if (!events.length) {
    return null;
  }

  const format = (date: Date) => {
    return new Intl.DateTimeFormat(getLanguage(), {
      dateStyle: 'long',
    }).format(date);
  };

  const dates = Array.from(new Set(events.map((event) => format(new Date(event.createdAt)))));
  const eventsByDate = events.reduce(
    (result, event) => {
      const date = format(new Date(event.createdAt));

      if (!result[date]) {
        result[date] = [];
      }

      result[date].push(event);

      return result;
    },
    {} as Record<string, Event[]>,
  );

  return { dates, eventsByDate };
};
