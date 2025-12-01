import { Client } from 'pg';

const DATABASE_URL = process.env.DATABASE_URL;

function getClient() {
  if (!DATABASE_URL) throw new Error('DATABASE_URL not configured');
  return new Client({ connectionString: DATABASE_URL });
}

// Get user by Supabase auth ID
export async function getUserByAuthId(authId) {
  let client;
  try {
    client = getClient();
    await client.connect();
    const result = await client.query(
      `SELECT u.*, r.name as role_name, r.permissions 
       FROM rbac_users u 
       LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.email = $1 AND u.is_active = true`,
      [authId]
    );
    await client.end();
    return result.rows[0] || null;
  } catch (err) {
    if (client) try { await client.end(); } catch {}
    console.error('Get user error:', err);
    return null;
  }
}

// Check if user has permission
export function hasPermission(user, permission) {
  if (!user || !user.permissions) return false;
  const permissions = Array.isArray(user.permissions) 
    ? user.permissions 
    : JSON.parse(user.permissions || '[]');
  return permissions.includes(permission);
}

// Check if user has any of the permissions
export function hasAnyPermission(user, permissionsList) {
  return permissionsList.some(perm => hasPermission(user, perm));
}

// Middleware to require authentication
export function requireAuth(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  req.userId = userId;
  next();
}

// Middleware to require specific permission
export function requirePermission(permission) {
  return async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await getUserByAuthId(userId);
    if (!user) {
      return res.status(403).json({ error: 'User not found or inactive' });
    }

    if (!hasPermission(user, permission)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permission 
      });
    }

    req.user = user;
    next();
  };
}

// Middleware to require any of the permissions
export function requireAnyPermission(permissions) {
  return async (req, res, next) => {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await getUserByAuthId(userId);
    if (!user) {
      return res.status(403).json({ error: 'User not found or inactive' });
    }

    if (!hasAnyPermission(user, permissions)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        required: permissions 
      });
    }

    req.user = user;
    next();
  };
}

// Log user action
export async function logAction(userId, action, resource, details, ipAddress) {
  let client;
  try {
    client = getClient();
    await client.connect();
    await client.query(
      'INSERT INTO audit_logs (user_id, action, resource, details, ip_address) VALUES ($1, $2, $3, $4, $5)',
      [userId, action, resource, JSON.stringify(details || {}), ipAddress]
    );
    await client.end();
  } catch (err) {
    if (client) try { await client.end(); } catch {}
    console.error('Log action error:', err);
  }
}
