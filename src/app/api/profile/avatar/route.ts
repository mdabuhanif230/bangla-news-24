import { auth } from "@/lib/auth";

const allowedAvatarHost = (hostname: string) =>
  hostname === "avatars.githubusercontent.com" ||
  hostname === "github.com" ||
  hostname.endsWith(".googleusercontent.com");

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
    query: { disableCookieCache: true },
  });

  const image = session?.user.image;
  if (!image) return new Response(null, { status: 404 });

  let target: URL;
  try {
    target = new URL(image);
  } catch {
    return new Response(null, { status: 404 });
  }

  for (let redirects = 0; redirects <= 3; redirects += 1) {
    if (target.protocol !== "https:" || !allowedAvatarHost(target.hostname)) {
      return new Response(null, { status: 404 });
    }

    let response: Response;
    try {
      response = await fetch(target, {
        headers: { accept: "image/*" },
        redirect: "manual",
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      return new Response(null, { status: 502 });
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return new Response(null, { status: 404 });
      target = new URL(location, target);
      continue;
    }

    const contentType = response.headers.get("content-type") || "";
    if (!response.ok || !contentType.startsWith("image/")) {
      return new Response(null, { status: 404 });
    }

    return new Response(response.body, {
      headers: {
        "Cache-Control": "private, no-store",
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  return new Response(null, { status: 404 });
}
