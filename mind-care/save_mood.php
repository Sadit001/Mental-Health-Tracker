<?php
require_once 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mood = trim($_POST['mood'] ?? '');
    $note = trim($_POST['note'] ?? ''); // Optional: user can add a note about their mood
    if (empty($mood)) {
        echo json_encode(['success' => false, 'message' => 'Mood is required.']);
        exit();
    }
    $user_id = $_SESSION['user_id'];
    $stmt = $pdo->prepare('INSERT INTO mood_entries (user_id, mood, note, created_at) VALUES (?, ?, ?, NOW())');
    if ($stmt->execute([$user_id, $mood, $note])) {
        echo json_encode(['success' => true, 'message' => 'Mood saved.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save mood.']);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid request.']);
exit();
