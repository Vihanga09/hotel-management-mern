🏨 Grand Horizon - Hotel Management System

A comprehensive Full-Stack MERN application designed for efficient hotel room management and seamless user bookings. This project features automated email notifications to enhance user experience.

🚀 Key Features

    User Authentication: Secure signup and login functionality for customers.

    Room Browsing: Dynamic display of available rooms with detailed descriptions.

    Seamless Booking: Real-time room reservation system.

    Automated Notifications: Instant email confirmations sent via Nodemailer and Gmail API upon successful booking.

    Admin Dashboard: Dedicated interface for managing room inventory and tracking booking statistics.

🛠️ Tech Stack

    Frontend: React.js, Tailwind CSS

    Backend: Node.js, Express.js

    Database: MongoDB (Mongoose ODM)

    Security: JSON Web Tokens (JWT), Bcrypt, Environment Variables (dotenv)

    Emailing: Nodemailer with Gmail integration

📁 Project Structure

    /frontend: React.js client-side application.

    /backend: Express.js server, API routes, and database models.

⚙️ Local Setup Instructions
1. Clone the Repository
Bash

git clone https://github.com/Vihanga09/hotel-management-mern.git
cd hotel-management-mern

2. Install Dependencies

Backend:
Bash

cd backend
npm install

Frontend:
Bash

cd ../frontend
npm install

3. Environment Configuration

Create a .env file inside the backend/ directory and add your credentials:
Code snippet

MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_secret_key

4. Run the Application

Start Backend:
Bash

# Inside backend folder
npm start

Start Frontend:
Bash

# Inside frontend folder
npm start

Developed by Vihanga Shehan 👨‍💻

Undergraduate at SLIIT