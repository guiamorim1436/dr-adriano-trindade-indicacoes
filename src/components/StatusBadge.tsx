const STATUS_LABEL: Record<string, string> = {
  recebido: "Recebido",
  em_contato: "Em contato",
  compareceu: "Compareceu",
  convertido: "Convertido",
  encerrado: "Encerrado",
};
const STATUS_CLASS: Record<string, string> = {
  recebido: "bg-secondary text-secondary-foreground",
  em_contato: "bg-accent/15 text-accent",
  compareceu: "bg-accent/25 text-primary",
  convertido: "bg-primary text-primary-foreground",
  encerrado: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[status] ?? "bg-muted"}`}>
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
