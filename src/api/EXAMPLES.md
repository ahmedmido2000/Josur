# API Integration Examples

This file contains practical examples of how to integrate APIs in your components.

## Example 1: Login Component

```javascript
// src/shared/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

function Login() {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await login(formData);
    
    if (result.success) {
      toast.success('Login successful!');
      // Navigation is handled automatically by PublicRoute
    }
    // Errors are handled by global middleware
  };
  
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoggingIn}>
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

## Example 2: User Orders Page

```javascript
// src/user/pages/Orders.jsx
import { useState } from 'react';
import { useGetUserOrdersQuery } from '../../api/user/userApi';
import LoadingSpinner from '../../components/LoadingSpinner';

function Orders() {
  const [filters, setFilters] = useState({
    status: 'all',
    page: 1,
  });
  
  const { data, isLoading, isError, error, refetch } = useGetUserOrdersQuery(filters);
  
  if (isLoading) return <LoadingSpinner fullscreen message="Loading orders..." />;
  
  if (isError) {
    return (
      <div className="error-container">
        <p>Failed to load orders</p>
        <button onClick={refetch}>Try Again</button>
      </div>
    );
  }
  
  const orders = data?.orders || [];
  
  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      
      <div className="filters">
        <select 
          value={filters.status} 
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="all">All Orders</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={refetch}>Refresh</button>
      </div>
      
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
```

## Example 3: Create Order Form

```javascript
// src/user/components/CreateOrderForm.jsx
import { useState } from 'react';
import { useCreateOrderMutation } from '../../api/user/userApi';
import { toast } from 'react-toastify';

function CreateOrderForm({ onSuccess }) {
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  
  const [formData, setFormData] = useState({
    pickup_location: '',
    delivery_location: '',
    description: '',
    weight: '',
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createOrder(formData).unwrap();
      toast.success('Order created successfully!');
      onSuccess?.(result);
      
      // Reset form
      setFormData({
        pickup_location: '',
        delivery_location: '',
        description: '',
        weight: '',
      });
    } catch (error) {
      // Error already handled by global middleware
      console.error('Failed to create order:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Pickup Location"
        value={formData.pickup_location}
        onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Delivery Location"
        value={formData.delivery_location}
        onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        required
      />
      <input
        type="number"
        placeholder="Weight (kg)"
        value={formData.weight}
        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        required
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Order'}
      </button>
    </form>
  );
}

export default CreateOrderForm;
```

## Example 4: Profile Update

```javascript
// src/user/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from '../../api/user/userApi';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/LoadingSpinner';

function Profile() {
  const { data: profile, isLoading: loadingProfile } = useGetUserProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateUserProfileMutation();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });
  
  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
    }
  }, [profile]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData).unwrap();
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };
  
  if (loadingProfile) return <LoadingSpinner fullscreen />;
  
  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
        <button type="submit" disabled={updating}>
          {updating ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default Profile;
```

## Example 5: File Upload

```javascript
// src/user/pages/BasicUpload.jsx
import { useState } from 'react';
import { useUploadDocumentMutation } from '../../api/user/userApi';
import { prepareFormData } from '../../utils/apiHelpers';
import { toast } from 'react-toastify';

function BasicUpload() {
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  const [selectedFile, setSelectedFile] = useState(null);
  
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }
    
    try {
      const formData = prepareFormData({
        document: selectedFile,
        type: 'basic',
      });
      
      await uploadDocument(formData).unwrap();
      toast.success('Document uploaded successfully!');
      setSelectedFile(null);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <div className="upload-page">
      <h1>Upload Document</h1>
      <input type="file" onChange={handleFileChange} />
      {selectedFile && <p>Selected: {selectedFile.name}</p>}
      <button onClick={handleUpload} disabled={isLoading || !selectedFile}>
        {isLoading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}

export default BasicUpload;
```

## Example 6: Using useAuth Hook

```javascript
// src/shared/components/Navbar.jsx
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { user, isAuthenticated, logout, role } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <nav>
      <div className="logo">Josur</div>
      
      {isAuthenticated ? (
        <div className="user-menu">
          <span>Welcome, {user?.name}</span>
          <span>Role: {role}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div className="auth-links">
          <a href="/login">Login</a>
          <a href="/create-account">Register</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
```

## Example 7: Conditional Query with Polling

```javascript
// src/driver/pages/DriverOrders.jsx
import { useGetDriverOrdersQuery } from '../../api/driver/driverApi';
import { useAuth } from '../../hooks/useAuth';

function DriverOrders() {
  const { isAuthenticated } = useAuth();
  
  // Poll every 30 seconds, skip if not authenticated
  const { data, isLoading } = useGetDriverOrdersQuery(
    { status: 'active' },
    {
      skip: !isAuthenticated,
      pollingInterval: 30000, // 30 seconds
    }
  );
  
  if (isLoading) return <div>Loading...</div>;
  
  const orders = data?.orders || [];
  
  return (
    <div>
      <h1>Active Orders</h1>
      <p>Auto-refreshing every 30 seconds</p>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

export default DriverOrders;
```

## Example 8: Admin Dashboard with Multiple Queries

```javascript
// src/admin/pages/AdminDashboard.jsx
import { useGetDashboardStatsQuery } from '../../api/admin/adminApi';
import { useGetAllUsersQuery } from '../../api/admin/adminApi';
import LoadingSpinner from '../../components/LoadingSpinner';

function AdminDashboard() {
  const { data: stats, isLoading: loadingStats } = useGetDashboardStatsQuery();
  const { data: users, isLoading: loadingUsers } = useGetAllUsersQuery({ limit: 10 });
  
  if (loadingStats || loadingUsers) {
    return <LoadingSpinner fullscreen message="Loading dashboard..." />;
  }
  
  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <StatCard title="Total Orders" value={stats?.totalOrders} />
        <StatCard title="Active Drivers" value={stats?.activeDrivers} />
        <StatCard title="Total Revenue" value={stats?.totalRevenue} />
      </div>
      
      <div className="recent-users">
        <h2>Recent Users</h2>
        {users?.users?.map(user => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;
```
