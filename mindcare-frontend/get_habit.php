<?php
require_once 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

$user_id = $_SESSION['user_id'];

$stmt = $pdo->prepare('SELECT id, habit, status, note, created_at FROM habit_entries WHERE user_id = ? ORDER BY created_at DESC');
$stmt->execute([$user_id]);
$habits = $stmt->fetchAll();

echo json_encode(['success' => true, 'habits' => $habits]);
exit();