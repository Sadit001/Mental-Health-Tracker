<?php
require_once 'db.php';
session_start();

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = trim($_POST['title'] ?? '');
    $mood = trim($_POST['mood'] ?? '');
    $content = trim($_POST['content'] ?? '');
    if (empty($title) || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Title and content are required.']);
        exit();
    }
    $user_id = $_SESSION['user_id'];
    // Insert into journal_entries (add columns as needed)
    $stmt = $pdo->prepare('INSERT INTO journal_entries (user_id, title, mood, content, created_at) VALUES (?, ?, ?, ?, NOW())');
    if ($stmt->execute([$user_id, $title, $mood, $content])) {
        echo json_encode(['success' => true, 'message' => 'Journal entry saved.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to save entry.']);
    }
    exit();
}

echo json_encode(['success' => false, 'message' => 'Invalid request.']);
exit();
