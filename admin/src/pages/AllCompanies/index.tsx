import React, { useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Loader,
    Flex,
    Button,
} from '@strapi/design-system';
import { BackButton, Layouts, Page, useFetchClient } from '@strapi/admin/strapi-admin';
import { getCompanyStatus } from '../../utils/getCompanyStatus';
import { fetchCompanies, fetchAdminUsers } from '../../api/api';
import { AssignUserModal } from './AssignUserModal';
import { Table } from '../../components/Table'; // Assurez-vous que le chemin d'importation est correct

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
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

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

    const handleSort = (name: string, order: 'ASC' | 'DESC') => {
        setSortBy(name);
        setSortOrder(order);

        const sortedCompanies = [...companies].sort((a, b) => {
            const aValue = a[name as keyof Company];
            const bValue = b[name as keyof Company];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return order === 'ASC'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return 0;
        });

        setCompanies(sortedCompanies);
    };

    const handleCompaniesUpdated = (updatedCompanies: React.SetStateAction<Company[]>) => {
        setCompanies(updatedCompanies);
        setSelectedCompanies([]);
    };

    function getContactMember(admin_user: any | null) {
        if (!admin_user) return '-';
        return admin_user.firstname + ' ' + admin_user.lastname;
    }

    const headers = [
        { name: 'name', label: 'Nom', sortable: true },
        { name: 'sector', label: 'Secteur', sortable: true },
        { name: 'admin_user', label: 'Assignée à', sortable: false },
        { name: 'state', label: 'Statut', sortable: true },
    ];

    if (loading) {
        return (
            <Box padding={8} background="neutral100">
                <Loader>Chargement des entreprises...</Loader>
            </Box>
        );
    } 

    return (
        <Page.Main>
        <Page.Title>Liste des entreprises</Page.Title>
        <Layouts.Header
        subtitle={'Toutes les entreprises enregistrées dans le système'}
        title={"Liste des entreprises"} 
      />
        <Layouts.Content>  
            <Table.Root
                headers={headers}
                rows={companies}
                selectedRows={selectedCompanies}
                onSelectedRowsChange={setSelectedCompanies}
                isLoading={loading}
            >
                <Table.ActionBar>
                    <Flex gap={2}>
                        <AssignUserModal
                            open={showModal}
                            onOpenChange={() => setShowModal(!showModal)}
                            selectedCompanies={selectedCompanies.map(company => company.documentId)}
                            contactMembers={contactMembers}
                            onCompaniesUpdated={handleCompaniesUpdated}
                        />
                        <Button variant="danger-light" onClick={() => setSelectedCompanies([])}>
                            Annuler sélection
                        </Button>
                    </Flex>
                </Table.ActionBar>
                <Table.Content>
                    <Table.Head>
                        <Table.HeaderCheckboxCell />
                        {headers.map((header) => (
                            <Table.HeaderCell
                                key={header.name}
                                name={header.name}
                                label={header.label}
                                sortable={header.sortable}
                                onSort={handleSort}
                                currentSort={sortBy}
                                currentOrder={sortOrder}
                            />
                        ))}
                    </Table.Head>
                    <Table.Body>
                        {companies.map((company) => (
                            <Table.Row key={company.documentId}>
                                <Table.CheckboxCell id={company.id} />
                                <Table.Cell>{company.name}</Table.Cell>
                                <Table.Cell>{company.sector}</Table.Cell>
                                <Table.Cell>{getContactMember(company.admin_user)}</Table.Cell>
                                <Table.Cell>{getCompanyStatus(company.state)}</Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Content>
            </Table.Root>
        </Layouts.Content>
        </Page.Main>
    );
};