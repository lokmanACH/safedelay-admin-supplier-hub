import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Mail, Lock, Home } from "lucide-react";
import { toast } from "sonner";
import { Field, Err } from "@/components/shared/FormField";

const DEV_CREDENTIALS = [
  {
    role: "Fournisseur",
    email: "fournisseur@email.com",
    password: "12345678",
    redirect: "/fournisseur/dashboard",
  },
  {
    role: "Admin",
    email: "admin@email.com",
    password: "12345678",
    redirect: "/admin/dashboard",
  },
];

const schema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
  rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SignIn() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [devOpen, setDevOpen] = useState(false);
  const [activeCredential, setActiveCredential] = useState<number | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const loginAs = (index: number) => {
    const cred = DEV_CREDENTIALS[index];

    form.setValue("email", cred.email);
    form.setValue("password", cred.password);

    setActiveCredential(index);

    toast.success("Compte pré-rempli", {
      description: `${cred.role} sélectionné`,
    });
  };

  const onSubmit = async (values: FormData) => {
    setLoading(true);

    setTimeout(() => {
      const user = DEV_CREDENTIALS.find(
        (c) => c.email === values.email && c.password === values.password
      );

      if (!user) {
        toast.error("Identifiants invalides", {
          description: "Email ou mot de passe incorrect",
        });
        setLoading(false);
        return;
      }

      toast.success("Connexion réussie", {
        description: `Bienvenue (${user.role})`,
      });

      setLoading(false);
      nav(user.redirect);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-subtle flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Return  */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm transition">
          <div
            className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition"
            onClick={() => nav("/")}
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-card border-none">
          <CardHeader className="text-center space-y-2 pb-6">
            <CardTitle className="text-2xl">Connectez-vous</CardTitle>
            <p className="text-sm text-muted-foreground">
              Accédez à votre tableau de bord professionnel
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Field label="Adresse email">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="vous@entreprise.dz"
                      className="pl-10"
                      {...form.register("email")}
                    />
                  </div>
                  <Err msg={form.formState.errors.email?.message} />
                </Field>
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <Field label="Mot de passe">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="pl-10"
                      {...form.register("password")}
                    />
                  </div>
                  <Err msg={form.formState.errors.password?.message} />
                </Field>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground transition">
                  <Checkbox
                    checked={form.watch("rememberMe")}
                    onCheckedChange={(v) =>
                      form.setValue("rememberMe", Boolean(v))
                    }
                  />
                  <span className="text-muted-foreground">
                    Se souvenir de moi
                  </span>
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.message("Récupération de mot de passe", {
                      description: "Un lien sera envoyé à votre email",
                    });
                  }}
                  className="text-sm text-primary hover:underline transition"
                >
                  Oublié ?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-8 h-11 text-base font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⟳</span>
                    Connexion...
                  </span>
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-background text-muted-foreground">
                  Nouveau sur SafeDelay ?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm">
              <button
                type="button"
                onClick={() => nav("/signup")}
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1 transition"
              >
                Créer un compte <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          © 2024 SafeDelay. Tous droits réservés.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setDevOpen(!devOpen)}
        className="fixed bottom-3 right-3 z-10"
      >
        <span className="fixed bottom-3 right-3 z-10 text-[12px] px-2 py-1 rounded border border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800">
          Clickez pour tester avec des comptes pré-remplis
        </span>
      </button>

      {devOpen && (
        <div className="fixed bottom-0 right-0 p-3 font-mono">
          <div className="mb-2 min-w-50 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-3 shadow-sm">
            {DEV_CREDENTIALS.map((c, i) => (
              <div
                key={c.email}
                className="flex items-center justify-between gap-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
              >
                <div className="flex flex-col">
                  <span className="text-[10px] text-zinc-400">{c.role}</span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    {c.email}
                  </span>
                  <span className="text-xs text-zinc-700 dark:text-zinc-300">
                    {c.password}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => loginAs(i)}
                  className={`text-[10px] px-2 py-1 rounded border transition-colors ${
                    activeCredential === i
                      ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border-transparent"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {activeCredential === i ? "activé" : "utiliser"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}