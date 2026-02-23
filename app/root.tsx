import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
  type MetaFunction,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";
import "./styles/global.css";
import { Toaster } from "sonner";
import SplashScreen from "./components/skeletons/splash-screen";
import DefaultError from "./components/errors/default-error";
import ProgressBar from "./components/navigation/progress-bar";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const meta: MetaFunction = () => {
  return [
    // Standard Meta Tags
    { title: "AriaPass - Promoting Live Musical Concerts" },
    // Standard Meta Tags
    { name: "theme-color", content: "#625DF5" },
    { name: "keywords", content: "concert, music, fan, ticketing, event booking, AriaPass, OwenaHub" },
    { name: "author", content: "OwenaHub Collective" },
    { name: "robots", content: "index, follow" },
    { name: "description", content: "Discover events, buy tickets, and connect with fellow music enthusiasts on AriaPass" },

    // Open Graph (Facebook, LinkedIn)
    { property: "og:title", content: "AriaPass - Promoting Live Musical Concerts" },
    { property: "og:description", content: "Discover events, buy tickets, and connect with fellow music enthusiasts on AriaPass" },
    { property: "og:image", content: "https://ariapass.africa/images/banners/app_banner.png" },
    { property: "og:url", content: "https://ariapass.africa" },
    { property: "og:type", content: "website" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@owenahub" }, // Optional: Add your Twitter handle
    { name: "twitter:title", content: "AriaPass - Promoting Live Musical Concerts" },
    { name: "twitter:description", content: "Discover events, buy tickets, and connect with fellow music enthusiasts on AriaPass" },
    { name: "twitter:image", content: "https://ariapass.africa/images/banners/app_banner.png" },
  ];
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <ProgressBar />
        <Scripts />
        <Toaster
          richColors
          // closeButton
          position="top-center"
          toastOptions={{
            classNames: {
              actionButton: '!px-2 !rounded-full !text-white',
            },
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  const { state } = useNavigation();
  let busy: boolean = state === "submitting" || state === "loading";

  return (
    <div className={`${busy && "opacity-35"} transition`}>
      <Outlet />
    </div>
  )

}

export function HydrateFallback() {
  return <SplashScreen />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  return <DefaultError error={error} />
}
