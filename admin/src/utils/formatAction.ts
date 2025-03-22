import { ACTION_TYPES } from '../../../server/src/utils/actionType';
import { SUB_ACTION_TYPES } from '../../../server/src/utils/subActionType';
import { SUB_SUB_ACTION_TYPES } from '../../../server/src/utils/subSubActionType';

export const formatAction = (actionType: string): string => {
  return ACTION_TYPES[actionType as keyof typeof ACTION_TYPES] || actionType;
};

export const formatSubAction = (subActionType: string): string => {
  return SUB_ACTION_TYPES[subActionType as keyof typeof SUB_ACTION_TYPES]?.label || subActionType;
};

export const formatSubSubAction = (subSubActionType: string): string => {
  return SUB_SUB_ACTION_TYPES[subSubActionType as keyof typeof SUB_SUB_ACTION_TYPES]?.label || subSubActionType;
}; 