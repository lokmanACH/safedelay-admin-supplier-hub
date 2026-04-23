import { useRef, useState } from "react";
import { UploadCloud, FileText, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export interface UploadedFile {
  id: string;
  name: string;
  size: number; // bytes
  type: string;
  progress: number;
}

interface Props {
  accept?: string[]; // ["pdf","jpg","jpeg","png"]
  maxSizeMb?: number;
  maxFiles?: number;
  onFilesChange?: (files: UploadedFile[]) => void;
}

const formatSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`;

export function FileUploadMock({
  accept = ["pdf", "jpg", "jpeg", "png"],
  maxSizeMb = 10,
  maxFiles = 15,
  onFilesChange,
}: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (incoming: File[]) => {
    setError(null);
    if (files.length + incoming.length > maxFiles) {
      setError(`Maximum ${maxFiles} fichiers autorisés`);
      return;
    }
    const next: UploadedFile[] = [];
    for (const f of incoming) {
      const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
      if (!accept.includes(ext)) {
        setError(`Format non supporté : .${ext}. Acceptés : ${accept.join(", ").toUpperCase()}`);
        return;
      }
      if (f.size > maxSizeMb * 1024 * 1024) {
        setError(`Fichier "${f.name}" trop volumineux (max ${maxSizeMb} Mo)`);
        return;
      }
      next.push({ id: `${Date.now()}-${f.name}`, name: f.name, size: f.size, type: f.type, progress: 0 });
    }
    const merged = [...files, ...next];
    setFiles(merged);
    onFilesChange?.(merged);
    // simulate upload progress
    next.forEach((file) => {
      let p = 0;
      const t = window.setInterval(() => {
        p += 25;
        setFiles((curr) => {
          const updated = curr.map((c) => c.id === file.id ? { ...c, progress: Math.min(p, 100) } : c);
          onFilesChange?.(updated);
          return updated;
        });
        if (p >= 100) window.clearInterval(t);
      }, 200);
    });
    toast.success(`${next.length} fichier(s) ajouté(s)`);
  };

  const fakeAdd = () => {
    const samples: { name: string; size: number; type: string }[] = [
      { name: "Bon_de_commande.pdf", size: 1.4 * 1024 * 1024, type: "application/pdf" },
      { name: "Contrat_commercial.pdf", size: 320 * 1024, type: "application/pdf" },
      { name: "Preuve_retard.jpg", size: 2.1 * 1024 * 1024, type: "image/jpeg" },
      { name: "Attestation_cause.pdf", size: 540 * 1024, type: "application/pdf" },
    ];
    const sample = samples[files.length % samples.length];
    addFiles([new File([new Blob()], sample.name, { type: sample.type })] as unknown as File[]);
    // Note: File constructor produces 0-byte blob; override size for display
    setFiles((curr) => {
      const updated = curr.map((c, i) => i === curr.length - 1 ? { ...c, size: sample.size } : c);
      onFilesChange?.(updated);
      return updated;
    });
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const remove = (id: string) => {
    const next = files.filter((f) => f.id !== id);
    setFiles(next);
    onFilesChange?.(next);
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); addFiles(Array.from(e.dataTransfer.files)); }}
        className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-8 text-center"
      >
        <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
        <p className="mt-2 text-sm font-medium text-foreground">Glissez vos fichiers ici</p>
        <p className="text-xs text-muted-foreground">
          Formats : {accept.join(", ").toUpperCase()} · {maxSizeMb} Mo max · {maxFiles} fichiers max
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button type="button" size="sm" variant="outline" onClick={() => inputRef.current?.click()}>
            Parcourir mes fichiers
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={fakeAdd}>
            + Ajouter un exemple
          </Button>
        </div>
        <input ref={inputRef} type="file" multiple hidden accept={accept.map((a) => `.${a}`).join(",")} onChange={onPick} />
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((f) => (
            <li key={f.id} className="rounded-lg border border-border bg-card px-3 py-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm truncate">{f.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">· {formatSize(f.size)}</span>
                  {f.progress >= 100 && <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />}
                </div>
                <Button type="button" size="icon" variant="ghost" onClick={() => remove(f.id)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {f.progress < 100 && <Progress value={f.progress} className="h-1 mt-2" />}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-muted-foreground">{files.length} / {maxFiles} fichiers</p>
    </div>
  );
}