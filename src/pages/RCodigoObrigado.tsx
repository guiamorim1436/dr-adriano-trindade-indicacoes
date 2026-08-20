import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";

export default function RCodigoObrigado() {
  return (
    <PageShell max="sm">
      <div className="text-center space-y-4 py-8">
        <h1 className="text-3xl text-primary">Obrigado ❤️</h1>
        <p className="text-muted-foreground">
          Recebemos seus dados. Em breve nossa equipe entrará em contato pelo WhatsApp.
        </p>
        <div className="pt-4">
          <Button asChild variant="ghost"><Link to="/">Voltar ao início</Link></Button>
        </div>
      </div>
    </PageShell>
  );
}
