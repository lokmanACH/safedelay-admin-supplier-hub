export type ClaimStatus =
  | "Soumis"
  | "En cours de vérification"
  | "En analyse"
  | "Documents manquants"
  | "Accepté"
  | "Refusé"
  | "Payé";

export type SubscriptionStatus = "En attente" | "Validée" | "Refusée";

export type ContractStatus = "Actif" | "Expiré" | "Suspendu";

export interface Supplier {
  id: string;
  raisonSociale: string;
  nif: string;
  rc: string;
  adresse: string;
  telephone: string;
  email: string;
  secteur: string;
  chiffreAffaires: number;
  dateCreation: string;
}

export interface Contract {
  id: string;
  reference: string;
  fournisseurId: string;
  fournisseur: string;
  dateDebut: string;
  dateFin: string;
  prime: number;
  plafondGarantie: number;
  statut: ContractStatus;
}

export interface Subscription {
  id: string;
  reference: string;
  fournisseur: string;
  fournisseurId: string;
  date: string;
  activite: string;
  prime: number;
  statut: SubscriptionStatus;
  chiffreAffaires: number;
  zonesApprovisionnement: string[];
  delaisHabituels: string;
  historiqueRetards: string;
}

export interface ClaimDocument {
  id: string;
  nom: string;
  type: string;
  taille: string;
  dateAjout: string;
}

export interface ClaimTimelineEvent {
  date: string;
  titre: string;
  description: string;
  auteur: string;
}

export interface Claim {
  id: string;
  reference: string;
  contrat: string;
  contratId: string;
  commande: string;
  fournisseur: string;
  fournisseurId: string;
  dateDeclaration: string;
  cause: string;
  description: string;
  joursRetard: number;
  montantReclame: number;
  montantIndemnise?: number;
  statut: ClaimStatus;
  documents: ClaimDocument[];
  timeline: ClaimTimelineEvent[];
  documentsManquants?: string[];
  notesInternes?: string;
}

export interface DocumentItem {
  id: string;
  nom: string;
  categorie: "Contrat" | "Attestation" | "Sinistre" | "Facture";
  date: string;
  taille: string;
}

export interface Notification {
  id: string;
  titre: string;
  message: string;
  date: string;
  lue: boolean;
  type: "info" | "success" | "warning" | "error";
}