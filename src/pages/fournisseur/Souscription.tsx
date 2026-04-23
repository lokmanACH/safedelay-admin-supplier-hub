import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, CreditCard, CheckCircle2, Save, Download, Mail, FileSignature, ShieldCheck } from "lucide-react";
import { formatXOF } from "@/lib/format";
import { toast } from "sonner";

const STEPS = [
  "Compte",
  "Entreprise",
  "Activités",
  "Risque",
  "Simulation",
  "Validation & paiement",
];

const schema = z.object({
  // Step 1
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  passwordConfirm: z.string().min(8, "8 caractères minimum"),
  // Step 2
  raisonSociale: z.string().min(2, "Champ requis"),
  nif: z.string().min(3, "Champ requis"),
  rc: z.string().min(3, "Champ requis"),
  adresse: z.string().min(5, "Champ requis"),
  telephone: z.string().min(6, "Téléphone invalide"),
  emailPro: z.string().email("Email invalide"),
  // Step 3
  typeActivite: z.string().min(2, "Champ requis"),
  produits: z.string().min(2, "Champ requis"),
  delaisHabituels: z.string().min(1, "Champ requis"),
  zonesApprovisionnement: z.string().min(2, "Champ requis"),
  chiffreAffaires: z.number({ message: "Nombre requis" }).min(0, "Doit être positif"),
  // Step 4
  retards12mois: z.number({ message: "Nombre requis" }).min(0).max(100),
  dureeMoyenneRetard: z.number({ message: "Nombre requis" }).min(0),
  historiqueSinistres: z.string().min(2, "Champ requis"),
  causesFrequentes: z.string().min(2, "Champ requis"),
  contratsPenalites: z.enum(["oui", "non"]),
  montantMoyenPenalite: z.number({ message: "Nombre requis" }).min(0),
  incidentsDouaniers: z.string().min(2, "Champ requis"),
  // Step 6
  consentement: z.boolean().refine((v) => v === true, "Vous devez accepter les conditions"),
  signature: z.string().min(2, "Signature requise"),
}).refine((d) => d.password === d.passwordConfirm, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirm"],
});

type FormData = z.infer<typeof schema>;

const DRAFT_KEY = "safedelay_souscription_draft";

export default function Souscription() {
  const nav = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [contractRef, setContractRef] = useState<string | null>(null);
  const [draftSavedAt, setDraftSavedAt] = useState<Date | null>(null);
  const [emailVerifie, setEmailVerifie] = useState(false);
  const [paying, setPaying] = useState(false);
  const draftTimer = useRef<number | null>(null);

  const initial: FormData = {
    email: "", password: "", passwordConfirm: "",
    raisonSociale: "", nif: "", rc: "", adresse: "", telephone: "", emailPro: "",
    typeActivite: "", produits: "", delaisHabituels: "", zonesApprovisionnement: "",
    chiffreAffaires: 0,
    retards12mois: 0, dureeMoyenneRetard: 0,
    historiqueSinistres: "", causesFrequentes: "",
    contratsPenalites: "non", montantMoyenPenalite: 0,
    incidentsDouaniers: "",
    consentement: false, signature: "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: initial,
  });

  // Load draft
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        form.reset({ ...initial, ...d.values });
        if (typeof d.step === "number") setStep(d.step);
        toast.message("Brouillon restauré", { description: "Reprenez où vous vous étiez arrêté." });
      }
    } catch { /* noop */ }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save on changes
  const watched = form.watch();
  useEffect(() => {
    if (draftTimer.current) window.clearTimeout(draftTimer.current);
    draftTimer.current = window.setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: watched, step }));
      setDraftSavedAt(new Date());
    }, 600);
    return () => { if (draftTimer.current) window.clearTimeout(draftTimer.current); };
  }, [watched, step]);

  const STEP_FIELDS: (keyof FormData)[][] = [
    ["email", "password", "passwordConfirm"],
    ["raisonSociale", "nif", "rc", "adresse", "telephone", "emailPro"],
    ["typeActivite", "produits", "delaisHabituels", "zonesApprovisionnement", "chiffreAffaires"],
    ["retards12mois", "dureeMoyenneRetard", "historiqueSinistres", "causesFrequentes", "contratsPenalites", "montantMoyenPenalite", "incidentsDouaniers"],
    [],
    ["consentement", "signature"],
  ];

  const next = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (!valid) { toast.error("Veuillez corriger les erreurs avant de continuer"); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  // Premium calculation
  const ca = form.watch("chiffreAffaires") || 0;
  const retards = form.watch("retards12mois") || 0;
  const tauxBase = 0.0035;
  const baseAmount = Math.round(ca * tauxBase);
  const surchargeRate = retards > 15 ? 0.25 : retards > 8 ? 0.15 : retards > 3 ? 0.08 : 0;
  const surcharge = Math.round(baseAmount * surchargeRate);
  const franchise = 250000;
  const prime = baseAmount + surcharge;

  const sendVerification = () => {
    toast.success("Email de vérification envoyé", { description: form.getValues("email") });
    setTimeout(() => setEmailVerifie(true), 1200);
  };

  const onSubmit = (values: FormData) => {
    if (!emailVerifie) { toast.error("Veuillez vérifier votre email avant de finaliser"); setStep(0); return; }
    setPaying(true);
    setTimeout(() => {
      const ref = `CTR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
      setContractRef(ref);
      setSubmitted(true);
      setPaying(false);
      localStorage.removeItem(DRAFT_KEY);
      toast.success("Souscription confirmée", { description: `Contrat ${ref} généré` });
      // Use values to avoid TS unused param warning
      void values;
    }, 1200);
  };

  const saveDraftManually = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: form.getValues(), step }));
    setDraftSavedAt(new Date());
    toast.success("Brouillon enregistré");
  };

  const draftLabel = useMemo(() => {
    if (!draftSavedAt) return "Brouillon non enregistré";
    return `Brouillon enregistré · ${draftSavedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
  }, [draftSavedAt]);

  if (submitted && contractRef) {
    return (
      <AppLayout space="fournisseur" title="Souscription confirmée">
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardContent className="pt-12 pb-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="mt-4 text-xl font-semibold">Votre couverture est active</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
              Paiement validé. Votre contrat a été généré et un email de confirmation vous a été envoyé.
            </p>

            <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-left text-sm space-y-2">
              <div className="flex justify-between"><span className="text-muted-foreground">Référence contrat</span><strong>{contractRef}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Prime annuelle</span><strong>{formatXOF(prime)}</strong></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email de confirmation</span><span className="inline-flex items-center gap-1 text-success"><Mail className="h-3.5 w-3.5" />envoyé</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Validation admin</span><span className="text-warning">en attente</span></div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Button onClick={() => toast.success("Contrat téléchargé (démo)")}><Download className="h-4 w-4 mr-2" />Télécharger le contrat PDF</Button>
              <Button variant="outline" onClick={() => nav("/fournisseur/contrats")}>Voir mes contrats</Button>
              <Button variant="ghost" onClick={() => nav("/fournisseur/dashboard")}>Tableau de bord</Button>
            </div>
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
      actions={
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:inline">{draftLabel}</span>
          <Button variant="outline" size="sm" onClick={saveDraftManually}><Save className="h-3.5 w-3.5 mr-1" />Enregistrer</Button>
        </div>
      }
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Email" full><Input {...form.register("email")} placeholder="vous@entreprise.sn" /><Err msg={form.formState.errors.email?.message} /></Field>
                <Field label="Mot de passe"><Input type="password" {...form.register("password")} /><Err msg={form.formState.errors.password?.message} /></Field>
                <Field label="Confirmation mot de passe"><Input type="password" {...form.register("passwordConfirm")} /><Err msg={form.formState.errors.passwordConfirm?.message} /></Field>
                <div className="sm:col-span-2 rounded-lg border border-border bg-muted/20 p-3 flex items-center justify-between">
                  <div className="text-sm">
                    <p className="font-medium">Vérification email</p>
                    <p className="text-xs text-muted-foreground">{emailVerifie ? "Email vérifié avec succès" : "Un lien de confirmation sera envoyé"}</p>
                  </div>
                  {emailVerifie ? (
                    <span className="inline-flex items-center gap-1 text-xs text-success"><CheckCircle2 className="h-4 w-4" />Vérifié</span>
                  ) : (
                    <Button type="button" size="sm" variant="outline" onClick={sendVerification}>Envoyer le lien</Button>
                  )}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Raison sociale"><Input {...form.register("raisonSociale")} /><Err msg={form.formState.errors.raisonSociale?.message} /></Field>
                <Field label="NIF"><Input {...form.register("nif")} /><Err msg={form.formState.errors.nif?.message} /></Field>
                <Field label="Numéro RC"><Input {...form.register("rc")} /><Err msg={form.formState.errors.rc?.message} /></Field>
                <Field label="Téléphone professionnel"><Input {...form.register("telephone")} placeholder="+221 ..." /><Err msg={form.formState.errors.telephone?.message} /></Field>
                <Field label="Adresse complète" full><Input {...form.register("adresse")} /><Err msg={form.formState.errors.adresse?.message} /></Field>
                <Field label="Email professionnel" full><Input {...form.register("emailPro")} placeholder="contact@entreprise.sn" /><Err msg={form.formState.errors.emailPro?.message} /></Field>
              </div>
            )}

            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Type d'activité">
                  <Select value={form.watch("typeActivite")} onValueChange={(v) => form.setValue("typeActivite", v, { shouldValidate: true })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distribution">Distribution / Grossiste</SelectItem>
                      <SelectItem value="importation">Importation</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="transport">Transport / Logistique</SelectItem>
                      <SelectItem value="industrie">Industrie / Production</SelectItem>
                    </SelectContent>
                  </Select>
                  <Err msg={form.formState.errors.typeActivite?.message} />
                </Field>
                <Field label="Délais de livraison habituels"><Input {...form.register("delaisHabituels")} placeholder="ex: 15-30 jours" /><Err msg={form.formState.errors.delaisHabituels?.message} /></Field>
                <Field label="Produits / catégories vendus" full><Textarea rows={2} {...form.register("produits")} placeholder="ex: Blé, riz, sucre..." /><Err msg={form.formState.errors.produits?.message} /></Field>
                <Field label="Zones d'approvisionnement" full><Input {...form.register("zonesApprovisionnement")} placeholder="ex: Europe, Asie, UEMOA" /><Err msg={form.formState.errors.zonesApprovisionnement?.message} /></Field>
                <Field label="Chiffre d'affaires annuel estimé (XOF)" full><Input type="number" {...form.register("chiffreAffaires", { valueAsNumber: true })} /><Err msg={form.formState.errors.chiffreAffaires?.message} /></Field>
              </div>
            )}

            {step === 3 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Retards sur 12 mois (% de commandes)"><Input type="number" min={0} max={100} {...form.register("retards12mois", { valueAsNumber: true })} /><Err msg={form.formState.errors.retards12mois?.message} /></Field>
                <Field label="Durée moyenne des retards (jours)"><Input type="number" min={0} {...form.register("dureeMoyenneRetard", { valueAsNumber: true })} /><Err msg={form.formState.errors.dureeMoyenneRetard?.message} /></Field>
                <Field label="Historique de sinistres" full><Textarea rows={2} {...form.register("historiqueSinistres")} placeholder="Détaillez les sinistres passés..." /><Err msg={form.formState.errors.historiqueSinistres?.message} /></Field>
                <Field label="Causes fréquentes de retard" full><Textarea rows={2} {...form.register("causesFrequentes")} /><Err msg={form.formState.errors.causesFrequentes?.message} /></Field>
                <Field label="Contrats avec pénalités de retard ?">
                  <Select value={form.watch("contratsPenalites")} onValueChange={(v) => form.setValue("contratsPenalites", v as "oui" | "non", { shouldValidate: true })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="non">Non</SelectItem>
                      <SelectItem value="oui">Oui</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Montant moyen des pénalités (XOF)"><Input type="number" min={0} {...form.register("montantMoyenPenalite", { valueAsNumber: true })} /><Err msg={form.formState.errors.montantMoyenPenalite?.message} /></Field>
                <Field label="Incidents douaniers (importateurs)" full><Textarea rows={2} {...form.register("incidentsDouaniers")} placeholder="Saisies, blocages, redressements..." /><Err msg={form.formState.errors.incidentsDouaniers?.message} /></Field>
              </div>
            )}

            {step === 4 && (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant">
                  <Sparkles className="h-8 w-8 opacity-80" />
                  <p className="mt-3 text-sm opacity-90">Estimation de votre prime annuelle</p>
                  <p className="mt-1 text-4xl font-bold">{formatXOF(prime)}</p>
                  <p className="mt-3 text-xs opacity-80">Tarif indicatif basé sur vos déclarations. Modifiable après audit.</p>
                </div>
                <Card className="shadow-soft">
                  <CardHeader><CardTitle className="text-base">Détail du calcul</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <Row label={`Taux de base (${(tauxBase * 100).toFixed(2)}% du CA)`} value={formatXOF(baseAmount)} />
                    <Row label={`Majoration risque (+${(surchargeRate * 100).toFixed(0)}%)`} value={formatXOF(surcharge)} />
                    <Row label="Franchise" value={formatXOF(franchise)} />
                    <Row label="Plafond garantie" value={formatXOF(prime * 20)} />
                    <div className="border-t border-border pt-2 mt-2 flex justify-between">
                      <span className="font-semibold">Total prime annuelle</span>
                      <span className="font-semibold text-primary">{formatXOF(prime)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-5">
                <Card className="shadow-soft">
                  <CardHeader><CardTitle className="text-base">Récapitulatif</CardTitle></CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-3 text-sm">
                    <Recap label="Entreprise" value={form.getValues("raisonSociale")} />
                    <Recap label="NIF" value={form.getValues("nif")} />
                    <Recap label="Email" value={form.getValues("emailPro")} />
                    <Recap label="Téléphone" value={form.getValues("telephone")} />
                    <Recap label="Activité" value={form.getValues("typeActivite")} />
                    <Recap label="Zones" value={form.getValues("zonesApprovisionnement")} />
                    <Recap label="CA estimé" value={formatXOF(ca)} />
                    <Recap label="Délais habituels" value={form.getValues("delaisHabituels")} />
                    <Recap label="Prime annuelle" value={formatXOF(prime)} highlight />
                    <Recap label="Franchise" value={formatXOF(franchise)} />
                  </CardContent>
                </Card>

                <Card className="shadow-soft">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><FileSignature className="h-4 w-4" />Consentement & signature</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <label className="flex items-start gap-3 text-sm">
                      <Checkbox
                        checked={form.watch("consentement")}
                        onCheckedChange={(v) => form.setValue("consentement", Boolean(v), { shouldValidate: true })}
                      />
                      <span>Je certifie l'exactitude des informations fournies et accepte les <a className="text-primary underline" href="#">conditions générales</a> de SafeDelay.</span>
                    </label>
                    <Err msg={form.formState.errors.consentement?.message} />
                    <Field label="Signature électronique (saisissez votre nom complet)">
                      <Input {...form.register("signature")} placeholder="ex: Aïssatou Diop" className="font-serif italic" />
                      <Err msg={form.formState.errors.signature?.message} />
                    </Field>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-primary/30">
                  <CardHeader><CardTitle className="text-base flex items-center gap-2"><CreditCard className="h-4 w-4" />Paiement de la prime</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="rounded-lg bg-muted/30 p-3 flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Montant à régler</span>
                      <span className="text-lg font-semibold text-primary">{formatXOF(prime)}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input placeholder="Numéro de carte" defaultValue="4242 4242 4242 4242" />
                      <Input placeholder="MM / AA · CVC" defaultValue="12 / 28 · 123" />
                    </div>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5" />Paiement sécurisé · démo, aucune transaction réelle</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={prev} disabled={step === 0}>Retour</Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={next}>Continuer</Button>
              ) : (
                <Button type="submit" disabled={paying}>
                  {paying ? "Traitement du paiement..." : `Payer ${formatXOF(prime)} et confirmer`}
                </Button>
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
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
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