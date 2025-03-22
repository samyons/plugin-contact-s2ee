/**
 *  router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('plugin::plugin-contact-s2ee.action', {
    type: 'admin', config: {
        create: {
            middlewares: [
                'plugin::plugin-contact-s2ee.addAdminUser'
            ]
        }
    }
});
