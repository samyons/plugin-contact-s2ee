import React, { useState, useEffect } from 'react';
import {
    Box,
    Loader,
    Typography,
    Button,
} from '@strapi/design-system';

import { Table } from '../../components/Table';

import {
    Page,
    Layouts,
    useFetchClient,
} from '@strapi/admin/strapi-admin';

import { useParams, useNavigate } from 'react-router-dom';
import { formatAction, formatSubAction, formatSubSubAction } from '../../utils/formatAction';
import { handleSort } from '../../utils/handleSort';
import { fetchCompanyById, fetchCompanyActions } from '../../api/api';
import { ArrowLeft } from '@strapi/icons';

interface Action {
    id: number;
    action: string;
    subAction?: string;
    subSubAction?: string;
    date: string;
    user: {
        id: number;
        firstname: string;
        lastname: string;
    };
    contact: {
        id: number;
        name: string;
        email: string;
    };
}

interface Company {
    id: number;
    name: string;
}

export const CompanyActions = () => {
    const { get } = useFetchClient();
    const { companyDocumentId } = useParams();
    const navigate = useNavigate();
    const [actions, setActions] = useState<Action[]>([]);
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

    const headers = [
        { name: 'contact', label: 'Contact', sortable: true },
        { name: 'action', label: 'Action', sortable: true },
        { name: 'details', label: 'Détails', sortable: false },
        { name: 'date', label: 'Date', sortable: true },
        { name: 'admin_user', label: 'Réalisée par', sortable: true },
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

    const getActionDetails = (action: Action) => {
        if (action.subSubAction) return formatSubSubAction(action.subSubAction);
        if (action.subAction) return formatSubAction(action.subAction);
        return '';
    };

    async function loadData() {
        if (!companyDocumentId) return;
        
        setLoading(true);
        try {
            const companyData = await fetchCompanyById(get, companyDocumentId);
            const actionsData = await fetchCompanyActions(get, companyData.id);
            setCompany(companyData);
            setActions(actionsData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [companyDocumentId]);

    if (loading) {
        return (
            <Box padding={8} background="neutral100">
                <Loader>Chargement des actions...</Loader>
            </Box>
        );
    }

    if (!company) {
        return (
            <Box padding={8}>
                <Typography variant="beta">Entreprise non trouvée</Typography>
            </Box>
        );
    }

    return (
        <Page.Main>
            <Box paddingBottom={4}>
                <Button
                    variant="tertiary"
                    startIcon={<ArrowLeft />}
                    onClick={() => navigate('/plugins/plugin-contact-s2ee/contacter')}
                >
                    Retour à la liste
                </Button>
            </Box>
            <Page.Title>{`Actions de ${company.name}`}</Page.Title>
            <Layouts.Header
                subtitle={`Historique des actions pour ${company.name}`}
                title={`Actions de ${company.name}`}
            />
            <Layouts.Content>
                <Table.Root
                    headers={headers}
                    rows={actions}
                    isLoading={loading}
                >
                    <Table.Content>
                        <Table.Head>
                            {headers.map((header) => (
                                <Table.HeaderCell
                                    key={header.name}
                                    name={header.name}
                                    label={header.label}
                                    sortable={header.sortable}
                                    onSort={(name, order) => handleSort(actions, setActions, setSortBy, setSortOrder, name, order)}
                                    currentSort={sortBy}
                                    currentOrder={sortOrder}
                                />
                            ))}
                        </Table.Head>
                        <Table.Loading />
                        <Table.Empty />
                        <Table.Body>
                            {actions.map((action) => (
                                <Table.Row key={action.id}>
                                    <Table.Cell>{action.contact.name}</Table.Cell>
                                    <Table.Cell>{formatAction(action.action)}</Table.Cell>
                                    <Table.Cell>{getActionDetails(action) || '-'}</Table.Cell>
                                    <Table.Cell>{formatDate(action.date)}</Table.Cell>
                                    <Table.Cell>
                                        {`${action.user.firstname} ${action.user.lastname}`}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.Root>
            </Layouts.Content>
        </Page.Main>
    );
}; 