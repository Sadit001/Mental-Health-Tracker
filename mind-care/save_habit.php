<?php
require_once 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $habit = trim($_POST['habit'] ?? '');
    $status = trim($_POST['status'] ?? ''); // e.g., completed, skipped, etc.
    $note = trim($_POST['note'] ?? ''); // Optional note

    if (empty($habit) || empty($status)) {
        echo json_encode(['success' => false, 'message' => 'Habit and status are required.']);
        exit();
    }

    $user_id = $_SESSION['user_id'];
    $stmt = $pdo->prepare('INSERT INTO habit_entries (user_id, habit, status, note, created_at) VALUES (?, ?, ?, ?, NOW())');
    if ($stmt->execute([$user_id, $habit, $status, $note])) {
        echo json_encode(['success' => true, 'message' => 'Habit saved.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save habit.']);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid request.']);
exit();