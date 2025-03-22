import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("plugin::plugin-contact-s2ee.company", {
    type: "admin",
    config: {
        find: {
          policies: [
            {
              name: 'plugin::plugin-contact-s2ee.test',
              config: {
                role: 'membre-contact-m7utwhrx',
              }
            }
          ]
        }
    }
});