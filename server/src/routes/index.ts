import contentAPIRoutes from './content-api';
import company from './company';

const routes = {
  'content-api': {
    type: 'content-api',
    routes: contentAPIRoutes, 
  },
  company,
};

export default routes; 