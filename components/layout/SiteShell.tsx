"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import Ticker from "./Ticker";
import LoadingBar from "./LoadingBar";
import CartSidebar from "@/components/cart/CartSidebar";
import { EditProvider } from "@/components/admin/EditContext";
import InlineEditBar from "@/components/admin/InlineEditBar";
import PreLaunchBanner from "@/components/prelaunch/PreLaunchBanner";
import ComingSoonModal from "@/components/prelaunch/ComingSoonModal";
import PreLaunchToast from "@/components/prelaunch/PreLaunchToast";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const isQuiz = pathname.startsWith("/quiz");

  if (isAdmin || isQuiz) {
    return <>{children}</>;
  }

  return (
    <EditProvider>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-primary focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Skip to content
      </a>
      <LoadingBar />
      <PreLaunchBanner />
      <Header />
      <Ticker />
      <ComingSoonModal />
      <main id="main-content">{children}</main>
      <Footer />
      <CartSidebar />
      <InlineEditBar />
      <PreLaunchToast />
    </EditProvider>
  );
}
