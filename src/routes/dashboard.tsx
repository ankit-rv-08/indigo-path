import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CareerProvider } from "@/lib/career-context";
import { CareerHeader } from "@/components/career-header";
import { AccountabilityOverlay } from "@/components/accountability-overlay";
import { MikeSidebar } from "@/components/mike-sidebar";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <CareerProvider>
      <div className="min-h-screen pr-0 md:pr-[340px]">
        <CareerHeader />
        <Outlet />
        <AccountabilityOverlay variant="bottom" />
        <MikeSidebar />
        <Toaster />
      </div>
    </CareerProvider>
  );
}
