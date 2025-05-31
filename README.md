# Dubai Luxe - Luxury Apartment Rental Website

## Project Structure
```
dubai-luxe/
├── README.md
├── .env.example
├── .gitignore
├── package.json (workspace root)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── index.html
│   ├── public/
│   │   ├── img/
│   │   │   ├── img1.png (place your 10 images here)
│   │   │   ├── img2.png
│   │   │   ├── ... (img3.png through img10.png)
│   │   │   └── dubai-skyline-hero.mp4 (hero video - optional)
│   │   ├── icons/
│   │   └── favicon.ico
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Header.jsx
│       │   │   └── Footer.jsx
│       │   ├── UI/
│       │   │   ├── Button.jsx
│       │   │   ├── Modal.jsx
│       │   │   ├── CustomDatePicker.jsx
│       │   │   ├── CustomSelect.jsx
│       │   │   ├── PriceRangeSlider.jsx
│       │   │   ├── LuxuryIcon.jsx
│       │   │   └── LoadingSpinner.jsx
│       │   └── Apartment/
│       │       ├── ApartmentCard.jsx
│       │       ├── ApartmentGrid.jsx
│       │       ├── ApartmentGallery.jsx
│       │       └── ReservationForm.jsx
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── About.jsx
│       │   ├── Apartments.jsx
│       │   ├── ApartmentDetails.jsx
│       │   └── ReservationSuccess.jsx
│       ├── hooks/
│       │   ├── useApi.js
│       │   └── useScrollToTop.js
│       └── utils/
│           ├── api.js
│           └── overflowUtils.js
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── routes/
│   │   └── api.js
│   ├── services/
│   │   └── mailgun.js
│   ├── data/
│   │   └── apartments.json
│   └── middleware/
│       └── rateLimiter.js
└── .env
```

## Image Placement Instructions
Place your 10 test images (img1.png through img10.png) in the `frontend/public/img/` directory. The apartments.json file is configured to reference these images.

## Setup Instructions for Windows 10/11

### 1. Prerequisites
- Install Node.js 20+ from [nodejs.org](https://nodejs.org/)
- Install Git from [git-scm.com](https://git-scm.com/)
- Use PowerShell or Command Prompt

### 2. Project Setup
```powershell
# Create project directory
mkdir dubai-luxe
cd dubai-luxe

# Initialize the project (copy all the provided files)
# Then install dependencies
npm install

# Copy environment file and configure
copy .env.example .env
# Edit .env file with your Mailgun credentials
```

### 3. Environment Configuration
Edit `.env` file with your Mailgun settings:
```
PORT=4000
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=your_mailgun_domain_here
AGENCY_INBOX=your_email@example.com
```

### 4. Development Mode
```powershell
# Terminal 1 - Backend (API server)
cd backend
npm run dev
# Server runs on http://localhost:4000

# Terminal 2 - Frontend (React app)
cd frontend  
npm run dev
# App runs on http://localhost:5173
```

### 5. Production Build & Test
```powershell
# Build frontend for production
cd frontend
npm run build

# Start production server
cd ../backend
npm start
# Access at http://localhost:4000
```

### 6. Testing the Website
1. Open http://localhost:5173 (development) or http://localhost:4000 (production)
2. Navigate through pages: Home → Apartments → Click an apartment → Submit reservation
3. Check your email inbox for reservation notifications
4. Test responsive design by resizing browser window

### 7. Key Features to Test
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Image gallery with navigation
- ✅ Reservation form submission
- ✅ Email notifications via Mailgun
- ✅ Filter functionality on apartments page
- ✅ Loading states and error handling

### 8. Troubleshooting
- If Mailgun emails don't work, check API keys in .env
- If images don't load, ensure they're in `frontend/public/img/`
- If build fails, run `npm install` in both frontend and backend directories
- For styling issues, ensure Tailwind CSS is properly configured

### 9. Customization
- Replace test images with actual apartment photos
- Update `backend/data/apartments.json` with real apartment data
- Modify color scheme in `tailwind.config.js` if needed
- Add your actual Mailgun domain and API credentials