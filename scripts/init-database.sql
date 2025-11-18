-- Parking Lots Table
CREATE TABLE IF NOT EXISTS parking_lots (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  total_slots INT NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  operating_hours_start TIME DEFAULT '00:00:00',
  operating_hours_end TIME DEFAULT '23:59:59',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_lot_address (address, city)
);

-- Parking Slots Table
CREATE TABLE IF NOT EXISTS parking_slots (
  id SERIAL PRIMARY KEY,
  lot_id INT NOT NULL,
  slot_number VARCHAR(50) NOT NULL,
  slot_type ENUM('standard', 'disabled', 'ev_charging', 'compact') DEFAULT 'standard',
  status ENUM('available', 'booked', 'maintenance', 'reserved') DEFAULT 'available',
  occupancy_status ENUM('empty', 'occupied') DEFAULT 'empty',
  current_occupant_vehicle_id VARCHAR(100),
  last_sensor_update TIMESTAMP,
  sensor_id VARCHAR(100) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES parking_lots(id),
  UNIQUE KEY unique_slot_per_lot (lot_id, slot_number),
  KEY idx_lot_status (lot_id, status),
  KEY idx_occupancy (occupancy_status)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  user_type ENUM('driver', 'admin', 'superadmin') DEFAULT 'driver',
  vehicle_number VARCHAR(50),
  vehicle_type VARCHAR(50),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_email (email),
  KEY idx_user_type (user_type)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  slot_id INT NOT NULL,
  lot_id INT NOT NULL,
  booking_reference VARCHAR(50) UNIQUE NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  expected_duration_minutes INT,
  booking_status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
  vehicle_number VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (slot_id) REFERENCES parking_slots(id),
  FOREIGN KEY (lot_id) REFERENCES parking_lots(id),
  KEY idx_user_bookings (user_id, created_at),
  KEY idx_slot_bookings (slot_id),
  KEY idx_booking_status (booking_status),
  KEY idx_start_time (start_time)
);

-- IoT Sensor Logs Table
CREATE TABLE IF NOT EXISTS sensor_logs (
  id SERIAL PRIMARY KEY,
  sensor_id VARCHAR(100) NOT NULL,
  slot_id INT NOT NULL,
  lot_id INT NOT NULL,
  occupancy_status ENUM('empty', 'occupied') NOT NULL,
  sensor_reading DECIMAL(10, 2),
  signal_strength INT,
  temperature DECIMAL(5, 2),
  battery_level INT,
  error_status VARCHAR(255),
  log_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (slot_id) REFERENCES parking_slots(id),
  FOREIGN KEY (lot_id) REFERENCES parking_lots(id),
  KEY idx_sensor_id (sensor_id),
  KEY idx_lot_slot (lot_id, slot_id),
  KEY idx_timestamp (log_timestamp)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  booking_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method ENUM('credit_card', 'debit_card', 'digital_wallet', 'monthly_pass') DEFAULT 'credit_card',
  transaction_id VARCHAR(100) UNIQUE,
  payment_gateway_response JSON,
  status ENUM('pending', 'success', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  KEY idx_user_payments (user_id),
  KEY idx_booking_payment (booking_id)
);

-- Analytics Table
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  lot_id INT NOT NULL,
  date DATE NOT NULL,
  total_bookings INT DEFAULT 0,
  total_revenue DECIMAL(10, 2) DEFAULT 0,
  average_occupancy DECIMAL(5, 2) DEFAULT 0,
  peak_hours VARCHAR(255),
  vehicle_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lot_id) REFERENCES parking_lots(id),
  UNIQUE KEY unique_lot_date (lot_id, date),
  KEY idx_date (date)
);

-- Create indexes for better performance
CREATE INDEX idx_parking_slots_lot ON parking_slots(lot_id);
CREATE INDEX idx_bookings_slot ON bookings(slot_id);
CREATE INDEX idx_sensor_logs_slot ON sensor_logs(slot_id);
