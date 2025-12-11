interface Ticket extends Model {
    eventId: string,
    name: string,
    description: string,
    price: string,
    theme: string,
    quantityAvailable: number,
    ticketPurchases: number,
    purchases?: TicketPurchase[];
    event: Pick<OrganiserEvent,
        'id' | 'slug' | 'title' | 'startTime' | 'venueAddress' | 'venueName' | 'city' | 'country' | 'bannerUrl'
    >
}