import { DashboardDescription } from "@/components/dashboard/panel/dashboard-description";
import { DashboardHeader } from "@/components/dashboard/panel/dashboard-header";
import { DashboardTitle } from "@/components/dashboard/panel/dashboard-title";
import { ReportGrid } from "@/components/reports/report-grid";
import { FileBarChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <DashboardHeader>
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-4 rounded-2xl hidden md:block border border-primary/10 shadow-inner">
            <FileBarChart className="h-7 w-7 text-primary" />
          </div>
          <div>
            <DashboardTitle>Centro de Reportes</DashboardTitle>
            <DashboardDescription>
              Genere informes detallados y estadísticas de la comunidad para la toma de decisiones.
            </DashboardDescription>
          </div>
        </div>
      </DashboardHeader>

      <div className="bg-muted/10 p-6 md:p-10 rounded-3xl border border-border/40 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <FileBarChart className="size-64" />
        </div>
        
        <ReportGrid />
        
        <div className="mt-16 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 transition-all hover:bg-primary/10">
            <div className="space-y-1">
                <h3 className="font-bold text-primary">¿Necesita un reporte personalizado?</h3>
                <p className="text-sm text-muted-foreground">
                    Si no encuentra la combinación de datos necesaria, contacte al administrador del sistema.
                </p>
            </div>
            <div className="flex gap-2">
                <div className="flex items-center gap-1.5 bg-background/50 px-3 py-1.5 rounded-full border border-border/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                   Exportación: PDF / EXCEL / CSV
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
