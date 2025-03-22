// plugins/plugin-contact-s2ee/server/content-types/company.ts

import { GLOBAL_STATUS_VALUES } from '../../utils/globalStatus';

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
      type: "string",
      required: true,
    },
    sector: {
      type: "string",
    },
    assignedTo: {
      type: "relation",
      relation: "oneToOne",
      target: "admin::user",
    },
    contacts: {
      type: "relation",
      relation: "oneToMany",
      target: "plugin::plugin-contact-s2ee.contact",
      mappedBy: "company"
    },
    principalContact: {
      type: "relation",
      relation: "oneToOne",
      target: "plugin::plugin-contact-s2ee.contact"
    },
    isPriority: {
      type: "boolean",
      default: false,
    },
    comments: {
      type: "text",
    },
    globalStatus: {
      type: 'enumeration',
      enum: GLOBAL_STATUS_VALUES,
      default: 'A_CONTACTER',
    },
    actions: {
      type: "relation",
      relation: "oneToMany",
      target: "plugin::plugin-contact-s2ee.action",
      mappedBy: "company"
    }
  }
};