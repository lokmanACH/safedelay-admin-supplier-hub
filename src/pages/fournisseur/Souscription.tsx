import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AppLayout } from "@/components/layout/AppLayout";
import { Stepper } from "@/components/shared/Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, CreditCard, CheckCircle2 } from "lucide-react";
import { formatXOF } from "@/lib/format";
import { toast } from "sonner";

const STEPS = ["Compte", "Entreprise", "Activités", "Risque", "Simulation", "Validation"];

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  raisonSociale: z.string().min(2, "Champ requis"),
  nif: z.string().min(3, "Champ requis"),
  rc: z.string().min(3, "Champ requis"),
  adresse: z.string().min(5, "Champ requis"),
  telephone: z.string().min(6, "Téléphone invalide"),
  emailPro: z.string().email("Email invalide"),
  numeroPolice: z.string().optional(),
  chiffreAffaires: z.number({ invalid_type_error: "Nombre requis" }).min(0, "Doit être positif"),
  delaisHabituels: z.string().min(1, "Champ requis"),
  zonesApprovisionnement: z.string().min(2, "Champ requis"),
  historiqueRetards: z.string().min(2, "Champ requis"),
  historiqueSinistres: z.string().min(2, "Champ requis"),
  causesFrequentes: z.string().min(2, "Champ requis"),
  contratsPenalites: z.string().min(2, "Champ requis"),
  incidentsDouaniers: z.string().min(2, "Champ requis"),
});
type FormData = z.infer<typeof schema>;

export default function Souscription() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "", password: "", raisonSociale: "", nif: "", rc: "", adresse: "",
      telephone: "", emailPro: "", numeroPolice: "", chiffreAffaires: 0,
      delaisHabituels: "", zonesApprovisionnement: "", historiqueRetards: "",
      historiqueSinistres: "", causesFrequentes: "", contratsPenalites: "",
      incidentsDouaniers: "",
    },
  });

  const STEP_FIELDS: (keyof FormData)[][] = [
    ["email", "password"],
    ["raisonSociale", "nif", "rc", "adresse", "telephone", "emailPro"],
    ["chiffreAffaires", "delaisHabituels", "zonesApprovisionnement"],
    ["historiqueRetards", "historiqueSinistres", "causesFrequentes", "contratsPenalites", "incidentsDouaniers"],
    [], [],
  ];

  const next = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (!valid) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const ca = form.watch("chiffreAffaires") || 0;
  const prime = Math.round(ca * 0.0035);

  const onSubmit = () => {
    toast.success("Souscription envoyée avec succès !");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <AppLayout space="fournisseur" title="Souscription">
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardContent className="pt-12 pb-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Demande envoyée !</h2>
            <p className="mt-2 text-sm text-muted-foreground">Votre dossier est en cours d'examen par nos équipes. Vous recevrez une réponse sous 48h.</p>
            <Button className="mt-6" onClick={() => { setSubmitted(false); setStep(0); form.reset(); }}>Nouvelle souscription</Button>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      space="fournisseur"
      title="Nouvelle souscription"
      subtitle="Complétez les étapes pour évaluer et activer votre couverture"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Souscription" }]}
    >
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <Stepper steps={STEPS} current={step} />
        </CardContent>
      </Card>

      <Card className="mt-6 shadow-card">
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            {step === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email"><Input {...form.register("email")} placeholder="vous@entreprise.sn" /><Err msg={form.formState.errors.email?.message} /></Field>
                <Field label="Mot de passe"><Input type="password" {...form.register("password")} /><Err msg={form.formState.errors.password?.message} /></Field>
              </div>
            )}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Raison sociale"><Input {...form.register("raisonSociale")} /><Err msg={form.formState.errors.raisonSociale?.message} /></Field>
                <Field label="NIF"><Input {...form.register("nif")} /><Err msg={form.formState.errors.nif?.message} /></Field>
                <Field label="Numéro RC"><Input {...form.register("rc")} /><Err msg={form.formState.errors.rc?.message} /></Field>
                <Field label="N° de police (si existant)"><Input {...form.register("numeroPolice")} /></Field>
                <Field label="Adresse complète" full><Input {...form.register("adresse")} /><Err msg={form.formState.errors.adresse?.message} /></Field>
                <Field label="Téléphone professionnel"><Input {...form.register("telephone")} /><Err msg={form.formState.errors.telephone?.message} /></Field>
                <Field label="Email professionnel"><Input {...form.register("emailPro")} /><Err msg={form.formState.errors.emailPro?.message} /></Field>
              </div>
            )}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Chiffre d'affaires annuel estimé (XOF)"><Input type="number" {...form.register("chiffreAffaires", { valueAsNumber: true })} /><Err msg={form.formState.errors.chiffreAffaires?.message} /></Field>
                <Field label="Délais de livraison habituels"><Input {...form.register("delaisHabituels")} placeholder="ex: 15-30 jours" /><Err msg={form.formState.errors.delaisHabituels?.message} /></Field>
                <Field label="Zones d'approvisionnement" full><Input {...form.register("zonesApprovisionnement")} placeholder="ex: Europe, Asie, UEMOA" /><Err msg={form.formState.errors.zonesApprovisionnement?.message} /></Field>
              </div>
            )}
            {step === 3 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Historique de retards" full><Textarea rows={3} {...form.register("historiqueRetards")} /><Err msg={form.formState.errors.historiqueRetards?.message} /></Field>
                <Field label="Historique de sinistres" full><Textarea rows={3} {...form.register("historiqueSinistres")} /><Err msg={form.formState.errors.historiqueSinistres?.message} /></Field>
                <Field label="Causes fréquentes de retard"><Textarea rows={2} {...form.register("causesFrequentes")} /><Err msg={form.formState.errors.causesFrequentes?.message} /></Field>
                <Field label="Contrats avec pénalités"><Textarea rows={2} {...form.register("contratsPenalites")} /><Err msg={form.formState.errors.contratsPenalites?.message} /></Field>
                <Field label="Incidents douaniers" full><Textarea rows={2} {...form.register("incidentsDouaniers")} /><Err msg={form.formState.errors.incidentsDouaniers?.message} /></Field>
              </div>
            )}
            {step === 4 && (
              <div className="rounded-xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant">
                <Sparkles className="h-8 w-8 opacity-80" />
                <p className="mt-3 text-sm opacity-90">Estimation de votre prime annuelle</p>
                <p className="mt-1 text-4xl font-bold">{formatXOF(prime)}</p>
                <p className="mt-3 text-xs opacity-80">Calculée sur la base de votre CA, vos délais et votre exposition au risque. Tarif indicatif modifiable après audit.</p>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4 space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Entreprise :</span> {form.getValues("raisonSociale")}</p>
                  <p><span className="text-muted-foreground">Email :</span> {form.getValues("emailPro")}</p>
                  <p><span className="text-muted-foreground">CA estimé :</span> {formatXOF(ca)}</p>
                  <p><span className="text-muted-foreground">Prime annuelle :</span> <strong>{formatXOF(prime)}</strong></p>
                </div>
                <div className="rounded-lg border border-dashed border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium"><CreditCard className="h-4 w-4" /> Paiement (démo)</div>
                  <div className="mt-3 grid sm:grid-cols-2 gap-3">
                    <Input placeholder="Numéro de carte" />
                    <Input placeholder="MM / AA · CVC" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={prev} disabled={step === 0}>Retour</Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={next}>Continuer</Button>
              ) : (
                <Button type="submit">Confirmer la souscription</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </AppLayout>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
      <Label className="text-xs font-medium">{label}</Label>
      {children}
    </div>
  );
}
function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}