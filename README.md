# Smart Parking Management System

A modern, real-time parking management system built with Next.js, featuring IoT sensor integration, live booking status, and comprehensive admin controls.

## Features

### 🚗 For Drivers
- **Real-time Parking Map**: Interactive map showing available parking slots
- **Live Booking Status**: Real-time updates on parking availability
- **Easy Booking**: Quick and intuitive slot reservation
- **Booking History**: Track all your past and current bookings
- **Payment Integration**: Secure payment processing

### 👨‍💼 For Admins
- **Real-time Dashboard**: Monitor all parking slots and bookings in real-time
- **Slot Management**: Create, update, and manage parking slots
- **Analytics**: Track occupancy rates and revenue
- **Sensor Integration**: IoT sensor data for automated slot detection
- **Notifications**: Automated alerts and notifications

### 🌟 Key Capabilities
- **Real-time Updates**: WebSocket-based live data synchronization
- **IoT Integration**: Automated parking detection via sensors
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Built-in theme switching
- **Analytics Dashboard**: Comprehensive reporting and insights

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Database**: MongoDB
- **UI Components**: Radix UI + Custom Components
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js & React Leaflet
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Custom WebSocket service
- **Themes**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- MongoDB database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd OOM-Mini-project
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Initialize the database (optional):
```bash
# Run the database initialization script if needed
node scripts/init-database.sql
```

5. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── admin/               # Admin dashboard pages
│   ├── api/                 # API routes
│   │   ├── analytics/       # Analytics endpoints
│   │   ├── bookings/        # Booking management
│   │   ├── notifications/   # Notification system
│   │   ├── payments/        # Payment processing
│   │   ├── realtime/        # WebSocket endpoints
│   │   ├── sensors/         # IoT sensor data
│   │   └── slots/           # Slot management
│   ├── bookings/            # Booking pages
│   ├── driver/              # Driver dashboard
│   └── payments/            # Payment pages
├── components/              # React components
│   ├── admin/               # Admin-specific components
│   ├── driver/              # Driver-specific components
│   ├── home/                # Landing page components
│   └── ui/                  # Reusable UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility libraries
│   ├── db.ts               # Database utilities
│   ├── iot-simulator.ts    # IoT sensor simulation
│   ├── mongo.ts            # MongoDB client
│   ├── realtime-service.ts # Real-time data service
│   └── sensor-service.ts   # Sensor management
├── public/                  # Static assets
└── styles/                  # Global styles
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## API Routes

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/[id]` - Get booking details
- `PUT /api/bookings/[id]` - Update booking
- `DELETE /api/bookings/[id]` - Cancel booking

### Slots
- `GET /api/slots` - List all parking slots
- `POST /api/slots` - Create new slot (admin)
- `PUT /api/slots/[id]` - Update slot (admin)
- `DELETE /api/slots/[id]` - Delete slot (admin)

### Real-time
- `GET /api/realtime` - WebSocket endpoint for live updates

### Analytics
- `GET /api/analytics` - Get system analytics

### Sensors
- `GET /api/sensors` - Get sensor data
- `POST /api/sensors` - Update sensor readings

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/history` - Payment history

## Features in Detail

### Real-time Updates
The system uses WebSocket connections to provide instant updates on:
- Parking slot availability
- Booking status changes
- Sensor readings
- System notifications

### IoT Sensor Integration
- Automatic detection of vehicle presence
- Real-time slot occupancy monitoring
- Sensor health monitoring
- Automated alerts for sensor failures

### Admin Dashboard
- Live occupancy monitoring
- Revenue tracking
- Booking management
- Slot configuration
- User management
- System analytics

### Driver Interface
- Interactive parking map
- Real-time availability
- Quick booking process
- Booking history
- Payment management

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


