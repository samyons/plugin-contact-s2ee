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
import { Table, TableHeader } from '../../components/Table';
import { getContactMember } from '../../utils/getContactMember';
import { handleSort } from '../../utils/handleSort';

interface Company {
    id: number;
    documentId: string;
    name: string;
    sector: string;
    globalStatus: string;
    assignedTo: any | null;
}

interface ContactMember {
    id: number;
    firstname: string;
    lastname: string;
}

const defaultHeaders: TableHeader[] = [
    { name: 'name', label: 'Nom', sortable: true },
    { name: 'sector', label: 'Secteur', sortable: true },
    { name: 'assignedTo', label: 'Assignée à', sortable: false },
    { name: 'state', label: 'Statut', sortable: true },
];

export const CompanyList = () => {
    const { get } = useFetchClient();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [contactMembers, setContactMembers] = useState<ContactMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
    const [headers, setHeaders] = useState<TableHeader[]>(defaultHeaders);

    const handleSetHeaders = (newHeaders: TableHeader[]) => {
        setHeaders(newHeaders);
    };

    const resetHeaders = () => {
        setHeaders(defaultHeaders);
    };

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

    const handleCompaniesUpdated = (updatedCompanies: React.SetStateAction<Company[]>) => {
        setCompanies(updatedCompanies);
        setSelectedCompanies([]);
    };

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
                                    onSort={(name, order) => handleSort(companies, setCompanies, setSortBy, setSortOrder, name, order)}
                                    currentSort={sortBy}
                                    currentOrder={sortOrder}
                                />
                            ))}
                        </Table.Head>
                        <Table.Loading />
                        <Table.Empty />
                        <Table.Body>
                            {companies.map((company) => (
                                <Table.Row key={company.documentId}>
                                    <Table.CheckboxCell id={company.id} />
                                    {headers.map(header => (
                                        <Table.Cell key={header.name}>
                                            {header.name === 'name' && company.name}
                                            {header.name === 'sector' && company.sector}
                                            {header.name === 'assignedTo' && getContactMember(company.assignedTo)}
                                            {header.name === 'state' && getCompanyStatus(company.globalStatus)}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.Root>
            </Layouts.Content>
        </Page.Main>
    );
};