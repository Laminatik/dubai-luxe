const express = require('express');
const fs = require('fs');
const path = require('path');
const { sendReservationEmail } = require('../services/mailgun');

const router = express.Router();

// Load apartments data
const apartmentsPath = path.join(__dirname, '../data/apartments.json');
const apartmentsData = JSON.parse(fs.readFileSync(apartmentsPath, 'utf8'));

// GET /api/apartments
router.get('/apartments', (req, res) => {
  try {
    res.json(apartmentsData);
  } catch (error) {
    console.error('Error fetching apartments:', error);
    res.status(500).json({ error: 'Failed to fetch apartments' });
  }
});

// GET /api/apartments/:slug
router.get('/apartments/:slug', (req, res) => {
  try {
    const apartment = apartmentsData.find(apt => apt.slug === req.params.slug);
    
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }
    
    res.json(apartment);
  } catch (error) {
    console.error('Error fetching apartment:', error);
    res.status(500).json({ error: 'Failed to fetch apartment' });
  }
});

// POST /api/reservations
router.post('/reservations', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      arrivalDate,
      departureDate,
      guests,
      notes,
      apartmentId
    } = req.body;

    // Basic validation
    if (!fullName || !email || !arrivalDate || !departureDate || !apartmentId) {
      return res.status(400).json({ 
        error: 'Missing required fields: fullName, email, arrivalDate, departureDate, apartmentId' 
      });
    }

    // Find apartment details
    const apartment = apartmentsData.find(apt => apt.id === apartmentId);
    if (!apartment) {
      return res.status(404).json({ error: 'Apartment not found' });
    }

    // Prepare reservation data
    const reservationData = {
      fullName,
      email,
      phone: phone || '',
      arrivalDate,
      departureDate,
      guests: guests || 1,
      notes: notes || '',
      apartment,
      submittedAt: new Date().toISOString()
    };

    // Send email via Mailgun
    await sendReservationEmail(reservationData);

    res.json({ ok: true, message: 'Reservation submitted successfully' });

  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ 
      error: 'Failed to submit reservation. Please try again.' 
    });
  }
});

module.exports = router;