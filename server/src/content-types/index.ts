import company from './company';
import contact from './contact';
import action from './action';

export default {
    'company': {
        schema: company.schema,
    },
    'contact': {
        schema: contact.schema,
    },
    'action': {
        schema: action.schema,
    },
};
