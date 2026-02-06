import client from "~/http/client";
import type { Route } from "../_guest.events_.$slug/+types/route";
import { toast } from "sonner";
import { redirect, type MetaFunction } from "react-router";
import DesktopView from "./desktop-atf";
import MobileView from "./mobile-atf";

export const meta: MetaFunction = ({ data }: any) => {
  if (!data.event) {
    return [
      { title: "AriaPass - Discover the community behind the concerts" },
      { name: "description", content: "Discover the community behind the concerts" },
    ];
  }
  const event: OrganiserEvent = data.event;

  return [
    // Standard Meta Tags
    { title: `${event.title} | AriaPass` },
    { name: "description", content: event.description || "Discover the community behind the concerts" },
    { name: "theme-color", content: "#625DF5" },
    { name: "keywords", content: "concert community, music events, fan meetups, social ticketing, event organization, AriaPass, OwenaHub" },
    { name: "author", content: "OwenaHub Collective" },
    { name: "robots", content: "index, follow" },

    // Open Graph (Facebook, LinkedIn)
    { property: "og:title", content: `${event.title} | AriaPass` },
    { property: "og:description", content: event.description || "Discover the community behind the concerts" },
    { property: "og:image", content: "https://ariapass.owenahub.com/images/banners/app_banner.png" },
    { property: "og:url", content: "https://ariapass.owenahub.com" },
    { property: "og:type", content: "website" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@owenahub" }, // Optional: Add your Twitter handle
    { name: "twitter:title", content: `${event.title} | AriaPass` },
    { name: "twitter:description", content: event.description || "Discover the community behind the concerts" },
    { name: "twitter:image", content: "https://ariapass.owenahub.com/images/banners/app_banner.png" },
  ];
};

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  try {
    const { data } = await client.get(`api/events/${params.slug}`);
    return { event: data }
  } catch (error: any) {
    toast.error("Something went wrong", {
      description: `Status code ${error.status} - Unable to load resource`
    });
    return redirect('/')
  }
}

export default function ViewEvent({ loaderData }: Route.ComponentProps) {
  const { event }: { event: OrganiserEvent } = loaderData;

  return (
    <div className='bg-gray-50'>
      <div className="hidden lg:block">
        <DesktopView event={event} />
      </div>

      <div className="block lg:hidden">
        <MobileView event={event} />
      </div>
    </div>
  )
}
