import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicConfig } from "@/lib/api";
import logoAsset from "@/assets/logo-clinica-ser.jpg.asset.json";

export function Logo({ to = "/" }: { to?: string }) {
  const { data } = useQuery({
    queryKey: ["public-config"],
    queryFn: getPublicConfig,
    staleTime: 1000 * 60 * 5,
  });

  const nome = data?.nome_plataforma || "Clinica SER";
  const logoUrl = data?.logo_url || logoAsset.url;

  return (
    <Link to={to} className="inline-flex items-center gap-2">
      <div className="h-9 w-9 rounded-full overflow-hidden flex items-center justify-center bg-background shrink-0 ring-1 ring-[hsl(var(--gold))]/40">
        <img src={logoUrl} alt={nome} className="h-full w-full object-contain" />
      </div>
      <span className="font-serif text-xl text-primary truncate max-w-[200px] sm:max-w-none">
        {nome}
      </span>
    </Link>
  );
}
