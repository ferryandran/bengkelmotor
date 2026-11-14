-- schema.sql : jalankan di MySQL (phpMyAdmin / CLI) sebelum pakai aplikasi
CREATE DATABASE IF NOT EXISTS perot_motor CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE perot_motor;

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  wa VARCHAR(30),
  motor VARCHAR(100),
  layanan VARCHAR(100),
  tanggal VARCHAR(20),
  jam VARCHAR(10),
  keluhan TEXT,
  status VARCHAR(30) DEFAULT 'Menunggu',
  created_at VARCHAR(40)
);

CREATE TABLE IF NOT EXISTS spareparts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  kategori VARCHAR(100),
  stok INT DEFAULT 0,
  harga INT DEFAULT 0,
  deskripsi TEXT,
  created_at VARCHAR(40)
);
