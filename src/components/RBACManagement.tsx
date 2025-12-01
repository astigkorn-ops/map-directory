import { useState, useEffect } from 'react';
import { Users, Shield, Activity, Plus, Edit2, Trash2, Check, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

interface User {
  id: number;
  email: string;
  name: string;
  role_id: number;
  role_name: string;
  is_active: boolean;
  last_login: string;
  created_at: string;
}

interface AuditLog {
  id: number;
  user_name: string;
  user_email: string;
  action: string;
  resource: string;
  details: any;
  ip_address: string;
  created_at: string;
}

export default function RBACManagement() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'roles' | 'audit'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  const [userForm, setUserForm] = useState({ email: '', name: '', role_id: 0 });
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] as string[] });

  const availablePermissions = [
    'manage_pages', 'manage_files', 'manage_settings', 'manage_users', 
    'manage_roles', 'view_audit_logs', 'manage_map_pages', 'delete_resources',
    'upload_files', 'edit_own_content', 'view_pages', 'view_files', 'view_map_pages'
  ];

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = { 'x-user-id': user?.email || '' };
      
      if (activeTab === 'users') {
        const res = await fetch('/api/rbac/users', { headers });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
        }
      } else if (activeTab === 'roles') {
        const res = await fetch('/api/rbac/roles', { headers });
        if (res.ok) {
          const data = await res.json();
          setRoles(data.roles || []);
        }
      } else if (activeTab === 'audit') {
        const res = await fetch('/api/rbac/audit-logs', { headers });
        if (res.ok) {
          const data = await res.json();
          setAuditLogs(data.logs || []);
        }
      }
      
      // Always load roles for the user form dropdown
      const rolesRes = await fetch('/api/rbac/roles', { headers });
      if (rolesRes.ok) {
        const data = await rolesRes.json();
        setRoles(data.roles || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const res = await fetch('/api/rbac/users', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.email || ''
        },
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        setShowUserForm(false);
        setUserForm({ email: '', name: '', role_id: 0 });
        loadData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    }
  };

  const handleUpdateUser = async (userId: number, updates: any) => {
    try {
      const res = await fetch(`/api/rbac/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.email || ''
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        loadData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    }
  };

  const handleCreateRole = async () => {
    try {
      const res = await fetch('/api/rbac/roles', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': user?.email || ''
        },
        body: JSON.stringify(roleForm)
      });
      if (res.ok) {
        setShowRoleForm(false);
        setRoleForm({ name: '', description: '', permissions: [] });
        loadData();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create role');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role');
    }
  };

  const togglePermission = (perm: string) => {
    setRoleForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter(p => p !== perm)
        : [...prev.permissions, perm]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === 'users' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          }`}
        >
          <Users size={18} />
          Users
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === 'roles' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          }`}
        >
          <Shield size={18} />
          Roles
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
            activeTab === 'audit' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
          }`}
        >
          <Activity size={18} />
          Audit Log
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X size={18} /></button>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">User Management</h3>
            <button
              onClick={() => setShowUserForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Add User
            </button>
          </div>

          {showUserForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-bold mb-4">Create New User</h4>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={e => setUserForm({...userForm, email: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={userForm.name}
                  onChange={e => setUserForm({...userForm, name: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <select
                  value={userForm.role_id}
                  onChange={e => setUserForm({...userForm, role_id: parseInt(e.target.value)})}
                  className="px-3 py-2 border rounded"
                >
                  <option value={0}>Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleCreateUser} className="px-4 py-2 bg-green-500 text-white rounded">Create</button>
                <button onClick={() => setShowUserForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              </div>
            </div>
          )}

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {u.role_name || 'No Role'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${u.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleUpdateUser(u.id, { is_active: !u.is_active })}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Role Management</h3>
            <button
              onClick={() => setShowRoleForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2"
            >
              <Plus size={18} />
              Add Role
            </button>
          </div>

          {showRoleForm && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h4 className="font-bold mb-4">Create New Role</h4>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Role Name"
                  value={roleForm.name}
                  onChange={e => setRoleForm({...roleForm, name: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                />
                <textarea
                  placeholder="Description"
                  value={roleForm.description}
                  onChange={e => setRoleForm({...roleForm, description: e.target.value})}
                  className="w-full px-3 py-2 border rounded"
                  rows={2}
                />
                <div>
                  <p className="font-semibold mb-2">Permissions:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availablePermissions.map(perm => (
                      <label key={perm} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={roleForm.permissions.includes(perm)}
                          onChange={() => togglePermission(perm)}
                        />
                        <span className="text-sm">{perm.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={handleCreateRole} className="px-4 py-2 bg-green-500 text-white rounded">Create</button>
                <button onClick={() => setShowRoleForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map(role => (
              <div key={role.id} className="border rounded-lg p-4">
                <h4 className="font-bold text-lg mb-2">{role.name}</h4>
                <p className="text-gray-600 text-sm mb-3">{role.description}</p>
                <div className="flex flex-wrap gap-1">
                  {(Array.isArray(role.permissions) ? role.permissions : JSON.parse(role.permissions || '[]')).map((perm: string) => (
                    <span key={perm} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {perm.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold mb-6">Audit Log</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Resource</th>
                  <th className="px-4 py-3 text-left">IP</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map(log => (
                  <tr key={log.id} className="border-t">
                    <td className="px-4 py-3">{new Date(log.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3">{log.user_name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">{log.resource}</td>
                    <td className="px-4 py-3 text-gray-500">{log.ip_address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
