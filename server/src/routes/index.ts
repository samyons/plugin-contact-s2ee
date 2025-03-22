import contentAPIRoutes from './content-api';
import company from './company';
import contact from './contact';
import action from './action';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes, 
  },
  company,
  contact,
  action,
};

export default routes; 