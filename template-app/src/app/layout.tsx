import type { Metadata } from "next";
import { ReactNode } from "react";
import { ReactQueryProviderWrapper } from "@/components/ReactQueryProviderWrapper";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export const metadata: Metadata = {
  title: "Template App",
  description: "Template App",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased">
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ReactQueryProviderWrapper>
            {children}
          </ReactQueryProviderWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
