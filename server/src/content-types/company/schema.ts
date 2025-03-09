export default {
  kind: 'collectionType',
  collectionName: 'company',
  info: {
    singularName: 'company',
    pluralName: 'companies',
    displayName: 'Company',
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {
    'content-manager': {
      visible: true
    },
    'content-type-builder': {
      visible: true
    }
  },
  attributes: {
    name: {
      type: "string"
    },
    sector: {
      type: "string"
    },
    admin_user: {
      type: "relation",
      relation: "oneToOne",
      target: "admin::user",
    },
    state: {
      type: 'enumeration',
      enum: [
        'TO_PREPARE',     // À préparer / En préparation
        'TO_CALL',        // À contacter (premier appel)
        'CONTACTED',      // Contactée
        'INTERESTED',     // Intéressée (mail à envoyer)
        'FORM_SENT',      // Formulaire envoyé
        'REMINDER',       // Relance
        'CONFIRMED',      // Confirmée
        'NOT_INTERESTED', // Non intéressée
        'ABANDONED',      // Abandonnée / Sans réponse
      ],
      default: 'TO_PREPARE',
    },
  }
};