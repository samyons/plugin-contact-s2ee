import { SUB_ACTION_TYPES } from './subActionType';

type SubActionType = keyof typeof SUB_ACTION_TYPES;
type SubSubActionType = keyof typeof SUB_SUB_ACTION_TYPES;

export const SUB_SUB_ACTION_TYPES = {
  INTERESSE: {
    label: "Intéressé",
    parentSubActions: ["REPONDU"] as SubActionType[]
  },
  NON_INTERESSE: {
    label: "Non intéressé",
    parentSubActions: ["REPONDU"] as SubActionType[]
  },
  A_RAPPELER: {
    label: "À rappeler",
    parentSubActions: ["PAS_DE_REPONSE"] as SubActionType[]
  },
  CHANGER_CONTACT: {
    label: "Changer de contact",
    parentSubActions: ["NUMERO_INVALIDE"] as SubActionType[]
  }
} as const;

export const SUB_SUB_ACTION_TYPE_VALUES = Object.keys(SUB_SUB_ACTION_TYPES) as SubSubActionType[];
export const SUB_SUB_ACTION_TYPE_LABELS = Object.entries(SUB_SUB_ACTION_TYPES).map(([value, data]) => ({
  value,
  label: data.label
}));

export const getSubSubActionsForSubAction = (subActionType: SubActionType) => {
  return SUB_SUB_ACTION_TYPE_VALUES.filter(subSubAction => 
    SUB_SUB_ACTION_TYPES[subSubAction].parentSubActions.includes(subActionType)
  );
}; 