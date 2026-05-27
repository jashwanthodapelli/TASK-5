<?php
declare(strict_types=1);

session_start();

$dataDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'assets';
$userFile = $dataDir . DIRECTORY_SEPARATOR . 'users.json';

if (!is_dir($dataDir)) {
    mkdir($dataDir, 0775, true);
}

if (!file_exists($userFile)) {
    file_put_contents($userFile, json_encode([
        [
            'id' => 1,
            'name' => 'Demo Admin',
            'email' => 'admin@smartcart.dev',
            'password' => password_hash('admin123', PASSWORD_DEFAULT),
            'role' => 'admin',
            'created_at' => date('c')
        ]
    ], JSON_PRETTY_PRINT));
}

function all_users(): array
{
    global $userFile;
    $contents = file_get_contents($userFile);
    $users = json_decode($contents ?: '[]', true);
    return is_array($users) ? $users : [];
}

function save_users(array $users): void
{
    global $userFile;
    file_put_contents($userFile, json_encode(array_values($users), JSON_PRETTY_PRINT));
}

function find_user_by_email(string $email): ?array
{
    foreach (all_users() as $user) {
        if (strtolower($user['email']) === strtolower($email)) {
            return $user;
        }
    }
    return null;
}

function redirect_with_status(string $path, string $status, string $message): void
{
    $_SESSION['flash'] = ['status' => $status, 'message' => $message];
    $separator = str_contains($path, '?') ? '&' : '?';
    header('Location: ' . $path . $separator . http_build_query([
        'status' => $status,
        'message' => $message
    ]));
    exit;
}
?>
