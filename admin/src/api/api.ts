const fetchCompanies = async (get: Function) => {
    const {
        data: {
            data
        }
    } = await get('/plugin-contact-s2ee/companies?populate=admin_user');
    console.log(data);
    return data;
};

const fetchAdminUsers = async (get: Function) => {
    const {
        data: {
            data: {
                results
            }
        }
    } = await get('/admin/users');
    console.log(results);
    return results;
}
const updateCompanyContactMember = async (companyDocumentId: string, contactMemberId: number, put: Function) => {
    const response = await put(`/plugin-contact-s2ee/companies/${companyDocumentId}`, {
        data: {
            admin_user: contactMemberId
        }
    });

    console.log(response);

    // if (!response.ok) {
    //     console.error(response);
    //     throw new Error('Failed to update company contact member');
    // }

    // const data = await response.json();
    // return data;
}

 
export { fetchCompanies, fetchAdminUsers, updateCompanyContactMember };