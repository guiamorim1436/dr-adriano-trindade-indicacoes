import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicConfig } from "@/lib/api";
import logoLocal from "@/assets/logo-adriano-trindade.png";

export function Logo({ to = "/" }: { to?: string }) {
  const { data } = useQuery({
    queryKey: ["public-config"],
    queryFn: getPublicConfig,
    staleTime: 1000 * 60 * 5,
  });

  const nome = data?.nome_plataforma || "Dr. Adriano Trindade";
  const logoUrl = data?.logo_url || logoLocal;

  return (
    <Link to={to} className="inline-flex items-center">
      <div className="h-16 w-64 max-w-[70vw] flex items-center justify-start shrink-0">
        <img src={logoUrl} alt={nome} className="h-full w-full object-contain object-left" />
      </div>
    </Link>
  );
}
