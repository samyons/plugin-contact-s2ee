import { ACTION_TYPES } from './actionType';

type ActionType = keyof typeof ACTION_TYPES;
type SubActionType = keyof typeof SUB_ACTION_TYPES;

export const SUB_ACTION_TYPES = {
  REPONDU: {
    label: "A répondu",
    parentActions: ["APPEL_INITIAL", "RELANCE_FORMULAIRE"] as ActionType[]
  },
  PAS_DE_REPONSE: {
    label: "Ne répond pas",
    parentActions: ["APPEL_INITIAL", "RELANCE_FORMULAIRE"] as ActionType[]
  },
  NUMERO_INVALIDE: {
    label: "Numéro indisponible",
    parentActions: ["APPEL_INITIAL", "RELANCE_FORMULAIRE"] as ActionType[]
  }
} as const;

export const SUB_ACTION_TYPE_VALUES = Object.keys(SUB_ACTION_TYPES) as SubActionType[];
export const SUB_ACTION_TYPE_LABELS = Object.entries(SUB_ACTION_TYPES).map(([value, data]) => ({
  value,
  label: data.label
}));

export const getSubActionsForAction = (actionType: ActionType) => {
  return SUB_ACTION_TYPE_VALUES.filter(subAction => 
    SUB_ACTION_TYPES[subAction].parentActions.includes(actionType)
  );
}; 