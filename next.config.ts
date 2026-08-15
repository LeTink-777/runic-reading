import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /* www is canonical. Both hosts are attached to the Vercel project, so the
         apex would otherwise serve a duplicate copy of every page under a second
         origin. 308 keeps the method intact and tells search engines to fold the
         apex into www permanently. */
      {
        source: "/:path*",
        has: [{ type: "host", value: "runy-online.ru" }],
        destination: "https://www.runy-online.ru/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
