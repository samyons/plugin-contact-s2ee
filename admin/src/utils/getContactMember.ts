function getContactMember(admin_user: any | null) {
    if (!admin_user) return '-';
    return admin_user.firstname + ' ' + admin_user.lastname;
}

export { getContactMember };