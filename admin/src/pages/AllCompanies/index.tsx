import React, { useState, useEffect } from 'react';
import {
    Table,
    Thead,
    Tr,
    Td,
    Th,
    Tbody,
    Typography,
    Box,
    Loader,
    Checkbox,
    Flex,
    Button,
    EmptyStateLayout,
} from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { getCompanyStatus } from '../../utils/getCompanyStatus';
import { fetchCompanies, fetchAdminUsers } from '../../api/api';
import { AssignUserModal } from './AssignUserModal';
 
interface Company {
    id: number;
    documentId: string;
    name: string;
    sector: string;
    state: string;
    admin_user: any | null; 
}

interface ContactMember {
    id: number;
    firstname: string;
    lastname: string;
}

export const CompanyList = () => {
    const { get } = useFetchClient();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [contactMembers, setContactMembers] = useState<ContactMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [showModal, setShowModal] = useState(false);

    async function loadData() {
        try {
            const dataCompanies = await fetchCompanies(get);
            const dataUsers = await fetchAdminUsers(get);
            setCompanies(dataCompanies);
            setContactMembers(dataUsers);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const allSelected = companies.length > 0 && selectedCompanies.length === companies.length;

    const toggleSelectAll = () => {
        if (allSelected) setSelectedCompanies([]);
        else setSelectedCompanies(companies.map((c) => c.documentId));
    };

    const toggleSelect = (documentId: string) => {
        setSelectedCompanies((prev) =>
            prev.includes(documentId) ? prev.filter((cid) => cid !== documentId) : [...prev, documentId]
        );
    };

    const handleCompaniesUpdated = (updatedCompanies: React.SetStateAction<Company[]>) => {
        setCompanies(updatedCompanies);
        setSelectedCompanies([]);
    };

    function getContactMember(admin_user: any | null) {
        if (!admin_user) return '-';
        return admin_user.firstname + ' ' + admin_user.lastname;
    }

    if (loading) {
        return (
            <Box padding={8} background="neutral100">
                <Loader>Chargement des entreprises...</Loader>
            </Box>
        );
    }

    return (
        <Box padding={8} background="neutral100">
            <Flex justifyContent="space-between" alignItems="center" marginBottom={4}>
                <Typography variant="alpha">Liste des entreprises</Typography>
                {selectedCompanies.length > 0 && (
                    <Flex gap={2}>
                        <AssignUserModal
                            open={showModal}
                            onOpenChange={() => setShowModal(!showModal)}
                            selectedCompanies={selectedCompanies}
                            contactMembers={contactMembers}
                            onCompaniesUpdated={handleCompaniesUpdated}
                        />
                        <Button variant="danger-light" onClick={() => setSelectedCompanies([])}>
                            Annuler sélection
                        </Button>
                    </Flex>
                )}
            </Flex>
            {companies.length === 0 ? (
                <EmptyStateLayout content="Aucune entreprise trouvée" />
            ) : (
                <Table>
                    <Thead>
                        <Tr>
                            <Th>
                                <Checkbox aria-label="Sélectionner tout" checked={allSelected} onCheckedChange={toggleSelectAll} />
                            </Th>
                            <Th>
                                <Typography variant="sigma">Nom</Typography>
                            </Th>
                            <Th>
                                <Typography variant="sigma">Secteur</Typography>
                            </Th>
                            <Th>
                                <Typography variant="sigma">Assignée à</Typography>
                            </Th>
                            <Th>
                                <Typography variant="sigma">Statut</Typography>
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {companies.map((company) => (
                            <Tr key={company.documentId}>
                                <Td>
                                    <Checkbox
                                        aria-label={`Sélectionner ${company.name}`}
                                        checked={selectedCompanies.includes(company.documentId)}
                                        onCheckedChange={() => toggleSelect(company.documentId)}
                                    />
                                </Td>
                                <Td>
                                    <Typography>{company.name}</Typography>
                                </Td>
                                <Td>
                                    <Typography>{company.sector}</Typography>
                                </Td>
                                <Td>
                                    <Typography>{getContactMember(company.admin_user)}</Typography>
                                </Td>
                                <Td>
                                    <Typography>{getCompanyStatus(company.state)}</Typography>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </Box>
    );
};