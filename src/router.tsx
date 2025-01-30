import { Route, Routes } from "react-router-dom";
import BasicForm from "./pages/input/view/BasicForm";
import AdditionalForms from "./pages/input/view/AdditionalForms";
import UserProfileForm from "./pages/input/view/UserProfileForm";
import AdvancedForm from "./pages/input/view/AdvancedForm";

// تعريف المسارات
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/form">
        <Route index element={<BasicForm />} />
        <Route path="additional-form" element={<AdditionalForms />} />
        <Route path="advance-form" element={<AdvancedForm />} />
        <Route path="user-profile" element={<UserProfileForm />} />
      </Route>
    </Routes>
  );
};
