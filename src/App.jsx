import { Routes, Route } from "react-router-dom";
import './index.css'

// Route Components
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

// Shared Pages
import Home from "./shared/pages/Home";
import Login from "./shared/pages/Login";
import Register from "./shared/pages/Register";
import ActivateAccount from "./shared/pages/ActivateAccount";
import ForgotPassword from "./shared/pages/ForgotPassword";
import Contact from "./shared/pages/Contact";
import ServiceProvider from "./shared/pages/ServiceProvider";
import Works from "./shared/pages/Works";
import Terms from "./shared/pages/Terms";

// User Pages
import Oreders from "./user/pages/Orders";
import Balance from "./user/pages/Balance";
import Profile from "./user/pages/Profile";
import ProviderAccount from "./user/pages/ProviderAccount";
import BasicUpload from "./user/pages/BasicUpload";
import TripUpload from "./user/pages/TripUpload";
import ContractUpload from "./user/pages/ContractUpload";
import Notifications from "./user/pages/Notifications";
import Tracking from "./user/pages/Tracking";

// Driver Pages
import DriverOrders from "./driver/pages/DriverOrders";
import DriverNotifications from "./driver/pages/DriverNotifications";
import DriverBalance from "./driver/pages/DriverBalance";
import DriverProfile from "./driver/pages/DriverProfile";
import MissionInroad from "./driver/pages/MissionInroad";
import MissionStarted from "./driver/pages/MissionStarted";
import MissionArrived from "./driver/pages/MissionArrived";
import OrderDetails from "./driver/pages/OrderDetails";

// Admin Pages
import AdminDashboard from "./admin/pages/AdminDashboard";
import AddTruck from "./admin/pages/AddTruck";
import AddDriver from "./admin/pages/AddDriver";
import UpdateVehicle from "./admin/pages/UpdateVehicle";
import VehicleDetails from "./admin/pages/VehicleDetails";

// User Roles
import { USER_ROLES } from "./utils/constants";

function App() {
  return (
    <Routes>
      {/* Admin Routes - High Priority */}
      <Route path="/admin/dashboard" element={<RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><AdminDashboard /></RoleBasedRoute>} />
      <Route path="/admin/add-truck" element={<RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><AddTruck /></RoleBasedRoute>} />
      <Route path="/admin/add-driver" element={<RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><AddDriver /></RoleBasedRoute>} />
      <Route path="/admin/update-vehicle/:id" element={<RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><UpdateVehicle /></RoleBasedRoute>} />
      <Route path="/admin/vehicle-details/:id" element={<RoleBasedRoute allowedRoles={[USER_ROLES.ADMIN]}><VehicleDetails /></RoleBasedRoute>} />

      {/* Public Routes - Accessible to everyone */}
      <Route path="/" element={<Home />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/service-provider" element={<ServiceProvider />} />
      <Route path="/works" element={<Works />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* Public Routes - Only accessible when NOT authenticated */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/create-account" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/activate-account" element={<PublicRoute><ActivateAccount /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
      
      {/* User Routes - Only accessible to authenticated users with 'user' role */}
      <Route path="/user/orders" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><Oreders /></RoleBasedRoute>} />
      <Route path="/user/balance" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><Balance /></RoleBasedRoute>} />
      <Route path="/user/profile" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><Profile /></RoleBasedRoute>} />
      <Route path="/user/provider-account" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><ProviderAccount /></RoleBasedRoute>} />
      <Route path="/user/basic-upload" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><BasicUpload /></RoleBasedRoute>} />
      <Route path="/user/trip-upload" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><TripUpload /></RoleBasedRoute>} />
      <Route path="/user/contract-upload" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><ContractUpload /></RoleBasedRoute>} />
      <Route path="/user/notifications" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><Notifications /></RoleBasedRoute>} />
      <Route path="/user/tracking" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><Tracking /></RoleBasedRoute>} />
      <Route path="/user/providerAccount" element={<RoleBasedRoute allowedRoles={[USER_ROLES.USER]}><ProviderAccount /></RoleBasedRoute>} />
      
      {/* Driver Routes - Only accessible to authenticated users with 'driver' role */}
      <Route path="/driver/orders" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><DriverOrders /></RoleBasedRoute>} />
      <Route path="/driver/balance" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><DriverBalance /></RoleBasedRoute>} />
      <Route path="/driver/profile" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><DriverProfile /></RoleBasedRoute>} />
      <Route path="/driver/notifications" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><DriverNotifications /></RoleBasedRoute>} />
      <Route path="/driver/mission-in-road" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><MissionInroad /></RoleBasedRoute>} />
      <Route path="/driver/mission-started" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><MissionStarted /></RoleBasedRoute>} />
      <Route path="/driver/mission-arrived" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><MissionArrived /></RoleBasedRoute>} />
      <Route path="/driver/order-details/:id" element={<RoleBasedRoute allowedRoles={[USER_ROLES.DRIVER]}><OrderDetails /></RoleBasedRoute>} />
    </Routes>
  );
}

export default App;
