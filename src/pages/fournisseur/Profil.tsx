import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { currentSupplier } from "@/data/mock";

export default function FournisseurProfil() {
  const s = currentSupplier;
  return (
    <AppLayout
      space="fournisseur"
      title="Mon profil"
      subtitle="Gérez les informations de votre entreprise"
      breadcrumbs={[{ label: "Fournisseur", to: "/fournisseur/dashboard" }, { label: "Profil" }]}
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader><CardTitle className="text-base">Informations entreprise</CardTitle></CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <Field label="Raison sociale" value={s.raisonSociale} />
            <Field label="NIF" value={s.nif} />
            <Field label="Numéro RC" value={s.rc} />
            <Field label="Secteur" value={s.secteur} />
            <Field label="Adresse" full value={s.adresse} />
            <Field label="Téléphone" value={s.telephone} />
            <Field label="Email" value={s.email} />
            <div className="sm:col-span-2"><Button>Enregistrer les modifications</Button></div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Préférences</CardTitle></CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between"><span>Notifications email</span><Switch defaultChecked /></div>
              <div className="flex items-center justify-between"><span>Notifications SMS</span><Switch /></div>
              <div className="flex items-center justify-between"><span>Newsletter mensuelle</span><Switch defaultChecked /></div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardHeader><CardTitle className="text-base">Sécurité</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">Changer le mot de passe</Button>
              <Button variant="outline" className="w-full">Activer la 2FA</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
      <Label className="text-xs">{label}</Label>
      <Input defaultValue={value} />
    </div>
  );
}