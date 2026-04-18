import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

const DEFAULT_LOCALE = "en";
const LOCALE_KEY = "locale";

export default getRequestConfig(async () => {
  const cookiesStore = await cookies();
  const locale = cookiesStore.get(LOCALE_KEY)?.value ?? DEFAULT_LOCALE;

  const file = await import(`../../messages/${locale}.json`);

  return {
    locale,
    messages: file.default,
  };
});
