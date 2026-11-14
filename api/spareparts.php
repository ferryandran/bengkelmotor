<?php
// api/spareparts.php
require __DIR__ . '/config.php';
$pdo = db();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query('SELECT * FROM spareparts ORDER BY id DESC');
    respond($stmt->fetchAll());
}

if ($method === 'POST') {
    $d = json_input();
    $stmt = $pdo->prepare('INSERT INTO spareparts (nama, kategori, stok, harga, deskripsi, created_at) VALUES (?,?,?,?,?,?)');
    $stmt->execute([
        trim($d['nama'] ?? ''),
        trim($d['kategori'] ?? ''),
        (int)($d['stok'] ?? 0),
        (int)($d['harga'] ?? 0),
        trim($d['deskripsi'] ?? ''),
        date('c'),
    ]);
    respond(['id' => (int)$pdo->lastInsertId(), 'ok' => true], 201);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) respond(['error' => 'missing id'], 400);
    $stmt = $pdo->prepare('DELETE FROM spareparts WHERE id = ?');
    $stmt->execute([$id]);
    respond(['ok' => true]);
}

respond(['error' => 'method not allowed'], 405);
