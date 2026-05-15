import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Stepper } from "@/components/shared/Stepper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, CreditCard, CheckCircle2, Download, Mail,
  FileSignature, ShieldCheck, Building2, ActivitySquare,
  AlertTriangle, BarChart3, Lock, ChevronRight, Home,
  Clock, User
} from "lucide-react";
import { formatXOF } from "@/lib/format";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Compte", icon: User },
  { label: "Entreprise", icon: Building2 },
  { label: "Activités", icon: ActivitySquare },
  { label: "Risque", icon: AlertTriangle },
  { label: "Simulation", icon: BarChart3 },
  { label: "Validation", icon: Lock },
];

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  passwordConfirm: z.string().min(8, "8 caractères minimum"),
  raisonSociale: z.string().min(2, "Champ requis"),
  nif: z.string().min(3, "Champ requis"),
  rc: z.string().min(3, "Champ requis"),
  adresse: z.string().min(5, "Champ requis"),
  telephone: z.string().min(6, "Téléphone invalide"),
  typeActivite: z.string().min(2, "Champ requis"),
  produits: z.string().min(2, "Champ requis"),
  delaisHabituels: z.string().min(1, "Champ requis"),
  zonesApprovisionnement: z.string().min(2, "Champ requis"),
  chiffreAffaires: z.number({ message: "Nombre requis" }).min(0, "Doit être positif"),
  retards12mois: z.number({ message: "Nombre requis" }),
  dureeMoyenneRetard: z.number({ message: "Nombre requis" }).min(0),
  contratsPenalites: z.enum(["oui", "non"]),
  incidentsDouaniers: z.string().min(2, "Champ requis"),
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
    raisonSociale: "", nif: "", rc: "", adresse: "", telephone: "",
    typeActivite: "", produits: "", delaisHabituels: "", zonesApprovisionnement: "",
    chiffreAffaires: 0,
    retards12mois: 0, dureeMoyenneRetard: 0,
    contratsPenalites: "non",
    incidentsDouaniers: "",
    consentement: false, signature: "",
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: initial,
  });

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
  }, []);

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
    ["raisonSociale", "nif", "rc", "adresse", "telephone"],
    ["typeActivite", "produits", "delaisHabituels", "zonesApprovisionnement", "chiffreAffaires"],
    ["retards12mois", "dureeMoyenneRetard", "contratsPenalites", "incidentsDouaniers"],
    [],
    ["consentement", "signature"],
  ];

  const next = async () => {
    const valid = await form.trigger(STEP_FIELDS[step]);
    if (!valid) { toast.error("Veuillez corriger les erreurs avant de continuer"); return; }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const ca = form.watch("chiffreAffaires") || 0;
  const retards = form.watch("retards12mois") || 0;
  const tauxBase = 0.0035;
  const baseAmount = Math.round(ca * tauxBase);
  const surchargeRate = retards > 15 ? 0.25 : retards > 8 ? 0.15 : retards > 3 ? 0.08 : 0;
  const surcharge = Math.round(baseAmount * surchargeRate);
  const franchise = 250000;
  const prime = baseAmount + surcharge;

  const riskLevel = retards > 15 ? "Élevé" : retards > 8 ? "Modéré" : retards > 3 ? "Faible" : "Minimal";
  const riskColor = retards > 15 ? "destructive" : retards > 8 ? "warning" : "secondary";

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
      void values;
    }, 1200);
  };

  const saveDraftManually = () => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ values: form.getValues(), step }));
    setDraftSavedAt(new Date());
    toast.success("Brouillon enregistré");
  };

  const draftLabel = useMemo(() => {
    if (!draftSavedAt) return null;
    return draftSavedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  }, [draftSavedAt]);

  // ─── Success screen ────────────────────────────────────────────────
  if (submitted && contractRef) {
    return (
      <section className="max-w-2xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 ring-8 ring-success/5 mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Couverture activée</h1>
          <p className="mt-2 text-muted-foreground text-sm max-w-sm mx-auto">
            Paiement validé. Votre contrat a été généré et un email de confirmation vous a été envoyé.
          </p>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6 space-y-0">
            <SummaryRow label="Référence contrat" value={<span className="font-mono font-semibold text-sm">{contractRef}</span>} />
            <Separator />
            <SummaryRow label="Prime annuelle" value={<span className="font-semibold text-primary">{formatXOF(prime)}</span>} />
            <Separator />
            <SummaryRow
              label="Email de confirmation"
              value={<span className="inline-flex items-center gap-1.5 text-success text-sm"><Mail className="h-3.5 w-3.5" />Envoyé</span>}
            />
            <Separator />
            <SummaryRow
              label="Validation administrative"
              value={<Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50">En attente</Badge>}
            />
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Button size="lg" onClick={() => toast.success("Contrat téléchargé (démo)")}>
            <Download className="h-4 w-4 mr-2" />Télécharger le contrat PDF
          </Button>
          <Button size="lg" variant="outline" onClick={() => nav("/fournisseur/contrats")}>
            Voir mes contrats
          </Button>
          <Button size="lg" variant="ghost" onClick={() => nav("/fournisseur/dashboard")}>
            Tableau de bord
          </Button>
        </div>
      </section>
    );
  }

  // ─── Main form ─────────────────────────────────────────────────────
  const StepIcon = STEPS[step].icon;

  return (
    <section className="max-w-5xl mx-auto py-6 px-4 space-y-5">

        {/* Return  */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm transition">
          <div className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition" onClick={() => nav("/")}>
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </div>
        </div>

      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Nouvelle souscription</h1>
        </div>
      </div>

      {/* Stepper */}
      <Card className="shadow-soft overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <Stepper steps={STEPS.map(s => s.label)} current={step} />
        </CardContent>
      </Card>

      {/* Form card */}
      <Card className="shadow-card">
        {/* Step header */}
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <StepIcon className="h-4.5 w-4.5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Étape {step + 1} sur {STEPS.length}
              </p>
              <CardTitle className="text-base leading-tight">{STEPS[step].label}</CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* ── Step 0 · Compte ── */}
            {step === 0 && (
              <div className="space-y-5">
                <Field label="Adresse email">
                  <Input {...form.register("email")} placeholder="vous@entreprise.dz" />
                  <Err msg={form.formState.errors.email?.message} />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Mot de passe">
                    <Input type="password" {...form.register("password")} placeholder="8 caractères minimum" />
                    <Err msg={form.formState.errors.password?.message} />
                  </Field>
                  <Field label="Confirmation du mot de passe">
                    <Input type="password" {...form.register("passwordConfirm")} placeholder="Répétez le mot de passe" />
                    <Err msg={form.formState.errors.passwordConfirm?.message} />
                  </Field>
                </div>

                {/* Email verification banner */}
                <div className={cn(
                  "rounded-lg border p-4 flex items-center justify-between gap-4 transition-colors",
                  emailVerifie
                    ? "border-success/30 bg-success/5"
                    : "border-border bg-muted/30"
                )}>
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      emailVerifie ? "bg-success/15" : "bg-muted"
                    )}>
                      {emailVerifie
                        ? <CheckCircle2 className="h-4 w-4 text-success" />
                        : <Mail className="h-4 w-4 text-muted-foreground" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {emailVerifie ? "Email vérifié" : "Vérification de l'email"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {emailVerifie
                          ? "Votre adresse email a été confirmée avec succès."
                          : "Un lien de confirmation vous sera envoyé."}
                      </p>
                    </div>
                  </div>
                  {!emailVerifie && (
                    <Button type="button" size="sm" variant="outline" onClick={sendVerification} className="shrink-0">
                      Envoyer le lien
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 1 · Entreprise ── */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Raison sociale" full>
                    <Input {...form.register("raisonSociale")} placeholder="Nom de votre société" />
                    <Err msg={form.formState.errors.raisonSociale?.message} />
                  </Field>
                  <Field label="NIF">
                    <Input {...form.register("nif")} placeholder="Numéro d'identification fiscale" />
                    <Err msg={form.formState.errors.nif?.message} />
                  </Field>
                  <Field label="Numéro RC">
                    <Input {...form.register("rc")} placeholder="Registre du commerce" />
                    <Err msg={form.formState.errors.rc?.message} />
                  </Field>
                  <Field label="Téléphone professionnel">
                    <Input {...form.register("telephone")} placeholder="+221 77 000 00 00" />
                    <Err msg={form.formState.errors.telephone?.message} />
                  </Field>
                  <Field label="Adresse complète" full>
                    <Input {...form.register("adresse")} placeholder="Rue, ville, code postal" />
                    <Err msg={form.formState.errors.adresse?.message} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── Step 2 · Activités ── */}
            {step === 2 && (
              <div className="space-y-5">
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

                  
                  <Field label="Délais de livraison habituels">
                    <Select value={form.watch("delaisHabituels")} onValueChange={(v) => form.setValue("delaisHabituels", v, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-5 jours">1-5 jours</SelectItem>
                        <SelectItem value="5-10 jours">5-10 jours</SelectItem>
                        <SelectItem value="15-30 jours">15-30 jours</SelectItem>
                      </SelectContent>
                    </Select>
                    <Err msg={form.formState.errors.delaisHabituels?.message} />
                  </Field>
                  

                  <Field label="Produits / catégories vendus" full>
                    <Select value={form.watch("produits")} onValueChange={(v) => form.setValue("produits", v, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pièces">Pièces détachées</SelectItem>
                        <SelectItem value="autres catégories">Autres catégories à venir</SelectItem>
                      </SelectContent>
                    </Select>
                    <Err msg={form.formState.errors.produits?.message} />
                  </Field>

                  {form.watch("typeActivite") === "importation" && (
                  <Field label="Zones d'approvisionnement" full>
                    <Select value={form.watch("zonesApprovisionnement")} onValueChange={(v) => form.setValue("zonesApprovisionnement", v, { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asie">Asie</SelectItem>
                        <SelectItem value="moyen-orient">Moyen-orient</SelectItem>
                      </SelectContent>
                    </Select>
                    <Err msg={form.formState.errors.zonesApprovisionnement?.message} />
                  </Field>
                  )}

                  <Field label="Chiffre d'affaires annuel estimé (DZD)" full>
                    <Input
                      type="number"
                      {...form.register("chiffreAffaires", { valueAsNumber: true })}
                      placeholder="0"
                    />
                    <Err msg={form.formState.errors.chiffreAffaires?.message} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── Step 3 · Risque ── */}
            {step === 3 && (
              <div className="space-y-5">

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Retards sur 12 mois">
                    <Select value={String(form.watch("retards12mois"))} onValueChange={(v) => form.setValue("retards12mois", Number(v), { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0"> 0 retard (aucun retard)</SelectItem>
                        <SelectItem value="1">1-3 retards</SelectItem>
                        <SelectItem value="2">4-6 retards</SelectItem>
                        <SelectItem value="3">7-12 retards</SelectItem>
                        <SelectItem value="4">Plus de 12 retards</SelectItem>
                      </SelectContent>
                    </Select>
                    <Err msg={form.formState.errors.retards12mois?.message} />
                  </Field>

                  <Field label="Durée moyenne des retards (jours)">
                    <Select value={String(form.watch("dureeMoyenneRetard"))} onValueChange={(v) => form.setValue("dureeMoyenneRetard", Number(v), { shouldValidate: true })}>
                      <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0"> 0 jour (aucun retard)</SelectItem>
                        <SelectItem value="1">1-2 jours</SelectItem>
                        <SelectItem value="2">3-5 jours</SelectItem>
                        <SelectItem value="3">6-10 jours</SelectItem>
                        <SelectItem value="4">Plus de 10 jours</SelectItem>
                      </SelectContent>
                    </Select>
                    <Err msg={form.formState.errors.dureeMoyenneRetard?.message} />
                  </Field>

                  <Field label="Contrats avec pénalités de retard ?">
                    <Select value={form.watch("contratsPenalites")} onValueChange={(v) => form.setValue("contratsPenalites", v as "oui" | "non", { shouldValidate: true })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="non">Non</SelectItem>
                        <SelectItem value="oui">Oui</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Incidents douaniers" full>
                    <Textarea rows={2} {...form.register("incidentsDouaniers")} placeholder="Saisies, blocages, redressements fiscaux..." />
                    <Err msg={form.formState.errors.incidentsDouaniers?.message} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── Step 4 · Simulation ── */}
            {step === 4 && (
              <div className="space-y-4">
                {/* Prime hero */}
                <div className="rounded-xl bg-gradient-primary p-7 text-primary-foreground shadow-elegant">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm opacity-80 font-medium">Estimation de votre prime annuelle</p>
                      <p className="mt-2 text-5xl font-bold tracking-tight">{formatXOF(prime)}</p>
                      <p className="mt-3 text-xs opacity-70 max-w-xs">
                        Tarif indicatif basé sur vos déclarations. Peut être ajusté après audit.
                      </p>
                    </div>
                    <Sparkles className="h-7 w-7 opacity-60 shrink-0" />
                  </div>
                </div>

                {/* Breakdown */}
                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Détail du calcul
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <CalcRow
                      label={`Taux de base (${(tauxBase * 100).toFixed(2)}% du CA)`}
                      value={formatXOF(baseAmount)}
                    />
                    <CalcRow
                      label={`Majoration risque (+${(surchargeRate * 100).toFixed(0)}%)`}
                      value={formatXOF(surcharge)}
                      highlight={surcharge > 0}
                    />
                    <CalcRow label="Franchise" value={formatXOF(franchise)} muted />
                    <CalcRow label="Plafond de garantie" value={formatXOF(prime * 20)} muted />
                    <Separator />
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-semibold">Total prime annuelle</span>
                      <span className="font-semibold text-primary text-lg">{formatXOF(prime)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Tip */}
                <div className="rounded-lg border border-border bg-muted/20 px-4 py-3 text-xs text-muted-foreground flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  Un conseiller SafeDelay vous contactera sous 48h pour valider et finaliser votre contrat.
                </div>
              </div>
            )}

            {/* ── Step 5 · Validation & paiement ── */}
            {step === 5 && (
              <div className="space-y-5">

                {/* Summary */}
                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Récapitulatif
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                      <RecapItem label="Entreprise" value={form.getValues("raisonSociale")} />
                      <RecapItem label="NIF" value={form.getValues("nif")} />
                      <RecapItem label="Téléphone" value={form.getValues("telephone")} />
                      <RecapItem label="Activité" value={form.getValues("typeActivite")} />
                      <RecapItem label="Zones" value={form.getValues("zonesApprovisionnement")} />
                      <RecapItem label="CA estimé" value={formatXOF(ca)} />
                      <RecapItem label="Délais habituels" value={form.getValues("delaisHabituels")} />
                    </div>
                    <Separator className="my-4" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Prime annuelle</span>
                      <span className="text-lg font-bold text-primary">{formatXOF(prime)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Franchise</span>
                      <span className="text-sm text-muted-foreground">{formatXOF(franchise)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Consent */}
                <Card className="shadow-soft">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileSignature className="h-4 w-4 text-muted-foreground" />
                      Consentement & signature
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <label className="flex items-start gap-3 text-sm cursor-pointer group">
                      <Checkbox
                        className="mt-0.5"
                        checked={form.watch("consentement")}
                        onCheckedChange={(v) => form.setValue("consentement", Boolean(v), { shouldValidate: true })}
                      />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                        Je certifie l'exactitude des informations fournies et j'accepte les{" "}
                        <a className="text-primary underline underline-offset-2" href="#">conditions générales</a>{" "}
                        de SafeDelay.
                      </span>
                    </label>
                    <Err msg={form.formState.errors.consentement?.message} />

                    <Field label="Signature électronique — saisissez votre nom complet">
                      <Input
                        {...form.register("signature")}
                        placeholder="ex : Aïssatou Diop"
                        className="font-serif italic text-base"
                      />
                      <Err msg={form.formState.errors.signature?.message} />
                    </Field>
                  </CardContent>
                </Card>

                {/* Payment */}
                <Card className="shadow-soft border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      Paiement de la prime
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-muted/40 px-4 py-3">
                      <span className="text-sm text-muted-foreground">Montant à régler</span>
                      <span className="text-xl font-bold text-primary">{formatXOF(prime)}</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input placeholder="Numéro de carte" defaultValue="4242 4242 4242 4242" />
                      <Input placeholder="MM / AA · CVC" defaultValue="12 / 28 · 123" />
                    </div>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-success" />
                      Paiement sécurisé — démo, aucune transaction réelle
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-5 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={prev}
                disabled={step === 0}
                className="min-w-[90px]"
              >
                Retour
              </Button>

              <span className="text-xs text-muted-foreground">
                {step + 1} / {STEPS.length}
              </span>

              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={next} className="min-w-[120px] gap-1">
                  Continuer <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={paying} className="min-w-[200px]">
                  {paying ? "Traitement en cours..." : `Payer ${formatXOF(prime)}`}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={cn("space-y-1.5", full && "sm:col-span-2")}>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

function Err({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-destructive mt-1">{msg}</p>;
}

function CalcRow({
  label,
  value,
  highlight,
  muted,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-sm", muted ? "text-muted-foreground" : "text-foreground")}>
        {label}
      </span>
      <span className={cn("text-sm font-medium", highlight && "text-warning")}>
        {value}
      </span>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-sm">{value}</div>
    </div>
  );
}

function RecapItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}