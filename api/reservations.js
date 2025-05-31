// api/reservations.js
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const apartmentsData = [
  {
    "id": "dubai-sky-001",
    "name": "Skyline Penthouse",
    "slug": "skyline-penthouse",
    "district": "Downtown",
    "bedrooms": 3,
    "priceNight": 2200,
    "shortDesc": "Glass-walled 35th-floor penthouse with Burj Khalifa view."
  },
  {
    "id": "dubai-marina-002",
    "name": "Marina Vista",
    "slug": "marina-vista",
    "district": "Dubai Marina",
    "bedrooms": 2,
    "priceNight": 1800,
    "shortDesc": "Waterfront luxury with yacht access and panoramic marina views."
  },
  {
    "id": "burj-al-arab-003",
    "name": "Arabian Palace Suite",
    "slug": "arabian-palace-suite",
    "district": "Jumeirah",
    "bedrooms": 4,
    "priceNight": 3500,
    "shortDesc": "Opulent suite with traditional Arabian luxury and modern amenities."
  },
  {
    "id": "palm-jumeirah-004",
    "name": "Palm Beachfront Villa",
    "slug": "palm-beachfront-villa",
    "district": "Palm Jumeirah",
    "bedrooms": 5,
    "priceNight": 4200,
    "shortDesc": "Exclusive beachfront villa with private beach and infinity pool."
  },
  {
    "id": "business-bay-005",
    "name": "Corporate Tower Suite",
    "slug": "corporate-tower-suite",
    "district": "Business Bay",
    "bedrooms": 2,
    "priceNight": 1600,
    "shortDesc": "Modern executive apartment in the heart of Dubai's business district."
  },
  {
    "id": "creek-harbour-006",
    "name": "Creek Harbour Oasis",
    "slug": "creek-harbour-oasis",
    "district": "Creek Harbour",
    "bedrooms": 3,
    "priceNight": 2000,
    "shortDesc": "Serene waterfront apartment with Dubai Creek views and premium amenities."
  },
  {
    "id": "dubai-hills-007",
    "name": "Hills Garden Villa",
    "slug": "hills-garden-villa",
    "district": "Dubai Hills",
    "bedrooms": 4,
    "priceNight": 2800,
    "shortDesc": "Family-friendly luxury villa with golf course views and private garden."
  },
  {
    "id": "jbr-beach-008",
    "name": "JBR Beach Apartment",
    "slug": "jbr-beach-apartment",
    "district": "JBR",
    "bedrooms": 2,
    "priceNight": 1900,
    "shortDesc": "Beachfront apartment with direct beach access and vibrant nightlife nearby."
  }
];

const renderEmailTemplate = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
        .header { background: #000; color: #C9A351; padding: 20px; text-align: center; }
        .content { padding: 30px; background: #f9f9f9; }
        .detail { margin: 8px 0; }
        .apartment { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #C9A351; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Dubai Luxe - New Reservation Request</h1>
      </div>
      
      <div class="content">
        <h2>Guest Information</h2>
        <div class="detail"><strong>Name:</strong> ${data.fullName}</div>
        <div class="detail"><strong>Email:</strong> ${data.email}</div>
        <div class="detail"><strong>Phone:</strong> ${data.phone || 'Not provided'}</div>
        <div class="detail"><strong>Guests:</strong> ${data.guests}</div>
        
        <h2>Reservation Details</h2>
        <div class="detail"><strong>Check-in:</strong> ${data.arrivalDate}</div>
        <div class="detail"><strong>Check-out:</strong> ${data.departureDate}</div>
        <div class="detail"><strong>Notes:</strong> ${data.notes || 'No special requests'}</div>
        
        <div class="apartment">
          <h2>Requested Apartment</h2>
          <div class="detail"><strong>Name:</strong> ${data.apartment.name}</div>
          <div class="detail"><strong>District:</strong> ${data.apartment.district}</div>
          <div class="detail"><strong>Bedrooms:</strong> ${data.apartment.bedrooms}</div>
          <div class="detail"><strong>Price per night:</strong> $${data.apartment.priceNight}</div>
          <div class="detail"><strong>Description:</strong> ${data.apartment.shortDesc}</div>
        </div>
        
        <div class="detail"><strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}</div>
      </div>
      
      <div class="footer">
        <p>Dubai Luxe Apartment Rentals<br>
        Respond to this inquiry promptly to maintain service excellence.</p>
      </div>
    </body>
    </html>
  `;
};

const sendReservationEmail = async (reservationData, retries = 3) => {
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
  });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: 'Dubai Luxe <noreply@dubailuxe.com>',
        to: process.env.AGENCY_INBOX,
        subject: `New Reservation Request - ${reservationData.fullName}`,
        html: renderEmailTemplate(reservationData)
      });

      console.log('✅ Email sent successfully:', result.id);
      return result;

    } catch (error) {
      console.error(`❌ Email attempt ${attempt} failed:`, error.message);
      
      if (attempt === retries) {
        throw new Error(`Failed to send email after ${retries} attempts: ${error.message}`);
      }
      
      // Exponential backoff: 500ms × 2^(attempt-1)
      const delay = 500 * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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

    res.status(200).json({ ok: true, message: 'Reservation submitted successfully' });

  } catch (error) {
    console.error('Reservation error:', error);
    res.status(500).json({ 
      error: 'Failed to submit reservation. Please try again.' 
    });
  }
}