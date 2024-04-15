<?
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class MyPhpMailer
{


    function sendEmail($recipientEmail, $subject, $body)
    {

        // Create a new PHPMailer instance
        $mailer = new PHPMailer();

        // Setup SMTP configuration
        $mailer->SMTPDebug = SMTP::DEBUG_OFF;
        $mailer->isSMTP();
        $mailer->Host = 'smtp.gmail.com';
        $mailer->SMTPAuth = true;
        $mailer->Username = 'capycodes@gmail.com';
        $mailer->Password = 'hxsw ncah agna fchx';
        $mailer->SMTPSecure = 'tls';
        $mailer->Port = 587;

        // Setup email content
        $mailer->setFrom('capycodes@gmail.com', 'CapiCODEs');
        $mailer->addAddress($recipientEmail);
        $mailer->Subject = $subject;
        $mailer->Body = $body;

        // Send the email
        $mailer->send();

    }
    function sendConfirmationEmail($email, $urgent)
    {

        //cooldown di 5 minuti
        $cooldown = 300;

        // Verifica se è passato meno di 5 minuti dall'ultimo invio (se urgent = true skippa il controllo)
        if (!$urgent && isset($_SESSION['last_email']) && time() - $_SESSION['last_email'] < $cooldown) {
            return;
        }

        // Invia l'email di conferma
        $subject = 'Conferma email';
        $body = "Il tuo codice di conferma è: " . DbStore::GenerateOTP($email);

        $this->sendEmail($email, $subject, $body);

        // Salva l'ora dell'ultimo invio
        $_SESSION['last_email'] = time();
    }
}

?>