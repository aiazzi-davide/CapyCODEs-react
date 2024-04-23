<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ControllerPost
{
    public function postLogin(Request $request, Response $response, $args)
    {
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $username = $data['email'];
        $password = $data['password'];
        //$password = $request->getParsedBody()['password'];
        //$clientIP = $_SERVER['REMOTE_ADDR'];

        // CheckLogin ritorna l'ID dell'utente se le credenziali sono corrette
        $user_id =  Auth::CheckLogin($username, $password);

        if ($user_id) {
            // Genera un token e aggiorna il database
            $token =  DbStore::tokenUpdate($user_id);
            DbStore::sessionUpdate($token);
            $response->getBody()->write(json_encode(["message" => "Login successful"]));
            return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200); 
        } else {
            $response->getBody()->write(json_encode([
                "message" => "Invalid credentials",
                "email" => $username,
                "password" => $password]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }
    }

    public function postRegister(Request $request, Response $response, $args)
    {
        //$page = $_SERVER['HTTP_REFERER'];
        $nome = $request->getParsedBody()['nome'];
        $cognome = $request->getParsedBody()['cognome'];
        $data_nascita = $request->getParsedBody()['data_nascita'];
        $password = $request->getParsedBody()['password'];
        $username = $request->getParsedBody()['username'];
        $email = $request->getParsedBody()['email'];

        // Controllo se l'username e l'email non sono già presenti nel database
        switch (Auth::CheckRegister($username, $email)) {
            case 0:

                $token =  DbStore::storeTempUserData($nome, $cognome, $data_nascita, $password, $username, $email);
                //echo $token;
                //gestione eccezioni?
                //MyPhpMailer::sendConfirmationEmail($email, false);  // commentata per debug
                DbStore::GenerateOTP($email);                    // da commentare per non debug (genro OTP senza inviare email), otp visibilke nel db


                // salvo l'email in sessione per il controllo dell'OTP
                $_SESSION['email'] = $email;

                //salvo il token in sessione INUTILIZZATO
                $_SESSION['tokenTemp'] = $token;

                return $response
                    ->withHeader('Location', '/verify') //------------------redirecto alla pagina di verifica di react
                    ->withStatus(302);
            case 1:
                header("Location: /register?error=1"); // Username non valido
                break;
            case 2:
                header("Location: /register?error=2"); // Email non valida
                break;
        }
        exit;
    }

    public function postGoogleRegister(Request $request, Response $response, $args) //da gestire errori
    {
        $birthday = $request->getParsedBody()['birthday'];
        $password = $request->getParsedBody()['password'];

        $token = $_SESSION['tokenTemp'];

        // Registra l'utente nel database
        $user_id = DbStore::registerUser($token, ['Birthday' => $birthday, 'Password' => $password]);

        // logga l'utente
        $token =  DbStore::tokenUpdate($user_id);
        DbStore::sessionUpdate($token);
        header("Location: /home");
        exit;
    }

    public function postVerify(Request $request, Response $response, $args)
    {
        $email = $_SESSION['email'];
        $tokenTemp = $_SESSION['tokenTemp'];
        $otp = $request->getParsedBody()['otp'];

        switch (Auth::CheckOTP($email, $otp)) {
            case 0:
                $userID = DbStore::registerUser($tokenTemp, []);
                header("Location: /login"); // Codice OTP presente e valido
                break;
            case 1:
                header("Location: /verify?&error=1"); // Codice OTP non corretto
                break;
            case 2:
                header("Location: /verify?&error=2"); // Codice OTP presente ma scaduto
                break;
        }
        exit;
    }
    public function sendOTP(Request $request, Response $response, $args)
    {
        $email = $request->getParsedBody()['email'];
        if (Auth::IsUserRegistered($email)) {
            //$this->mailer->sendConfirmationEmail($email, false); // commentata per debug
            DbStore::GenerateOTP($email);  // da commentare per non debug (genro OTP senza inviare email), otp visibile nel db
            $_SESSION['resetPswEmail'] = $email;
            header("Location: /reset-password?verified=1"); //-----------------> PER IMPLEMENTAZIONE CON REACT: rendere un json con codice di stato per rirenderizzare la pagina da cui è stato chiamato con "email sent" o "error sending email"
            exit;
        } else {
            header("Location: /reset-password?verified=0");
            exit;
        }
    }

    public function postResetPassword(Request $request, Response $response, $args)
    {
        $otp = $request->getParsedBody()['otp'] ?? null;
        if ($otp) {
            $email = $_SESSION['resetPswEmail'];
            switch (Auth::CheckOTP($email, $otp)) {
                case 0:
                    DbStore::confirmOTP($email, $otp);
                    header("Location: /new-password");
                    break;
                case 1:
                    header("Location: /reset-password?error=1"); // Codice OTP non corretto
                    break;
                case 2:
                    header("Location: /reset-password?error=2"); // Codice OTP presente ma scaduto
                    break;
            }
            exit;
        }
    }

   

    public function postNewPassword(Request $request, Response $response, $args)
    {
        $email = $_SESSION['resetPswEmail'] ?? null; //email passabile anche da args[]
        $password = $request->getParsedBody()['password'] ?? null;
        if (!$email || !$password) {
            header("Location: /404");
            exit;
        }

        if (Auth::IsOTPVerified($email)) { // Controllo se l'utente ha verificato il codice OTP

            DbStore::updatePassword($email, $password);
            DbUtils::delOTP($email);
            header("Location: /login"); // Password aggiornata con successo
            //-----------------------------invio mail di sicurezza perche la password è stata cambiata--------------------------
            exit;

        } else {
            header("Location: /reset-password"); // Codice OTP non verificato
            exit;
        }
    }

    public function AddToCart(Request $request, Response $response, $args)
    {
        $game_id = $args['id_game'];
        //$platform_id = $args['id_platform'];
        $token = $_COOKIE['CapycodesTkn'] ?? null;
        if ($user_id = Auth::isTokenValid($token)) {
            DbStore::addToCart($user_id, $game_id/*, $platform_id*/);
            header("Location: /cart"); //-------------> PER IMPLEMENTAZIONE CON REACT: rendere un json con codice di stato per rirenderizzare la pagina da cui è stato chiamato con "added successfully" o "error adding to cart"
        } else {
            header("Location: /login"); //se l'utente non è loggato, lo reindirizzo alla pagina di login
        }
        exit;
    }

    public function RemoveFromCart(Request $request, Response $response, $args)
    {
        $game_id = $args['id_game'];
        $token = $_COOKIE['CapycodesTkn'] ?? null;
        if ($user_id = Auth::isTokenValid($token)) {
            DbStore::removeFromCart($user_id, $game_id);
            header("Location: /cart"); //-------------> PER IMPLEMENTAZIONE CON REACT: rendere un json con codice di stato per rirenderizzare la pagina da cui è stato chiamato con "removed successfully" o "error removing from cart"
            exit;

        } else {
            header("Location: /login");
            exit;
        }
    }
}
