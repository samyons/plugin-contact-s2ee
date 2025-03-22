import React, { useState } from 'react';
import { IconButton, SimpleMenu, MenuItem, Modal, Typography, Button, Box, Flex } from '@strapi/design-system';
import { More, Phone, Clock } from '@strapi/icons';
import { ContactActionModal } from './ContactActionModal';
import { useNavigate } from 'react-router-dom';

interface ContactMenuProps {
  company: {
    id: number;
    documentId: string;
    name: string;
    sector: string;
    globalStatus: string;
    assignedTo: any | null;
  };
}

export const ContactMenu: React.FC<ContactMenuProps> = ({ company }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewActions = () => {
    navigate(`/plugins/plugin-contact-s2ee/contacter/company-actions/${company.documentId}`);
  };

  return (
    <>
      <SimpleMenu
        tag={IconButton}
        icon={<More />}
        label="Actions"
      >
        <MenuItem onClick={() => setIsModalOpen(true)}>
          <Flex gap={2} alignItems="center">
            <Phone />
            Contacter
          </Flex>
        </MenuItem>
        <MenuItem onClick={handleViewActions}>
          <Flex gap={2} alignItems="center">
            <Clock />
            Voir les actions
          </Flex>
        </MenuItem>
      </SimpleMenu>

      <ContactActionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        companyDocumentId={company.documentId}
      />
    </>
  );
}; 