// plugins/plugin-contact-s2ee/server/content-types/contact.ts

export default {
  kind: "collectionType",
  collectionName: "contacts",
  info: {
    singularName: "contact",
    pluralName: "contacts",
    displayName: "Contact"
  },
  options: {
    comment: ""
  },
  attributes: {
    name: {
      type: "string",
      required: true,
    },
    position: {
      type: "string",
    },
    phone: { // Type 'text'
      type: "text",
    },
    email: { // Type 'text'
      type: "text",
    },
    company: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::plugin-contact-s2ee.company",
      inversedBy: "contacts"
    },
    actions: {
      type: "relation",
      relation: "oneToMany",
      target: "plugin::plugin-contact-s2ee.action",
      mappedBy: "contact",
    },
  }
};