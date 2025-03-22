import React, { useState, useEffect } from 'react';
import {
  Button,
  TextInput,
  DatePicker,
  Modal,
  Typography,
  Box,
  Flex,
  Textarea,
  TimePicker,
  Checkbox,
  EmptyStateLayout,
  Loader,
} from '@strapi/design-system';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { useAuth } from '@strapi/admin/strapi-admin';
import { fetchCompanyContacts, createAction, updateCompany } from '../api/api';
import { ACTION_TYPES } from '../../../server/src/utils/actionType';
import { SUB_ACTION_TYPES, getSubActionsForAction } from '../../../server/src/utils/subActionType';
import { SUB_SUB_ACTION_TYPES, getSubSubActionsForSubAction } from '../../../server/src/utils/subSubActionType';

interface Contact {
  id: number;
  documentId: string;
  name: string;
  email: string;
  phone: string;
}

interface Company {
  documentId: string;
  principalContact?: string;
  id: number;
}

interface ContactActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyDocumentId: string;
}

export interface ContactActionData {
  action: string;
  subAction?: string;
  subSubAction?: string;
  companyDocumentId: string;
  date: Date;
  comments?: string;
}

export const ContactActionModal: React.FC<ContactActionModalProps> = ({
  isOpen,
  onClose,
  companyDocumentId,
}) => {
  const { get, post, put } = useFetchClient();
  const [action, setAction] = useState('');
  const [subAction, setSubAction] = useState('');
  const [subSubAction, setSubSubAction] = useState('');
  const [selectedContactDocumentId, setSelectedContactDocumentId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
  const [comments, setComments] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [company, setCompany] = useState<Company | null>(null);
  const [setPrincipalContact, setSetPrincipalContact] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    if (isOpen && companyDocumentId) {
      loadData();
    }
  }, [isOpen, companyDocumentId]);

  const loadData = async () => {
    setIsInitialLoading(true);
    await loadCompanyData();
    await loadContacts();
    setIsInitialLoading(false);
  };

  const loadCompanyData = async () => {
    try {
      const response = await get(`/plugin-contact-s2ee/companies/${companyDocumentId}`);
      setCompany(response.data);
    } catch (error) {
      console.error('Error loading company:', error);
    }
  };

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchCompanyContacts(get, companyDocumentId);
      setContacts(data);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setIsSubmitting(true);
    try {
      // Combine date and time
      const actionDateTime = new Date(date!);
      const [hours, minutes] = time.split(':');
      actionDateTime.setHours(parseInt(hours), parseInt(minutes));

      const actionData = {
        data: {
          action,
          subAction,
          subSubAction,
          date: actionDateTime,
          comments,
          contact: selectedContactDocumentId,
          company: companyDocumentId,
        }
      };
      await createAction(post, actionData);

      console.log("before the update");
      // If setPrincipalContact is checked, update the company
      if (setPrincipalContact && selectedContactDocumentId) {
        console.log("in the if");
        const response = await put(`/plugin-contact-s2ee/companies/${companyDocumentId}`, {
          data: {
            principalContact: selectedContactDocumentId
          }
        });
        console.log("this is the response", response);
      }

      onClose();
    } catch (error) {
      console.error('Error creating action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSubActions = () => {
    if (!action) return null;

    const availableSubActions = getSubActionsForAction(action as keyof typeof ACTION_TYPES);
    if (availableSubActions.length === 0) return null;

    return (
      <Box>
        <Typography variant="sigma" textColor="neutral600">Statut de la réponse *</Typography>
        <SingleSelect
          value={subAction}
          onChange={(value: string) => {
            setSubAction(value);
            setSubSubAction(''); // Reset subSubAction when subAction changes
          }}
          placeholder="Sélectionner un statut"
          required
        >
          {availableSubActions.map((subActionType) => (
            <SingleSelectOption key={subActionType} value={subActionType}>
              {SUB_ACTION_TYPES[subActionType].label}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </Box>
    );
  };

  const renderSubSubActions = () => {
    if (!subAction) return null;

    const availableSubSubActions = getSubSubActionsForSubAction(subAction as keyof typeof SUB_ACTION_TYPES);
    if (availableSubSubActions.length === 0) return null;

    return (
      <Box>
        <Typography variant="sigma" textColor="neutral600">Détail de la réponse *</Typography>
        <SingleSelect
          value={subSubAction}
          onChange={(value: string) => setSubSubAction(value)}
          placeholder="Sélectionner un détail"
          required
        >
          {availableSubSubActions.map((subSubActionType) => (
            <SingleSelectOption key={subSubActionType} value={subSubActionType}>
              {SUB_SUB_ACTION_TYPES[subSubActionType].label}
            </SingleSelectOption>
          ))}
        </SingleSelect>
      </Box>
    );
  };

  const isFormValid = () => {
    if (!action || !selectedContactDocumentId || !date) return false;

    const availableSubActions = getSubActionsForAction(action as keyof typeof ACTION_TYPES);
    if (availableSubActions.length > 0 && !subAction) return false;

    if (subAction) {
      const availableSubSubActions = getSubSubActionsForSubAction(subAction as keyof typeof SUB_ACTION_TYPES);
      if (availableSubSubActions.length > 0 && !subSubAction) return false;
    }

    return true;
  };

  const showSetPrincipalContactOption = () => {
    return selectedContactDocumentId && 
           company?.principalContact !== selectedContactDocumentId;
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Action de contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isInitialLoading ? (
            <Flex justifyContent="center" alignItems="center" padding={8}>
              <Loader>Chargement des données...</Loader>
            </Flex>
          ) : contacts.length === 0 ? (
            <EmptyStateLayout
              icon={null}
              content="Aucun contact n'est disponible. Veuillez d'abord ajouter des contacts à cette entreprise."
            />
          ) : (
            <Flex direction="column" gap={4}>
              <Box>
                <Typography variant="sigma" textColor="neutral600">Type d'action *</Typography>
                <SingleSelect
                  value={action}
                  onChange={(value: string) => {
                    setAction(value);
                    setSubAction('');
                    setSubSubAction('');
                  }}
                  placeholder="Sélectionner une action"
                  required
                >
                  {Object.entries(ACTION_TYPES).map(([value, label]) => (
                    <SingleSelectOption key={value} value={value}>
                      {label}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Box>

              {renderSubActions()}
              {renderSubSubActions()}

              <Box>
                <Typography variant="sigma" textColor="neutral600">Contact *</Typography>
                <SingleSelect
                  value={selectedContactDocumentId}
                  onChange={(value: string) => setSelectedContactDocumentId(value)}
                  placeholder="Sélectionner un contact"
                  disabled={loading}
                  required
                >
                  {contacts.map((contact) => (
                    <SingleSelectOption key={contact.documentId} value={contact.documentId}>
                      {contact.name} ({contact.email})
                      {company?.principalContact === contact.documentId ? ' (Contact principal)' : ''}
                    </SingleSelectOption>
                  ))}
                </SingleSelect>
              </Box>

              {showSetPrincipalContactOption() && (
                <Box>
                  <Checkbox
                    checked={setPrincipalContact}
                    onCheckedChange={(value: boolean) => setSetPrincipalContact(value)}
                  >
                    Définir comme contact principal
                  </Checkbox>
                </Box>
              )}

              <Box>
                <Typography variant="sigma" textColor="neutral600">Commentaire</Typography>
                <Textarea
                  placeholder="Ajouter un commentaire..."
                  name="comments"
                  value={comments}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComments(e.target.value)}
                  size="M"
                />
              </Box>

              <Flex gap={4}>
                <Box flex={1}>
                  <Typography variant="sigma" textColor="neutral600">Date *</Typography>
                  <DatePicker
                    initialDate={date}
                    locale="fr-FR"
                    onChange={(date: Date | null) => setDate(date)}
                    onClear={() => setDate(null)}
                    size="M"
                    required
                  />
                </Box>
                <Box flex={1}>
                  <Typography variant="sigma" textColor="neutral600">Heure *</Typography>
                  <TimePicker
                    value={time}
                    onChange={(value: string) => setTime(value)}
                    size="M"
                    required
                  />
                </Box>
              </Flex>
            </Flex>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="tertiary" disabled={isSubmitting || isInitialLoading}>Annuler</Button>
          </Modal.Close>
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={!isFormValid() || isSubmitting || contacts.length === 0 || isInitialLoading}
            loading={isSubmitting}
          >
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}; 