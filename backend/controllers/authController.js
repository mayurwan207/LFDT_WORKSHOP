const supabase = require('../config/supabaseClient');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // 2. Insert into our custom users table
    const { error: profileError } = await supabase
      .from('users')
      .insert([
        { 
          id: authData.user.id, 
          name, 
          email, 
          role: role || 'NORMAL_VIEWER' 
        }
      ]);

    if (profileError) return res.status(400).json({ error: profileError.message });

    res.status(201).json({ message: 'User registered successfully!', user: authData.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: error.message });

    // Fetch role
    const { data: profile } = await supabase
      .from('users')
      .select('name, role')
      .eq('id', data.user.id)
      .single();

    res.status(200).json({
      id: data.user.id,
      name: profile?.name,
      email: data.user.email,
      role: profile?.role,
      accessToken: data.session.access_token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { register, login };
