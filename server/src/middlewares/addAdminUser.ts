export default (config, { strapi }) => {
    return async (ctx, next) => {
        console.log("addAdminUser middleware");
        const adminUser = ctx.state.user;

        // Ajouter l'admin user à la data de l'action
        ctx.request.body.data = {
            ...ctx.request.body.data,
            user: adminUser.documentId
        };

        await next();
    };
}; 