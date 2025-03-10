import React from 'react';
import { SubNav, SubNavHeader, SubNavSections, SubNavSection, SubNavLink, Box } from '@strapi/design-system';
import { NavLink } from 'react-router-dom';

export const SideNav = () => {

    return (
        <SubNav aria-label="Plugin Contact S2EE">
            <SubNavHeader label="Contact S2EE" />
            <SubNavSections>
                <SubNavSection key={0} label="Gestion">
                    <SubNavLink
                        key={1}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/plugin-contact-s2ee/',
                        }}
                        end>
                        Accueil
                    </SubNavLink>
                    <SubNavLink
                        key={2}
                        tag={NavLink}
                        to={{
                            pathname: '/plugins/plugin-contact-s2ee/companies',
                        }}>
                        Toutes les entreprises
                    </SubNavLink>

                </SubNavSection>
            </SubNavSections>
        </SubNav>
    );
}