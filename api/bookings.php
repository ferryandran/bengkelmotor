<?php
// api/bookings.php
require __DIR__ . '/config.php';
$pdo = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM bookings ORDER BY id DESC');
    respond($stmt->fetchAll());
}

if ($method === 'POST') {
    $d = json_input();
    $stmt = $pdo->prepare('INSERT INTO bookings (nama, wa, motor, layanan, tanggal, jam, keluhan, status, created_at) VALUES (?,?,?,?,?,?,?,?,?)');
    $stmt->execute([
        trim($d['nama'] ?? ''),
        trim($d['wa'] ?? ''),
        trim($d['motor'] ?? ''),
        trim($d['layanan'] ?? ''),
        trim($d['tanggal'] ?? ''),
        trim($d['jam'] ?? ''),
        trim($d['keluhan'] ?? ''),
        trim($d['status'] ?? 'Menunggu'),
        date('c'),
    ]);
    respond(['id' => (int)$pdo->lastInsertId(), 'ok' => true], 201);
}

if ($method === 'PATCH' || $method === 'PUT') {
    $id = $_GET['id'] ?? null;
    if (!$id) respond(['error' => 'missing id'], 400);
    $d = json_input();
    $stmt = $pdo->prepare('UPDATE bookings SET status = ? WHERE id = ?');
    $stmt->execute([trim($d['status'] ?? 'Menunggu'), $id]);
    respond(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) respond(['error' => 'missing id'], 400);
    $stmt = $pdo->prepare('DELETE FROM bookings WHERE id = ?');
    $stmt->execute([$id]);
    respond(['ok' => true]);
}

respond(['error' => 'method not allowed'], 405);
