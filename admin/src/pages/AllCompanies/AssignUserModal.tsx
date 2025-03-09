import React, { useState } from 'react';
import { Modal, Button, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { useFetchClient } from '@strapi/strapi/admin';
import { updateCompanyContactMember, fetchCompanies } from '../../api/api';

interface AssignUserModalProps {
    open: boolean;
    onOpenChange: () => void;
    selectedCompanies: string[];
    contactMembers: { id: number; firstname: string; lastname: string }[];
    onCompaniesUpdated: (companies: any[]) => void;
}

export const AssignUserModal: React.FC<AssignUserModalProps> = ({
    open,
    onOpenChange,
    selectedCompanies,
    contactMembers,
    onCompaniesUpdated,
}) => {
    const [selectedContactMember, setSelectedContactMember] = useState<number | null>(null);
    const { get, put } = useFetchClient();

    async function assignCompanies() {
        if (!selectedContactMember) return;
        for (const companyDocumentId of selectedCompanies) {
            await updateCompanyContactMember(companyDocumentId, selectedContactMember, put);
        }
        const refreshed = await fetchCompanies(get);
        onCompaniesUpdated(refreshed);
    }

    return (
        <Modal.Root open={open} onOpenChange={onOpenChange}>
            <Modal.Trigger asChild>
                <Button variant="secondary">Affecter</Button>
            </Modal.Trigger>
            <Modal.Content>
                <Modal.Header>
                    <Modal.Title>Affecter à un utilisateur</Modal.Title>
                </Modal.Header>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await assignCompanies();
                        onOpenChange();
                    }}
                >
                    <Modal.Body>
                        <SingleSelect
                            placeholder="Sélectionner un utilisateur"
                            value={selectedContactMember ? String(selectedContactMember) : ''}
                            onChange={(val: string) => setSelectedContactMember(Number(val))}
                        >
                            {contactMembers.map((user) => (
                                <SingleSelectOption value={String(user.id)} key={user.id}>
                                    {user.firstname} {user.lastname}
                                </SingleSelectOption>
                            ))}
                        </SingleSelect>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">Confirmer</Button>
                    </Modal.Footer>
                </form>
            </Modal.Content>
        </Modal.Root>
    );
};