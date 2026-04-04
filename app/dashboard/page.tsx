import {
  DashboardDescription,
  DashboardHeader,
  DashboardHeaderContent,
  DashboardTitle,
} from "@/components/dashboard/panel";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <DashboardHeader>
        <DashboardHeaderContent>
          <DashboardTitle>Panel Principal</DashboardTitle>
          <DashboardDescription>
            Bienvenido al panel principal de SIGECOM.
          </DashboardDescription>
        </DashboardHeaderContent>
      </DashboardHeader>
    </div>
  );
}
