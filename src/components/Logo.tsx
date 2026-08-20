import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPublicConfig } from "@/lib/api";
const logoDefault = "https://drvictorvasques.com.br/wp-content/uploads/2023/01/logotipo.png";

export function Logo({ to = "/" }: { to?: string }) {
  const { data } = useQuery({
    queryKey: ["public-config"],
    queryFn: getPublicConfig,
    staleTime: 1000 * 60 * 5,
  });

  const nome = data?.nome_plataforma || "Clínica Vasques";
  const logoUrl = data?.logo_url || logoDefault;

  return (
    <Link to={to} className="inline-flex items-center">
      <div className="h-12 w-48 flex items-center justify-start shrink-0">
        <img src={logoUrl} alt={nome} className="h-full w-full object-contain object-left" />
      </div>
    </Link>
  );
}
