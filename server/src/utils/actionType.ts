export const ACTION_TYPES = {
  APPEL_INITIAL: "Appel initial",
  ENVOI_FORMULAIRE: "Envoi du formulaire",
  RECEPTION_REPONSE_FORMULAIRE: "Réception de la réponse au formulaire",
  RELANCE_FORMULAIRE: "Relance du formulaire",
  ENVOI_EMAIL_CONFIRMATION: "Envoi de l'email de confirmation",
  RECEPTION_REPONSE_EMAIL_CONFIRMATION: "Réception de la réponse à l'email de confirmation",
  RELANCE_CONFIRMATION: "Relance de la confirmation",
  EMAIL_BIENVENUE: "Email de bienvenue",
  AUTRE: "Autre"
} as const;

export const ACTION_TYPE_VALUES = Object.keys(ACTION_TYPES);
export const ACTION_TYPE_LABELS = Object.entries(ACTION_TYPES).map(([value, label]) => ({
  value,
  label
}));