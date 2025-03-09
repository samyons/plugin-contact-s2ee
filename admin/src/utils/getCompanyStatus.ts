export function getCompanyStatus(status: string) {
    const STATUS_LABELS: Record<string, string> = {
      TO_PREPARE: 'En préparation',
      TO_CALL: 'À contacter (premier appel)',
      CONTACTED: 'Contactée (en attente)',
      INTERESTED: 'Intéressée (mail à envoyer)',
      FORM_SENT: 'Formulaire envoyé (en attente)',
      REMINDER: 'Relance',
      CONFIRMED: 'Confirmée',
      NOT_INTERESTED: 'Non intéressée',
      ABANDONED: 'Abandonnée'
    }
    return STATUS_LABELS[status] || 'Statut inconnu'
  }
  