<?php
// Enable error reporting for development (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set content type and CORS headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Configuration
$config = [
    'email' => [
        'to' => 'fidelmwaro@gmail.com', // Replace with your email
        'from' => 'info@melford-international.com', // Replace with your domain
        'subject_prefix' => '[Melford International] ',
        'admin_name' => 'Melford International Team'
    ],
    'database' => [
        'enabled' => false, // Set to true if you want to store submissions in database
        'host' => 'localhost',
        'username' => 'your_db_user',
        'password' => 'your_db_password',
        'database' => 'your_database_name'
    ],
    'security' => [
        'rate_limit' => true,
        'max_submissions_per_hour' => 5,
        'honeypot_enabled' => true
    ]
];

// Response function
function sendResponse($success, $message, $data = null) {
    http_response_code($success ? 200 : 400);
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

// Input sanitization function
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

// Email validation function
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// Phone validation function
function isValidPhone($phone) {
    // Remove all non-digit characters
    $phone = preg_replace('/[^0-9]/', '', $phone);
    // Check if it's between 10-15 digits (international format)
    return strlen($phone) >= 10 && strlen($phone) <= 15;
}

// Rate limiting function
function checkRateLimit($ip) {
    global $config;
    
    if (!$config['security']['rate_limit']) {
        return true;
    }
    
    $log_file = 'logs/submissions.log';
    $max_submissions = $config['security']['max_submissions_per_hour'];
    $time_window = 3600; // 1 hour in seconds
    
    // Create logs directory if it doesn't exist
    if (!file_exists('logs')) {
        mkdir('logs', 0755, true);
    }
    
    // Read existing log
    $submissions = [];
    if (file_exists($log_file)) {
        $log_content = file_get_contents($log_file);
        $submissions = json_decode($log_content, true) ?: [];
    }
    
    // Clean old entries
    $current_time = time();
    $submissions = array_filter($submissions, function($entry) use ($current_time, $time_window) {
        return ($current_time - $entry['time']) < $time_window;
    });
    
    // Count submissions from this IP
    $ip_submissions = array_filter($submissions, function($entry) use ($ip) {
        return $entry['ip'] === $ip;
    });
    
    if (count($ip_submissions) >= $max_submissions) {
        return false;
    }
    
    // Log this submission
    $submissions[] = [
        'ip' => $ip,
        'time' => $current_time
    ];
    
    // Save log
    file_put_contents($log_file, json_encode($submissions));
    
    return true;
}

// Database storage function
function storeInDatabase($data) {
    global $config;
    
    if (!$config['database']['enabled']) {
        return true;
    }
    
    try {
        $pdo = new PDO(
            "mysql:host={$config['database']['host']};dbname={$config['database']['database']}",
            $config['database']['username'],
            $config['database']['password'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        
        $sql = "INSERT INTO contact_submissions (first_name, last_name, email, phone, subject, message, ip_address, user_agent, created_at) 
                VALUES (:first_name, :last_name, :email, :phone, :subject, :message, :ip_address, :user_agent, NOW())";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute([
            ':first_name' => $data['first_name'],
            ':last_name' => $data['last_name'],
            ':email' => $data['email'],
            ':phone' => $data['phone'],
            ':subject' => $data['subject'],
            ':message' => $data['message'],
            ':ip_address' => $_SERVER['REMOTE_ADDR'],
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown'
        ]);
        
        return $result;
        
    } catch (PDOException $e) {
        error_log("Database error: " . $e->getMessage());
        return false;
    }
}

// Email sending function
function sendEmail($data) {
    global $config;
    
    $to = $config['email']['to'];
    $from = $config['email']['from'];
    $subject = $config['email']['subject_prefix'] . $data['subject'];
    
    // Email template
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #667eea; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-left: 10px; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>Name:</span>
                    <span class='value'>{$data['first_name']} {$data['last_name']}</span>
                </div>
                <div class='field'>
                    <span class='label'>Email:</span>
                    <span class='value'>{$data['email']}</span>
                </div>
                <div class='field'>
                    <span class='label'>Phone:</span>
                    <span class='value'>" . (!empty($data['phone']) ? $data['phone'] : 'Not provided') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>Subject:</span>
                    <span class='value'>{$data['subject']}</span>
                </div>
                <div class='field'>
                    <span class='label'>Message:</span>
                    <div style='margin-left: 10px; padding: 10px; background-color: white; border-left: 3px solid #667eea;'>
                        " . nl2br($data['message']) . "
                    </div>
                </div>
                <div class='field'>
                    <span class='label'>Submitted:</span>
                    <span class='value'>" . date('Y-m-d H:i:s') . "</span>
                </div>
                <div class='field'>
                    <span class='label'>IP Address:</span>
                    <span class='value'>{$_SERVER['REMOTE_ADDR']}</span>
                </div>
            </div>
            <div class='footer'>
                <p>This email was sent from the Melford International contact form.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Headers for HTML email
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        "From: {$config['email']['admin_name']} <{$from}>",
        "Reply-To: {$data['first_name']} {$data['last_name']} <{$data['email']}>",
        'X-Mailer: PHP/' . phpversion()
    ];
    
    $success = mail($to, $subject, $message, implode("\r\n", $headers));
    
    if ($success) {
        // Send confirmation email to user
        sendConfirmationEmail($data);
    }
    
    return $success;
}

// Confirmation email to user
function sendConfirmationEmail($data) {
    global $config;
    
    $to = $data['email'];
    $from = $config['email']['from'];
    $subject = "Thank you for contacting Melford International";
    
    $message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #667eea; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Thank You for Your Message</h2>
            </div>
            <div class='content'>
                <p>Dear {$data['first_name']},</p>
                <p>Thank you for contacting Melford International. We have received your message and will get back to you within 24 hours.</p>
                <p><strong>Your message summary:</strong></p>
                <p><strong>Subject:</strong> {$data['subject']}</p>
                <p><strong>Message:</strong><br>" . nl2br($data['message']) . "</p>
                <p>If you have any urgent questions, please don't hesitate to call us directly.</p>
                <p>Best regards,<br>The Melford International Team</p>
            </div>
            <div class='footer'>
                <p>This is an automated confirmation email. Please do not reply to this message.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        "From: {$config['email']['admin_name']} <{$from}>",
        'X-Mailer: PHP/' . phpversion()
    ];
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

// Main processing logic
try {
    // Only allow POST requests
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendResponse(false, 'Only POST requests are allowed');
    }
    
    // Check rate limiting
    $ip = $_SERVER['REMOTE_ADDR'];
    if (!checkRateLimit($ip)) {
        sendResponse(false, 'Too many submissions. Please try again later.');
    }
    
    // Get form data
    $first_name = sanitizeInput($_POST['first_name'] ?? '');
    $last_name = sanitizeInput($_POST['last_name'] ?? '');
    $email = sanitizeInput($_POST['email'] ?? '');
    $phone = sanitizeInput($_POST['phone'] ?? '');
    $subject = sanitizeInput($_POST['subject'] ?? '');
    $message = sanitizeInput($_POST['message'] ?? '');
    $privacy_consent = isset($_POST['privacy_consent']);
    
    // Honeypot check (add a hidden field named 'website' to your form)
    if ($config['security']['honeypot_enabled'] && !empty($_POST['website'])) {
        sendResponse(false, 'Spam detected');
    }
    
    // Validation
    $errors = [];
    
    if (empty($first_name)) {
        $errors[] = 'First name is required';
    }
    
    if (empty($last_name)) {
        $errors[] = 'Last name is required';
    }
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!isValidEmail($email)) {
        $errors[] = 'Please enter a valid email address';
    }
    
    if (!empty($phone) && !isValidPhone($phone)) {
        $errors[] = 'Please enter a valid phone number';
    }
    
    if (empty($subject)) {
        $errors[] = 'Subject is required';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    } elseif (strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters long';
    }
    
    if (!$privacy_consent) {
        $errors[] = 'You must agree to the Privacy Policy and Terms of Service';
    }
    
    // Check for common spam patterns
    $spam_patterns = [
        '/\b(viagra|cialis|loan|casino|poker)\b/i',
        '/\b(make money|work from home|get rich)\b/i',
        '/http[s]?:\/\/[^\s]+\.[^\s]+/i' // URLs in message
    ];
    
    foreach ($spam_patterns as $pattern) {
        if (preg_match($pattern, $message)) {
            $errors[] = 'Message contains prohibited content';
            break;
        }
    }
    
    if (!empty($errors)) {
        sendResponse(false, 'Validation failed', ['errors' => $errors]);
    }
    
    // Prepare data array
    $data = [
        'first_name' => $first_name,
        'last_name' => $last_name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message
    ];
    
    // Store in database (if enabled)
    if ($config['database']['enabled']) {
        if (!storeInDatabase($data)) {
            error_log("Failed to store contact form submission in database");
            // Continue anyway - don't fail the whole process
        }
    }
    
    // Send email
    if (sendEmail($data)) {
        sendResponse(true, 'Thank you for your message! We\'ll get back to you within 24 hours.');
    } else {
        error_log("Failed to send contact form email");
        sendResponse(false, 'Sorry, there was an error sending your message. Please try again later.');
    }
    
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    sendResponse(false, 'An unexpected error occurred. Please try again later.');
}
?>