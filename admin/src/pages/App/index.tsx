import { Layouts, Page } from '@strapi/strapi/admin';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';

import { HomePage } from '../Home';
import { CompanyList } from '../AllCompanies';
import { SideNav } from '../../components/SideNav';
import { CommonProviders } from '../../providers/CommonProviders';
import { AssignedCompaniesList } from '../AssignedCompaniesList';

const InnerApp = () => {
  return (
    <Layouts.Root sideNav = {<SideNav />}>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/contacter" element={<AssignedCompaniesList />} />
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
