const fetchCompanies = async (get: Function) => {
    const {
        data: {
            data
        }
    } = await get('/plugin-contact-s2ee/companies?populate[actions][sort][0]=date:desc&populate[assignedTo]=true');
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
            assignedTo: contactMemberId
        }
    });

    console.log(response);
}

export const fetchCompanyContacts = async (get: Function, companyDocumentId: string) => {
  try {
    const response = await get(`/plugin-contact-s2ee/companies/${companyDocumentId}?populate=contacts`);
    return response.data.data.contacts;
  } catch (error) {
    console.error('Error fetching company contacts:', error);
    return [];
  }
};

export const createAction = async (post: Function, actionData: any) => {
  try {
    const response = await post('/plugin-contact-s2ee/actions', actionData);
    return response.data;
  } catch (error) {
    console.error('Error creating action:', error);
    throw error;
  }
};

export const fetchCompanyById = async (get: Function, companyDocumentId: string) => {
  try {
    const response = await get(`/plugin-contact-s2ee/companies/${companyDocumentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

export const fetchCompanyActions = async (get: Function, companyId: number) => {
  try {
    const response = await get(`/plugin-contact-s2ee/actions?filters[company]=${companyId}&populate=*&sort[0]=date:desc`);
    console.log(response);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching company actions:', error);
    throw error;
  }
};

export const updateCompany = async (put: any, companyId: string, data: any) => {
  const response = await put(`/plugin-contact-s2ee/companies/${companyId}`, data);
  return response.data;
};

export { fetchCompanies, fetchAdminUsers, updateCompanyContactMember };