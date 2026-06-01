import { component$, Slot } from "@builder.io/qwik";
import { routeLoader$, useLocation } from "@builder.io/qwik-city";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { WhatsAppFloat } from "~/components/layout/WhatsAppFloat";
import { Chatbot } from "~/components/chatbot/Chatbot";
import { getDb } from "~/db";
import { chatbotSettings } from "~/db/schema";
import { eq } from "drizzle-orm";

export const useChatbotSettingsLoader = routeLoader$(async () => {
  try {
    const db = getDb();
    const [settings] = await db
      .select({
        activo: chatbotSettings.activo,
        saludo: chatbotSettings.saludo,
        avatarUrl: chatbotSettings.avatarUrl,
      })
      .from(chatbotSettings)
      .where(eq(chatbotSettings.id, 1))
      .limit(1);

    return settings || { activo: true, saludo: "", avatarUrl: "" };
  } catch (e) {
    console.error("Error loading chatbot settings in layout:", e);
    return { activo: true, saludo: "", avatarUrl: "" };
  }
});

export default component$(() => {
  const location = useLocation();
  const chatbotSettingsData = useChatbotSettingsLoader();
  const isAdmin = location.url.pathname.startsWith("/admin");

  if (isAdmin) {
    return <Slot />;
  }

  const s = chatbotSettingsData.value;

  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
      <WhatsAppFloat />
      {s.activo && (
        <Chatbot
          avatarUrl={s.avatarUrl || undefined}
          initialGreeting={s.saludo || undefined}
        />
      )}
    </>
  );
});

