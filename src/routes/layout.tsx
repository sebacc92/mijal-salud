import { component$, Slot } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { Header } from "~/components/layout/Header";
import { Footer } from "~/components/layout/Footer";
import { WhatsAppFloat } from "~/components/layout/WhatsAppFloat";
import { Chatbot } from "~/components/chatbot/Chatbot";

export default component$(() => {
  const location = useLocation();
  const isAdmin = location.url.pathname.startsWith("/admin");

  if (isAdmin) {
    return <Slot />;
  }

  return (
    <>
      <Header />
      <main>
        <Slot />
      </main>
      <Footer />
      <WhatsAppFloat />
      <Chatbot />
    </>
  );
});

