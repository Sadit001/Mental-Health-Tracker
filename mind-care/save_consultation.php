<?php
require_once 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $consultant = trim($_POST['consultant'] ?? '');
    $date = trim($_POST['date'] ?? '');
    $notes = trim($_POST['notes'] ?? '');

    if (empty($consultant) || empty($date)) {
        echo json_encode(['success' => false, 'message' => 'Consultant and date are required.']);
        exit();
    }

    $user_id = $_SESSION['user_id'];
    $stmt = $pdo->prepare('INSERT INTO consultation_entries (user_id, consultant, date, notes, created_at) VALUES (?, ?, ?, ?, NOW())');
    if ($stmt->execute([$user_id, $consultant, $date, $notes])) {
        echo json_encode(['success' => true, 'message' => 'Consultation saved.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save consultation.']);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid request.']);
exit();