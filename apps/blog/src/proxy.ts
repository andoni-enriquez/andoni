import createIntlMiddleware from "next-intl/middleware";
import { routing } from "~/lib/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export const proxy = intlMiddleware;

export const config = {
  matcher: ["/((?!_next/|api/|static/|favicon\\.ico|llms\\.txt|.*\\.png$).*)"],
};
