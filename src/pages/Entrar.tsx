import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { entrarPorTelefone } from "@/lib/api";

export default function Entrar() {
  const navigate = useNavigate();
  const [tel, setTel] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await entrarPorTelefone({ telefone: tel });
      navigate(`/painel/${res.magic_token}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell max="sm">
      <h1 className="text-3xl text-primary mb-2">Acessar seu painel</h1>
      <p className="text-muted-foreground mb-8">Digite seu WhatsApp para abrir seu painel pessoal.</p>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="tel">WhatsApp</Label>
          <Input id="tel" inputMode="tel" placeholder="(11) 90000-0000" value={tel} onChange={(e) => setTel(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Abrindo..." : "Abrir painel"}
        </Button>
      </form>
    </PageShell>
  );
}
