import type { MetaArgs, MetaFunction } from "react-router";

export const defaultMeta: MetaFunction = (args: MetaArgs<unknown, Record<string, unknown>>) => {
    return [
        // Standard Meta Tags
        { name: "theme-color", content: "#625DF5" },
        { name: "keywords", content: "concert, music, fan, ticketing, event booking, AriaPass, OwenaHub" },
        { name: "author", content: "OwenaHub Collective" },
        { name: "robots", content: "index, follow" },
        { name: "description", content: "Discover events, buy tickets, and connect with fellow music enthusiasts on AriaPass" },

        // Open Graph (Facebook, LinkedIn)
        { property: "og:title", content: "AriaPass - Promoting Live Musical Concerts" },
        { property: "og:description", content: "Discover events, buy tickets, and connect with fellow music enthusiasts on AriaPass" },
        { property: "og:image", content: "https://ariapass.owenahub.com/images/banners/app_banner.png" },
        { property: "og:url", content: "https://ariapass.owenahub.com" },
        { property: "og:type", content: "website" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@owenahub" }, // Optional: Add your Twitter handle
        { name: "twitter:title", content: "AriaPass - Promoting Live Musical Concerts" },
        { name: "twitter:description", content: "Discover events, buy tickets, and connect with fellow music enthusiasts on AriaPass" },
        { name: "twitter:image", content: "https://ariapass.owenahub.com/images/banners/app_banner.png" },
    ];
};