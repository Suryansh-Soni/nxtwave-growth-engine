import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import AmbassadorSignup from "./pages/AmbassadorSignup";
import Workshop from "./pages/Workshop";
import AmbassadorDashboard from "./pages/AmbassadorDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
  <Route
    path="/"
    element={<Navigate to="/workshop" replace />}
  />

  <Route
    path="/workshop"
    element={<Workshop />}
  />

  <Route
    path="/ambassador"
    element={<AmbassadorSignup />}
  />

  <Route
    path="/ambassador/:referralCode"
    element={<AmbassadorDashboard />}
  />
<Route
  path="/admin"
  element={<AdminDashboard />}
/>

</Routes>
    </BrowserRouter>
  );
}

export default App;