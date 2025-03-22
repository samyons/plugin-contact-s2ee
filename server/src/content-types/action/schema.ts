// plugins/plugin-contact-s2ee/server/content-types/action.ts

import { ACTION_TYPE_VALUES } from '../../utils/actionType';
import { ACTION_STATUS_VALUES } from '../../utils/actionStatus';
import { SUB_ACTION_TYPE_VALUES } from '../../utils/subActionType';
import { SUB_SUB_ACTION_TYPE_VALUES } from '../../utils/subSubActionType';

export default {
  kind: "collectionType",
  collectionName: "actions",
  info: {
    singularName: "action",
    pluralName: "actions",
    displayName: "Action"
  },
  options: {
    comment: ""
  },
  attributes: {
    date: {
      type: "datetime",
      required: true,
    },
    action: {
      type: "enumeration",
      enum: ACTION_TYPE_VALUES,
      required: true,
    },
    subAction: {
      type: "enumeration",
      enum: SUB_ACTION_TYPE_VALUES,
    },
    subSubAction: {
      type: "enumeration",
      enum: SUB_SUB_ACTION_TYPE_VALUES,
    },
    comments: {
      type: "text",
    },
    company: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::plugin-contact-s2ee.company",
      inversedBy: "actions",
    },
    contact: {
      type: "relation",
      relation: "manyToOne",
      target: "plugin::plugin-contact-s2ee.contact",
      inversedBy: "actions",
    },
    user: {
      type: "relation",
      relation: "manyToOne",
      target: "admin::user",
    },
  },
};