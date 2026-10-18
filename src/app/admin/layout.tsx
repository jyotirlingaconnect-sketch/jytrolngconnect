import { AdminLayout } from "@/components/AdminLayout";

export const metadata = {
  title: {
    default: "Admin Dashboard",
    template: "%s | Admin | Jyotirling Connect",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
