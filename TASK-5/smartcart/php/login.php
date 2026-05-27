<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_status('../login.html', 'error', 'Invalid request method.');
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$user = find_user_by_email($email);

if (!$user || !password_verify($password, $user['password'])) {
    redirect_with_status('../login.html', 'error', 'Invalid email or password.');
}

session_regenerate_id(true);
$_SESSION['user'] = [
    'name' => $user['name'],
    'email' => $user['email'],
    'role' => $user['role'] ?? 'customer'
];

redirect_with_status(($user['role'] ?? '') === 'admin' ? 'admin.php' : '../index.html', 'success', 'Logged in successfully.');
?>
