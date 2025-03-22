

export default async (policyContext, config, { strapi }) => {

    const { user } = policyContext.state;

    if (!user) {
        return false;
    }

    const userRole = user.roles.find(role => role.code === config.role);

    if (userRole) {
        console.log("initial query");
        console.log(policyContext.request.query.filters);

        policyContext.request.query.filters = {
            ...(policyContext.request.query.filters || {}),
            admin_user: user.id
        };
    }

    return true;
};