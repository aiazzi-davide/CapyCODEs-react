<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ControllerPost
{
    public function postLogin(Request $request, Response $response, $args) //reacted
    {
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $username = $data['email'];
        $password = $data['password'];
        //$password = $request->getParsedBody()['password'];
        //$clientIP = $_SERVER['REMOTE_ADDR'];

        if (empty($username) || empty($password)) {
            $response->getBody()->write(json_encode(["message" => "Empty fields", "status" => "401"]));
            return $response
                ->withStatus(401);
        }

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

    public function postRegister(Request $request, Response $response, $args) //reacted
    {
        //$page = $_SERVER['HTTP_REFERER'];
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $nome = $data['nome'];
        $cognome = $data['cognome'];
        $data_nascita = $data['data_nascita'];
        $password = $data['password'];
        $username = $data['username'];
        $email = $data['email'];

        if (empty($nome) || empty($cognome) || empty($data_nascita) || empty($password) || empty($username) || empty($email)) {
            $response->getBody()->write(json_encode(["message" => "Empty fields", "status" => "401"]));
            return $response
                ->withStatus(401);
        }

        // Controllo se l'username e l'email non sono già presenti nel database
        switch (Auth::CheckRegister($username, $email)) {
            case 0:

                $token =  DbStore::storeTempUserData($nome, $cognome, $data_nascita, $password, $username, $email);
                //echo $token;
                //gestione eccezioni?
                //MyPhpMailer::sendConfirmationEmail($email, false);  // commentata per debug
                DbStore::GenerateOTP($email);                    // da commentare per non debug (genro OTP senza inviare email), otp visibilke nel db


                // salvo l'email in sessione per il controllo dell'OTP
                //$_SESSION['emailOTP'] = $email;

                //salvo il token in sessione 
                //$_SESSION['tokenTemp'] = $token;

                $response->getBody()->write(json_encode(["message" => "Waiting for OTP verification", "email" => $_SESSION['emailOTP'], "status" => "200"]));
                return $response
                    ->withStatus(200);
            case 1:
                $response->getBody()->write(json_encode(["message" => "Username already in use", "status" => "401"]));
                return $response
                    ->withStatus(401);
            case 2:
                $response->getBody()->write(json_encode(["message" => "Email already in use", "status" => "401"]));
                return $response
                    ->withStatus(401);
            case 3:
                $response->getBody()->write(json_encode(["message" => "wrong input", "status" => "401", "email" => $email, "password" => $password, "username" => $username, "nome" => $nome, "cognome" => $cognome, "data_nascita" => $data_nascita]));
                return $response
                    ->withStatus(401);
        }
        exit;
    }

    public function postGoogleRegister(Request $request, Response $response, $args)// Reacteed
    {
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $birthday = $data['birthday'];
        $password = $data['password'];
        $token = $data['token'];

        if (!Auth::IsTokenValid($token, "temp")) {
            $response->getBody()->write(json_encode(["message" => "Invalid token", "status" => "401"]));
            return $response
                ->withStatus(401);
        }

        if (empty($birthday) || empty($password) || empty($token)) {
            $response->getBody()->write(json_encode(["message" => "Empty fields", "status" => "401"]));
            return $response
                ->withStatus(401);
        }

        // Registra l'utente nel database
        $user_id = DbStore::registerUser($token, ['Birthday' => $birthday, 'Password' => $password]);

        // logga l'utente
        $token =  DbStore::tokenUpdate($user_id);
        DbStore::sessionUpdate($token);
        $response->getBody()->write(json_encode(["message" => "Registration successful", "status" => "200", "token" => $token]));
        return $response
            ->withStatus(200);
    }   

    public function postVerify(Request $request, Response $response, $args) //reacted
    {
        //$tokenTemp = $_SESSION['tokenTemp'];
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $otp = $data['otp'];
        $email = $data['email'];

        if (empty($email) || empty($otp)) {
            $response->getBody()->write(json_encode(["message" => "Empty email or OTP", "status" => "401"]));
            return $response
                ->withStatus(401);
        }

        switch (Auth::CheckOTP($email, $otp)) {

            case 0:
                $tokenTemp = DbUtils::getTokenTemp($email);
                // Registra l'utente nel database
                $userID = DbStore::registerUser($tokenTemp, []);

                // logga l'utente
                $token =  DbStore::tokenUpdate($userID);
                DbStore::sessionUpdate($token);

                // Cancella l'OTP dal database
                DbUtils::delOTP($email);

                $response->getBody()->write(json_encode(["message" => "Verification successful", "status" => "200", "token" => $token]));
                return $response
                    ->withStatus(200);

            case 1:
                $response->getBody()->write(json_encode(["message" => "Invalid OTP", "status" => "401", "otp" => $otp]));
                return $response
                    ->withStatus(401);
            case 2:
                $response->getBody()->write(json_encode(["message" => "OTP expired", "status" => "401"]));
                return $response
                    ->withStatus(401);
            case 3:
                $response->getBody()->write(json_encode(["message" => "Empty email", "status" => "401", "email" => $email]));
                return $response
                    ->withStatus(401);
            case 4:
                $response->getBody()->write(json_encode(["message" => "Empty OTP", "status" => "401", "otp" => $otp]));
                return $response
                    ->withStatus(401);
        }
        exit;
    }
    public function sendOTP(Request $request, Response $response, $args) //reacted
    {
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $email = $data['email'];

        if (empty($email)) {
            $response->getBody()->write(json_encode(["message" => "Empty email", "status" => "401"]));
            return $response
                ->withStatus(401);
        }

        if (Auth::IsUserRegistered($email)) {
            //Mailer::sendConfirmationEmail($email, false); // commentata per debug
            DbStore::GenerateOTP($email);  // da commentare per non debug (genro OTP senza inviare email), otp visibile nel db
            //$_SESSION['resetPswEmail'] = $email;
            $response->getBody()->write(json_encode(["message" => "OTP sent", "status" => "200"]));
            return $response
                ->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(["message" => "Email not registered", "status" => "401"]));
            return $response
                ->withStatus(401);
        }
    }

    public function postResetPassword(Request $request, Response $response, $args) //reacted
    {
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $otp = $data['otp'];
        $email = $data['email']; //email passabile anche da args[]

        if ($otp) {
            switch (Auth::CheckOTP($email, $otp)) {
                case 0:
                    DbStore::confirmOTP($email, $otp);
                    $response->getBody()->write(json_encode(["message" => "OTP verified", "status" => "200"]));
                    return $response
                        ->withStatus(200);
                case 1:
                    $response->getBody()->write(json_encode(["message" => "Invalid OTP", "status" => "401", "otp" => $otp, "email" => $email]));
                    return $response
                        ->withStatus(401);
                case 2:
                    $response->getBody()->write(json_encode(["message" => "OTP expired", "status" => "401"]));
                    return $response
                        ->withStatus(401);
            }
            exit;
        }
    }

   

    public function postNewPassword(Request $request, Response $response, $args) //reacted
    {
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $email = $data['email'];
        $password = $data['password'];

        if (!$email || !$password) {
            $response->getBody()->write(json_encode(["message" => "Empty email or password", "status" => "401"]));
            return $response
                ->withStatus(401);
        }

        if (Auth::IsOTPVerified($email)) { // Controllo se l'utente ha verificato il codice OTP

            DbStore::updatePassword($email, $password);
            DbUtils::delOTP($email);
            MyPhpMailer::sendPasswordChangedEmail($email, false); // ------------non fa se l'utente cambbuia la password con l'username
            $response->getBody()->write(json_encode(["message" => "Password updated", "status" => "200"]));
            return $response
                ->withStatus(200);

        } else {
            // Codice OTP non verificato
            $response->getBody()->write(json_encode(["message" => "OTP not verified", "status" => "401"]));
            return $response
                ->withStatus(401);
        }
    }

    public function AddToCart(Request $request, Response $response, $args) //reacted
    {
        $game_id = $args['id_game'];
        //$platform_id = $args['id_platform'];
        $token = $_COOKIE['CapycodesTkn'];
        if ($user_id = Auth::isTokenValid($token, "session")) {

            //controllo se è disponibile (add to cart = true se disponibile)
            if (DbStore::addToCart($user_id, $game_id)) {
                $response->getBody()->write(json_encode(["message" => "Game added to cart", "status" => "200"]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200);
            } else{
                $response->getBody()->write(json_encode(["message" => "Game not available", "status" => "401", "game_id" => $game_id]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(401);
            }
        } else {
            $response->getBody()->write(json_encode(["message" => "User not logged in", "status" => "401", "game_id" => $game_id]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }
    }

    public function RemoveFromCart(Request $request, Response $response, $args)
    {
        $game_id = $args['id_game'];
        $token = $_COOKIE['CapycodesTkn'] ?? null;
        if ($user_id = Auth::isTokenValid($token, "session")) {
            DbStore::removeFromCart($user_id, $game_id);
            header("Location: /cart"); //-------------> PER IMPLEMENTAZIONE CON REACT: rendere un json con codice di stato per rirenderizzare la pagina da cui è stato chiamato con "removed successfully" o "error removing from cart"
            exit;

        } else {
            header("Location: /login");
            exit;
        }
    }
}
