import type { Core } from '@strapi/strapi';

const register = async ({ strapi }: { strapi: Core.Strapi }) => {
  await strapi.admin.services.permission.conditionProvider.register({
    displayName: 'Est administrateur associé à la société',
    name: 'is-associated-admin',
    plugin: 'votre-plugin',
    handler: (user) => {
      return { admin_user: user.id };
    },
  });
};

export default register;
