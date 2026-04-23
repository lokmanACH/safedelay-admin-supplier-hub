import { useState } from "react";
import { UploadCloud, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileUploadMock({ accept = "PDF, JPG, PNG", maxSizeMb = 10 }: { accept?: string; maxSizeMb?: number }) {
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);

  const fakeAdd = () => {
    const samples = [
      { name: "Bon_de_livraison.pdf", size: "1.4 Mo" },
      { name: "Facture_pénalité.pdf", size: "320 Ko" },
      { name: "Photo_marchandise.jpg", size: "2.1 Mo" },
    ];
    setFiles((f) => [...f, samples[f.length % samples.length]]);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center">
        <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-foreground">Glissez vos fichiers ici</p>
        <p className="text-xs text-muted-foreground">Formats acceptés : {accept} · {maxSizeMb} Mo max</p>
        <Button type="button" size="sm" variant="outline" className="mt-4" onClick={fakeAdd}>
          Parcourir mes fichiers
        </Button>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="text-sm">{f.name}</span>
                <span className="text-xs text-muted-foreground">· {f.size}</span>
              </div>
              <Button type="button" size="icon" variant="ghost" onClick={() => setFiles(files.filter((_, x) => x !== i))}>
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}