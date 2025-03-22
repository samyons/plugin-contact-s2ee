/**
 *  router
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('plugin::plugin-contact-s2ee.contact', {
    type: 'admin',
});
