import { Route, Routes } from 'react-router-dom';

import Button from './pages/Button/view/Button';
import Dialog from './pages/dialog/view/Dialog';
import AdditionalForms from './pages/input/view/AdditionalForms';
import AdvancedForm from './pages/input/view/AdvancedForm';
import BasicForm from './pages/input/view/BasicForm';

// تعريف المسارات
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/form">
        <Route index element={<BasicForm />} />
        <Route path="additional-form" element={<AdditionalForms />} />
        <Route path="advance-form" element={<AdvancedForm />} />
      </Route>
      <Route path="/button">
        <Route index element={<Button />} />
      </Route>
      <Route path="/dialog" element={<Dialog />} />
    </Routes>
  );
};
