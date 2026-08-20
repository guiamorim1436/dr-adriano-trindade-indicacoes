import { useQuery } from "@tanstack/react-query";
import { adminDashboard } from "@/lib/api";

export default function AdminIndex() {
  const { data } = useQuery({ queryKey: ["dash"], queryFn: adminDashboard });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl text-primary">Visão geral</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Stat label="Indicadores" value={data?.totalIndicadores ?? "-"} />
        <Stat label="Indicações" value={data?.totalIndicacoes ?? "-"} />
        <Stat label="Convertidos" value={data?.totalConvertidos ?? "-"} />
      </div>
      <section>
        <h2 className="text-xl text-primary mb-3">Top indicadores</h2>
        <div className="rounded-2xl border border-border/60 bg-card divide-y">
          {(data?.ranking ?? []).length === 0 ? (
            <p className="p-5 text-muted-foreground text-sm">Ainda sem indicações.</p>
          ) : (
            (data?.ranking ?? []).map((r, i) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <span className="text-foreground">{i + 1}. {r.nome}</span>
                <span className="text-sm text-muted-foreground">{r.total} indicaç{r.total === 1 ? "ão" : "ões"}</span>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-serif text-4xl text-primary mt-1">{value}</p>
    </div>
  );
}
