<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class ControllerGet
{
    public function getHome(Request $request, Response $response, $args)
    {
        $view = new View("pages/HomePage");

        if (isset($_COOKIE['CapycodesTkn'])) {

            $token = $_COOKIE['CapycodesTkn'];
            //$email = $_SESSION['email'];

            // Verifica se il token è valido
            if (Auth::isTokenValid($token)) {
                //setta dati per la view
                $data['profile'] = DbUtils::getUserData($token, "session");
            }
        }
        //aggiungo a data i dati dei giochi da stampare in homepage
        $data['games'] = DbUtils::getGames();
        //$data['raw'] = json_encode($data, JSON_PRETTY_PRINT); //debug
        $view->setData($data);
        $response->getBody()->write($view->render());
        return $response;
    }

    public function getLogin(Request $request, Response $response, $args)
    {
        //controllo se l'utente è già loggato e reindirizzo alla home
        if (isset($_COOKIE['CapycodesTkn'])) {
            $token = $_COOKIE['CapycodesTkn'];
            if (Auth::isTokenValid($token)) {
                header("Location: /home");
                exit;
            }
        } 
        //se non è loggato, mostra la pagina di login
        $view = new View("pages/auth/LoginPage");
        $error = $request->getQueryParams()['error'] ?? null;
        $view->setData(['error' => $error]);
        $response->getBody()->write($view->render());
        return $response;
    }

    public function getRegister(Request $request, Response $response, $args){
        $view = new View('pages/auth/RegisterPage');
        $response->getBody()->write($view->render());
        return $response;
        
    }

    public function getVerify(Request $request, Response $response, $args){
        $token = $_SESSION['tokenTemp'];
        $view = new View('pages/auth/VerifyPage');
        $view->setData(DbUtils::getUserData($token, "temp"));
        $response->getBody()->write($view->render());
        return $response;
    }

    public function getLogout(Request $request, Response $response, $args){ //dovrebbe essere un metodo DELETE

        // Cancella il token dal database e dal cookie se l'utente è loggato
        if (isset($_COOKIE['CapycodesTkn'])) {
            $token = $_COOKIE['CapycodesTkn'];
            DbUtils::logout($token);
        }

        header("Location: /home");
        exit;
    }

    public function getResetPassword(Request $request, Response $response, $args){
        $verified = $request->getQueryParams()['verified'] ?? null;
        $view = new View('pages/auth/ResetPasswordPage');
        $view->setData(['verified' => $verified, 'std' => is_null($verified)]);
        $response->getBody()->write($view->render());

        return $response;
    }

    public function getNewPassword(Request $request, Response $response, $args){

        if (Auth::IsOTPVerified($_SESSION['resetPswEmail'])) {
            $email = $_SESSION['resetPswEmail'];
            $view = new View('pages/auth/NewPasswordPage');
            $view->setData(['email' => $email]);
            $response->getBody()->write($view->render());
            return $response;
        } else {
            header("Location: /reset-password");
            exit;
        }
    }

    public function getGoogleLogin(Request $request, Response $response, $args)
    {
        $client = new Google\Client;
        $client->setAuthConfig('google_client_secret.json');
        $client->setScopes(['email', 'profile']);

        if(isset($_GET['code'])){

            $token = $client->fetchAccessTokenWithAuthCode($_GET['code']);
            $client->setAccessToken($token);
            $oauth = new Google\Service\Oauth2($client);
            $user = $oauth->userinfo->get();
            $email = $user->email;

            if(Auth::isUserRegistered($email)){
                // Genera un token e aggiorna il database
                $user_id = DbUtils::getUserId($email);
                $token =  DbStore::tokenUpdate($user_id);
                DbStore::sessionUpdate($token);
                header("Location: /");
                exit;
            } else {
                $token =  DbStore::storeTempUserData($user->givenName, $user->familyName, null, null, $user->name, $email);
                $_SESSION['tokenTemp'] = $token;
                header("Location: /register/google");
                exit;
            }

        } else {
            $auth_url = $client->createAuthUrl();
            header("Location: $auth_url");
            exit;
        }
        
    }

    public function getGoogleRegister(Request $request, Response $response, $args)
    {
        $token = $_SESSION['tokenTemp'];
        $view = new View('pages/auth/GoogleRegisterPage');
        $view->setData(DbUtils::getUserData($token, "temp"));
        $response->getBody()->write($view->render());
        return $response;
    }

    public function getCart(Request $request, Response $response, $args)
    {
        $view = new View('pages/CartPage');
        if($token = $_COOKIE['CapycodesTkn']){

            $user_id = Auth::isTokenValid($token);
            $data['items'] = DbUtils::getCart($user_id);
            foreach ($data['items'] as $key => $item) {
                $data['items'][$key]['game'] = DbUtils::getGame($item['ID_Game']);
            }

        } else {
            header("Location: /login");
        }
        $data['raw'] = json_encode($data, JSON_PRETTY_PRINT); //debug
        $view->setData($data);

        $response->getBody()->write($view->render());
        return $response;
    }

    public function getGame(Request $request, Response $response, $args)
    {
        $view = new View('pages/GamePage');
        $data = DbUtils::getGame($args['id']);
        $data['raw'] = json_encode($data, JSON_PRETTY_PRINT); //debug
        $view->setData($data);
        $response->getBody()->write($view->render());
        return $response;  //->withHeader('Content-Type', 'application/json');
    }

    public function getProfile(Request $request, Response $response, $args)
    {
        $view = new View('pages/ProfilePage');
        $token = $_COOKIE['CapycodesTkn'] ?? null;
        
        if ($user_id = Auth::isTokenValid($token)) {
            $data = DbUtils::getUserData($token, "session");
            $data['raw'] = json_encode($data, JSON_PRETTY_PRINT); //debug
            $view->setData($data);
            $response->getBody()->write($view->render());
            return $response /*-> withHeader('Content-Type', 'application/json')*/;
        } else {
            header("Location: /login");
            exit;
        }
    }


}