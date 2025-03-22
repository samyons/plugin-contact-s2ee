import {
    Box,
    Loader,
    Flex,
    Button,
} from '@strapi/design-system';

import { Table } from '../../components/Table';
import { ContactMenu } from '../../components/ContactMenu';

import {
    Page,
    Layouts,
    useFetchClient,
} from '@strapi/admin/strapi-admin';

import React, { useEffect, useState } from "react";
import { getCompanyStatus } from '../../utils/getCompanyStatus';
import { fetchCompanies } from '../../api/api';
import { getContactMember } from '../../utils/getContactMember';
import { handleSort } from '../../utils/handleSort';
import { formatAction, formatSubAction, formatSubSubAction } from '../../utils/formatAction';

interface Action {
    id: number;
    action: string;
    subAction?: string;
    subSubAction?: string;
    date: string;
}

interface Company {
    id: number;
    documentId: string;
    name: string;
    sector: string;
    globalStatus: string;
    assignedTo: ContactMember | null;
    actions: Action[];
}

interface ContactMember {
    id: number;
    firstname: string;
    lastname: string;
}

export const Contact = () => {
    const { get } = useFetchClient();
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompanies, setSelectedCompanies] = useState<Company[]>([]);
    const [sortBy, setSortBy] = useState<string>('name');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

    async function loadData() {
        try {
            console.log("start fetching companies");
            const dataCompanies = await fetchCompanies(get);
            setCompanies(dataCompanies);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("useEffect");
        loadData();
    }, []);

    const handleCompaniesUpdated = (updatedCompanies: React.SetStateAction<Company[]>) => {
        setCompanies(updatedCompanies);
        setSelectedCompanies([]);
    };

    const headers = [
        { name: 'name', label: 'Nom', sortable: true },
        { name: 'assignedTo', label: 'Assignée à', sortable: false },
        { name: 'lastAction', label: 'Dernière action', sortable: false },
        { name: 'lastActionDetails', label: 'Détails', sortable: false },
        { name: 'lastActionDate', label: 'Date', sortable: true },
        { name: 'actions', label: 'Actions', sortable: false },
    ];

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getLastAction = (company: Company) => {
        if (!company.actions || company.actions.length === 0) return null;
        return company.actions[0];
    };

    const getActionDetails = (action: Action | null) => {
        if (!action) return '';
        if (action.subSubAction) return formatSubSubAction(action.subSubAction);
        if (action.subAction) return formatSubAction(action.subAction);
        return '';
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
                            {companies.map((company) => {
                                const lastAction = getLastAction(company);
                                return (
                                    <Table.Row key={company.documentId}>
                                        <Table.CheckboxCell id={company.id} />
                                        <Table.Cell>{company.name}</Table.Cell>
                                        <Table.Cell>{getContactMember(company.assignedTo)}</Table.Cell>
                                        <Table.Cell>{lastAction ? formatAction(lastAction.action) : '-'}</Table.Cell>
                                        <Table.Cell>{getActionDetails(lastAction) || '-'}</Table.Cell>
                                        <Table.Cell>{lastAction ? formatDate(lastAction.date) : '-'}</Table.Cell>
                                        <Table.Cell>
                                            <ContactMenu
                                                company={company}
                                            />
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table.Content>
                </Table.Root>
            </Layouts.Content>
        </Page.Main>
    );
};