import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUploadMock, type UploadedFile } from "@/components/shared/FileUploadMock";
import { Stepper } from "@/components/shared/Stepper";
import { contracts } from "@/data/mock";
import { CheckCircle2, AlertCircle, FileSignature } from "lucide-react";
import { toast } from "sonner";
import { formatXOF } from "@/lib/format";

const STEPS = ["Formulaire", "Documents", "Récapitulatif", "Confirmation"];

const DOC_REQUIREMENTS: { label: string; level: "obligatoire" | "recommandé" | "optionnel" }[] = [
  { label: "Bon de commande client", level: "obligatoire" },
  { label: "Contrat ou accord commercial", level: "obligatoire" },
  { label: "Preuve du retard", level: "obligatoire" },
  { label: "Attestation de la cause (port, douane, transporteur)", level: "recommandé" },
  { label: "Tout autre document probant", level: "optionnel" },
];

const MIN_DELAY_DAYS = 2;          // business rule
const MAX_DECLARATION_DAYS = 30;   // business rule

export default function SinistreNouveau() {
  const nav = useNavigate();
  const myActiveContracts = contracts.filter((c) => c.fournisseurId === "SUP-001" && c.statut === "Actif");

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdRef, setCreatedRef] = useState<string | null>(null);

  // Form state
  const today = new Date().toISOString().slice(0, 10);
  const [contratId, setContratId] = useState("");
  const [commande, setCommande] = useState("");
  const [client, setClient] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [datePrevue, setDatePrevue] = useState("");
  const [dateReelle, setDateReelle] = useState("");
  const [cause, setCause] = useState("");
  const [description, setDescription] = useState("");
  const [valeurCommande, setValeurCommande] = useState<number>(0);
  const [penalites, setPenalites] = useState<number>(0);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [consentement, setConsentement] = useState(false);
  const [signature, setSignature] = useState("");

  const contrat = myActiveContracts.find((c) => c.id === contratId);

  const dureeRetard = useMemo(() => {
    if (!datePrevue || !dateReelle) return 0;
    const a = new Date(datePrevue).getTime();
    const b = new Date(dateReelle).getTime();
    if (isNaN(a) || isNaN(b)) return 0;
    return Math.max(0, Math.round((b - a) / 86400000));
  }, [datePrevue, dateReelle]);

  const joursDepuisRetard = useMemo(() => {
    if (!dateReelle) return 0;
    return Math.round((Date.now() - new Date(dateReelle).getTime()) / 86400000);
  }, [dateReelle]);

  const errors = useMemo(() => {
    const errs: string[] = [];
    if (step === 0) {
      if (!contratId) errs.push("Sélectionnez un contrat actif");
      if (!commande.trim()) errs.push("Numéro de commande requis");
      if (!client.trim()) errs.push("Client concerné requis");
      if (!clientContact.trim()) errs.push("Téléphone ou email du client requis");
      if (!datePrevue || !dateReelle) errs.push("Dates de livraison requises");
      else {
        if (dureeRetard < MIN_DELAY_DAYS) errs.push(`Le retard doit être supérieur ou égal à ${MIN_DELAY_DAYS} jours`);
        if (joursDepuisRetard > MAX_DECLARATION_DAYS) errs.push(`Délai dépassé : un sinistre doit être déclaré sous ${MAX_DECLARATION_DAYS} jours`);
      }
      if (!cause) errs.push("Cause du retard requise");
      if (!description.trim() || description.trim().length < 10) errs.push("Description détaillée (min 10 caractères)");
      if (valeurCommande <= 0) errs.push("Valeur de commande requise");
      if (penalites < 0) errs.push("Pénalités invalides");
    }
    if (step === 1) {
      if (files.length < 3) errs.push("Au moins 3 documents obligatoires sont requis");
    }
    if (step === 2) {
      if (!consentement) errs.push("Veuillez accepter la déclaration sur l'honneur");
      if (signature.trim().length < 2) errs.push("Signature électronique requise");
    }
    return errs;
  }, [step, contratId, commande, client, clientContact, datePrevue, dateReelle, dureeRetard, joursDepuisRetard, cause, description, valeurCommande, penalites, files.length, consentement, signature]);

  const next = () => {
    if (errors.length > 0) { toast.error(errors[0]); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (errors.length > 0) { toast.error(errors[0]); return; }
    setSubmitting(true);
    setTimeout(() => {
      const ref = `SIN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      setCreatedRef(ref);
      setSubmitted(true);
      setSubmitting(false);
      toast.success("Sinistre déclaré avec succès");
    }, 700);
  };

  if (submitted && createdRef) {
    return (
      <AppLayout space="fournisseur" title="Sinistre soumis">
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardContent className="pt-12 pb-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Déclaration reçue</h2>
            <p className="mt-2 text-sm text-muted-foreground">Votre dossier <strong>{createdRef}</strong> a été transmis aux équipes SafeDelay. Vous serez notifié à chaque étape.</p>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Button onClick={() => nav("/fournisseur/sinistres")}>Voir mes sinistres</Button>
              <Button variant="outline" onClick={() => nav(`/fournisseur/sinistres/CLM-006`)}>Suivre ce dossier (démo)</Button>
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      space="fournisseur"
      title="Déclarer un sinistre"
      subtitle="Renseignez les détails du retard pour ouvrir un dossier"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Sinistres", to: "/fournisseur/sinistres" }, { label: "Nouveau" }]}
    >
      {myActiveContracts.length === 0 && (
        <Card className="shadow-soft border-warning/40 bg-warning/5 mb-4">
          <CardContent className="p-4 text-sm flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div>
              <p className="font-medium">Aucun contrat actif</p>
              <p className="text-muted-foreground">Vous devez disposer d'un contrat actif pour déclarer un sinistre.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-soft">
        <CardContent className="p-6"><Stepper steps={STEPS} current={step} /></CardContent>
      </Card>

      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          {step === 0 && (
            <>
              <Card className="shadow-soft">
                <CardHeader><CardTitle className="text-base">1. Informations générales</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <Field label="Contrat RC concerné">
                    <Select value={contratId} onValueChange={setContratId}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner un contrat actif..." /></SelectTrigger>
                      <SelectContent>
                        {myActiveContracts.map((c) => <SelectItem key={c.id} value={c.id}>{c.reference}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Date de déclaration">
                    <Input type="date" value={today} disabled />
                  </Field>
                  <Field label="Numéro de commande">
                    <Input value={commande} onChange={(e) => setCommande(e.target.value)} placeholder="CMD-..." />
                  </Field>
                  <Field label="Client concerné">
                    <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Raison sociale du client" />
                  </Field>
                  <Field label="Téléphone ou email du client" full>
                    <Input value={clientContact} onChange={(e) => setClientContact(e.target.value)} placeholder="+221 ... ou client@..." />
                  </Field>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader><CardTitle className="text-base">2. Détails du retard</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Date contractuelle prévue">
                      <Input type="date" value={datePrevue} onChange={(e) => setDatePrevue(e.target.value)} />
                    </Field>
                    <Field label="Date réelle de livraison">
                      <Input type="date" value={dateReelle} onChange={(e) => setDateReelle(e.target.value)} />
                    </Field>
                    <Field label="Durée du retard (auto)">
                      <Input value={`${dureeRetard} jour(s)`} disabled />
                    </Field>
                  </div>
                  <Field label="Cause principale du retard">
                    <Select value={cause} onValueChange={setCause}>
                      <SelectTrigger><SelectValue placeholder="Choisir une cause" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retard portuaire">Retard portuaire</SelectItem>
                        <SelectItem value="Blocage douanier">Blocage douanier</SelectItem>
                        <SelectItem value="Panne transporteur">Panne / incident transporteur</SelectItem>
                        <SelectItem value="Conditions météo">Conditions météo</SelectItem>
                        <SelectItem value="Retard fournisseur amont">Retard fournisseur amont</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Description détaillée de la cause">
                    <Textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez les circonstances du retard..." />
                  </Field>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardHeader><CardTitle className="text-base">3. Impact financier</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-4">
                  <Field label="Valeur totale de la commande (XOF)">
                    <Input type="number" min={0} value={valeurCommande || ""} onChange={(e) => setValeurCommande(Number(e.target.value))} />
                  </Field>
                  <Field label="Pénalités contractuelles subies (XOF)">
                    <Input type="number" min={0} value={penalites || ""} onChange={(e) => setPenalites(Number(e.target.value))} />
                  </Field>
                </CardContent>
              </Card>
            </>
          )}

          {step === 1 && (
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Documents justificatifs</CardTitle></CardHeader>
              <CardContent>
                <FileUploadMock onFilesChange={setFiles} accept={["pdf", "jpg", "jpeg", "png"]} maxSizeMb={10} maxFiles={15} />
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Récapitulatif</CardTitle></CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Recap label="Contrat" value={contrat?.reference ?? "—"} />
                  <Recap label="Commande" value={commande} />
                  <Recap label="Client" value={client} />
                  <Recap label="Contact client" value={clientContact} />
                  <Recap label="Date prévue" value={datePrevue} />
                  <Recap label="Date réelle" value={dateReelle} />
                  <Recap label="Durée du retard" value={`${dureeRetard} jour(s)`} />
                  <Recap label="Cause" value={cause} />
                  <Recap label="Valeur commande" value={formatXOF(valeurCommande)} />
                  <Recap label="Pénalités" value={formatXOF(penalites)} highlight />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="rounded-lg bg-muted/30 p-3">{description}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{files.length} document(s) joint(s)</p>
                  <ul className="text-xs space-y-1">
                    {files.map((f) => <li key={f.id}>· {f.name}</li>)}
                  </ul>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <label className="flex items-start gap-3">
                    <Checkbox checked={consentement} onCheckedChange={(v) => setConsentement(Boolean(v))} />
                    <span className="text-sm">Je déclare sur l'honneur que les informations fournies sont exactes. Toute déclaration frauduleuse entraîne la résiliation du contrat.</span>
                  </label>
                  <Field label="Signature électronique">
                    <Input value={signature} onChange={(e) => setSignature(e.target.value)} placeholder="Saisissez votre nom complet" className="font-serif italic" />
                  </Field>
                </div>
              </CardContent>
            </Card>
          )}

          {errors.length > 0 && step < STEPS.length - 1 && (
            <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <ul className="space-y-0.5">
                {errors.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={prev} disabled={step === 0}>Retour</Button>
            {step < STEPS.length - 2 ? (
              <Button type="button" onClick={next}>Continuer</Button>
            ) : step === STEPS.length - 2 ? (
              <Button type="submit" disabled={submitting || errors.length > 0}>
                <FileSignature className="h-4 w-4 mr-2" />
                {submitting ? "Envoi..." : "Signer et soumettre"}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Documents requis</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {DOC_REQUIREMENTS.map((d) => (
                <div key={d.label} className="flex items-start gap-2">
                  <CheckCircle2 className={`mt-0.5 h-4 w-4 shrink-0 ${
                    d.level === "obligatoire" ? "text-destructive" : d.level === "recommandé" ? "text-warning" : "text-muted-foreground"
                  }`} />
                  <div className="flex-1">
                    <p>{d.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{d.level}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Règles de dépôt</CardTitle></CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-1">
              <p>· Formats : PDF, JPG, JPEG, PNG</p>
              <p>· 10 Mo max par fichier</p>
              <p>· 15 fichiers max par sinistre</p>
              <p>· Retard minimum {MIN_DELAY_DAYS} jours</p>
              <p>· Déclaration sous {MAX_DECLARATION_DAYS} jours après l'incident</p>
              <p>· Un seul sinistre actif par commande</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-warning/40 bg-warning/5">
            <CardContent className="p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-warning shrink-0" />
              <p className="text-xs text-foreground">Toute déclaration frauduleuse entraîne la résiliation du contrat. Vérifiez vos informations avant soumission.</p>
            </CardContent>
          </Card>
        </div>
      </form>
    </AppLayout>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
function Recap({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={highlight ? "font-semibold text-primary" : "font-medium"}>{value || "—"}</p>
    </div>
  );
}