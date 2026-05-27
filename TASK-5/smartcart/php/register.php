<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect_with_status('../signup.html', 'error', 'Invalid request method.');
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';
$confirm = $_POST['confirm_password'] ?? '';

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6 || $password !== $confirm) {
    redirect_with_status('../signup.html', 'error', 'Please check your signup details.');
}

if (find_user_by_email($email)) {
    redirect_with_status('../login.html', 'error', 'Account already exists. Please login.');
}

$users = all_users();
$users[] = [
    'id' => time(),
    'name' => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
    'email' => strtolower($email),
    'password' => password_hash($password, PASSWORD_DEFAULT),
    'role' => 'customer',
    'created_at' => date('c')
];

save_users($users);
$_SESSION['user'] = ['name' => $name, 'email' => strtolower($email), 'role' => 'customer'];
redirect_with_status('../index.html', 'success', 'Account created successfully.');
?>
