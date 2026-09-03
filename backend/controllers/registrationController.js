const supabase = require('../config/supabaseClient');

const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Check if event exists and get capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('current_capacity, max_capacity')
      .eq('id', eventId)
      .single();

    if (eventError || !event) return res.status(404).json({ error: 'Event not found' });

    // Check capacity
    if (event.current_capacity >= event.max_capacity) {
      return res.status(400).json({ error: 'Event is at full capacity' });
    }

    // Register user
    const { data: registration, error: regError } = await supabase
      .from('registrations')
      .insert([{ user_id: req.userId, event_id: eventId }])
      .select();

    if (regError) return res.status(400).json({ error: regError.message });

    // Increment capacity
    await supabase
      .from('events')
      .update({ current_capacity: event.current_capacity + 1 })
      .eq('id', eventId);

    res.status(201).json({ message: 'Registered successfully', registration: registration[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventAttendees = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Verify ownership
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', eventId)
      .single();

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.organizer_id !== req.userId) {
       return res.status(403).json({ error: 'Only the organizer can view attendees' });
    }

    // Fetch registrations with user details
    const { data: attendees, error } = await supabase
      .from('registrations')
      .select(`
        id,
        status,
        user:users(id, name, email)
      `)
      .eq('event_id', eventId);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const { data: registrations, error } = await supabase
      .from('registrations')
      .select(`
        id,
        status,
        registered_at,
        event:events(id, title, date, venue)
      `)
      .eq('user_id', req.userId);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerForEvent,
  getEventAttendees,
  getMyRegistrations
};
