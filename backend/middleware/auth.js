const supabase = require('../config/supabaseClient');

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  const tokenValue = token.split(' ')[1] || token;

  // Verify JWT using Supabase Auth
  const { data: { user }, error } = await supabase.auth.getUser(tokenValue);
  
  if (error || !user) {
    return res.status(401).json({ error: 'Unauthorized!' });
  }

  req.userId = user.id;
  
  // Fetch user role from our custom users table
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  req.userRole = profile?.role || 'NORMAL_VIEWER';
  next();
};

const isHeadUser = (req, res, next) => {
  if (req.userRole !== 'HEAD_USER') {
    return res.status(403).json({ error: 'Requires Head User Role!' });
  }
  next();
};

const isNormalViewer = (req, res, next) => {
  if (req.userRole !== 'NORMAL_VIEWER') {
    return res.status(403).json({ error: 'Requires Normal Viewer Role!' });
  }
  next();
};

module.exports = {
  verifyToken,
  isHeadUser,
  isNormalViewer
};
