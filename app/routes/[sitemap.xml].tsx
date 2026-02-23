export async function clientLoader() {
    const baseUrl = "https://ariapass.africa";

    const urls = [
        "",
        "/organisers",
        "/events",
        "terms-of-use",
        "/artists"
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${urls.map((url) =>
            `<url>
                <loc>${baseUrl}${url}</loc>
                <changefreq>weekly</changefreq>
                <priority>0.8</priority>
            </url>]`).join("")}
        </urlset>`
        ;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
}
