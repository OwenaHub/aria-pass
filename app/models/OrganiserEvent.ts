interface OrganiserEvent extends Model {
    bannerUrl: string;
    city: string;
    country: string;
    description: string;
    engagementVisible: boolean | number; // Could be treated as a boolean (1 for true, 0 for false)
    extraInfo: string;
    slug: string;
    eventType: string;
    startTime: string;
    endTime: string | null;
    date: string; // 'YYYY-MM-DD';

    status: 'draft' | 'suspended' | 'cancelled' | 'completed' | 'published',
    tickets: Ticket[];
    views: any[] | number;

    title: string;
    venueAddress: string;
    venueName: string;

    organiser: Pick<OrganiseProfile, "id" | "organiserName">;
    reviews: EventReviews[];
    liked?: boolean
    likes?: number;
    members: EventMember[];
    eventProgram?: EventProgram[];
    eventPlan?: EventPlan;
}