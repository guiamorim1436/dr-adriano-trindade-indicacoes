import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listarIndicadores, premiarIndicador } from "@/lib/api";
import { formatPhoneBR } from "@/lib/phone";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Gift } from "lucide-react";

export default function AdminIndicadores() {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["indicadores"], queryFn: listarIndicadores });
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const mutation = useMutation({
    mutationFn: premiarIndicador,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["indicadores"] });
      toast.success("Prêmio registrado e pontos descontados!");
      setSelectedIndicador(null);
    },
    onError: (error) => {
      toast.error("Erro ao premiar: " + error.message);
    }
  });

  const [selectedIndicador, setSelectedIndicador] = useState<any>(null);
  const [pontos, setPontos] = useState("1");
  const [comentario, setComentario] = useState("");

  const handlePremiar = () => {
    if (!selectedIndicador) return;
    mutation.mutate({
      indicador_id: selectedIndicador.id,
      pontos: parseInt(pontos),
      comentario
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl text-primary font-bold">Indicadores</h1>
      
      <div className="rounded-2xl border border-border/60 bg-card overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead className="text-left text-muted-foreground border-b bg-muted/50">
            <tr>
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium text-center">Saldo</th>
              <th className="p-4 font-medium text-center">Convertidos</th>
              <th className="p-4 font-medium">Link / Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(data ?? []).map((i) => {
              const saldo = i.convertidos - (i.pontos_consumidos || 0);
              return (
                <tr key={i.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-foreground">{i.nome}</div>
                    <div className="text-xs text-muted-foreground">{formatPhoneBR(i.telefone)}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${saldo > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {saldo} pt
                    </span>
                  </td>
                  <td className="p-4 text-center text-muted-foreground">
                    {i.convertidos}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <a className="text-accent hover:underline text-xs" href={`${origin}/r/${i.codigo_indicacao}`} target="_blank" rel="noreferrer">
                        /r/{i.codigo_indicacao}
                      </a>
                      
                      <Dialog open={selectedIndicador?.id === i.id} onOpenChange={(open) => !open && setSelectedIndicador(null)}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="default" 
                            size="sm" 
                            disabled={saldo <= 0}
                            onClick={() => {
                              setSelectedIndicador(i);
                              setPontos("1");
                              setComentario("");
                            }}
                            className="h-8 gap-2"
                          >
                            <Gift className="w-4 h-4" />
                            Premiar
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Premiar {i.nome}</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="pontos">Pontos a descontar (Saldo: {saldo})</Label>
                              <Input 
                                id="pontos" 
                                type="number" 
                                min="1" 
                                max={saldo}
                                value={pontos} 
                                onChange={(e) => setPontos(e.target.value)} 
                              />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="comentario">O que ele ganhou?</Label>
                              <Textarea 
                                id="comentario" 
                                placeholder="Ex: Limpeza de pele, Desconto de 10%..." 
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedIndicador(null)}>Cancelar</Button>
                            <Button 
                              onClick={handlePremiar} 
                              disabled={mutation.isPending || !pontos || parseInt(pontos) <= 0 || parseInt(pontos) > saldo}
                            >
                              {mutation.isPending ? "Salvando..." : "Confirmar Prêmio"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {(data ?? []).length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <p className="text-sm">Nenhum indicador registrado.</p>
          </div>
        )}
      </div>
      
      <div className="bg-muted/30 p-4 rounded-xl text-xs text-muted-foreground border border-dashed border-border">
        <strong>Regra:</strong> Cada indicado convertido dá 1 ponto. O saldo é atualizado automaticamente ao registrar prêmios.
      </div>
    </div>
  );
}
