import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function parseForm(request: Request): Promise<
  Record<string, FormDataEntryValue>
> {
  const formData = await request.formData();
  const credentials = Object.fromEntries(formData);

  return credentials;
};

export function truncateText(text: string, length = 50): string {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text
}

export function to12HourFormat(time24: string): string {
  const [hourStr, minuteStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

export function isPastEventDate(date: string, startTime: string | null): boolean {
  // Combine date and time into a full ISO string
  const eventDateTime = new Date(
    `${date}T${startTime ?? "00:00:00"}`
  );

  const now = new Date();

  return eventDateTime.getTime() < now.getTime();
}

export function extractNames(members: OrganiserEvent['members']) {
  if (!Array.isArray(members)) return [];
  return members.map(member => member.name);
}

export function getEventRevenue(event: OrganiserEvent) {
  const getPurchases = (args: Ticket[]): TicketPurchase[] => {
    return args.flatMap(ticket =>
      (ticket.purchases ?? []).map(item => ({
        ...item,
        ticket: {
          id: ticket.id,
          eventId: ticket.eventId,
          name: ticket.name,
          description: ticket.description,
          price: ticket.price,
          theme: ticket.theme,
          quantityAvailable: ticket.quantityAvailable,
          ticketPurchases: ticket.ticketPurchases,
          event: ticket.event,
        },
      }))
    );
  }

  function sumPrices(purchases: TicketPurchase[]) {
    return purchases.reduce((total, item) => {
      const amount = parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  }

  return sumPrices(getPurchases(event.tickets));
}

export function eventTicketPurchases(args: Ticket[]): TicketPurchase[] {
  return args.flatMap(ticket =>
    (ticket.purchases ?? []).map(item => ({
      ...item,
      ticket: {
        id: ticket.id,
        eventId: ticket.eventId,
        name: ticket.name,
        description: ticket.description,
        price: ticket.price,
        theme: ticket.theme,
        quantityAvailable: ticket.quantityAvailable,
        ticketPurchases: ticket.ticketPurchases,
        event: ticket.event,
      },
    }))
  );
}