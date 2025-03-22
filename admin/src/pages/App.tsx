import { Layouts, Page } from '@strapi/strapi/admin';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import { HomePage } from './Home';
import { CompanyList } from './AllCompanies/AllCompanies';
import { SideNav } from '../components/SideNav';
import { CommonProviders } from '../providers/CommonProviders';
import { Contact } from './Contact/Contact';
import { CompanyActions } from './CompanyActions/CompanyActions';

const InnerApp = () => {
  return (
    <Layouts.Root sideNav = {<SideNav />}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/contacter" element={<Contact />} />
        <Route path="/contacter/company-actions/:companyDocumentId" element={<CompanyActions />} />
        <Route path="*" element={<Page.Error />} />
      </Routes> 
    </Layouts.Root>
  );
};

const App = () => {
  return (
    <CommonProviders>
      <InnerApp /> 
    </CommonProviders>
  )
}

export default App;
