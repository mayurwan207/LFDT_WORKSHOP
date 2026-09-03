const supabase = require('../config/supabaseClient');

const getEvents = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`*, organizer:users(name)`);

    if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const { data: event, error } = await supabase
      .from('events')
      .select(`*, organizer:users(name)`)
      .eq('id', id)
      .single();

    if (error) return res.status(404).json({ error: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue, max_capacity } = req.body;
    
    const { data: newEvent, error } = await supabase
      .from('events')
      .insert([
        {
          title,
          description,
          date,
          venue,
          max_capacity,
          organizer_id: req.userId
        }
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: 'Event created successfully', event: newEvent[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, venue, max_capacity } = req.body;

    // Check ownership
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.organizer_id !== req.userId) {
      return res.status(403).json({ error: 'You do not have permission to edit this event' });
    }

    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({ title, description, date, venue, max_capacity })
      .eq('id', id)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user owns the event
    const { data: event } = await supabase
      .from('events')
      .select('organizer_id')
      .eq('id', id)
      .single();

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.organizer_id !== req.userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this event' });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) return res.status(400).json({ error: error.message });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
