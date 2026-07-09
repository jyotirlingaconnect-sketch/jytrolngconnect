import { AdminLayout } from "@/components/AdminLayout";

export const metadata = {
  title: "Admin Dashboard | Jyotirling Connect",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
