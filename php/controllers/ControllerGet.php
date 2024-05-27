<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


class ControllerGet
{
    public function getHome(Request $request, Response $response, $args) //reacted
    {
        $search = $request->getQueryParams()['query'] ?? null;
        $page = $request->getQueryParams()['page'] ?? 1;
        //aggiungo a data i dati dei giochi da stampare in homepage
        $data['games'] = DbUtils::getGames($search, $page);
  

        if (isset($_COOKIE['CapycodesTkn'])) {

            $token = $_COOKIE['CapycodesTkn'];
            //$email = $_SESSION['email'];

            // Verifica se il token è valido
            if ($user_id = Auth::isTokenValid($token, "session")) {
                //setta dati utente
                $data['profile'] = DbUtils::getUserData($token, "session");
                //$data['debug'] = ["token" => $token]; //debug
                //controllo se l'utente è admin
                if (Auth::isAdmin($user_id)) {
                    $data['admin'] = true;
                }
            } else {
                //se il token non è valido, cancellalo
                DbUtils::logout($token);
            }
        }
        //$data['raw'] = json_encode($data, JSON_PRETTY_PRINT); //debug

        //restituisco i dati in formato JSON
        $response->getBody()->write(json_encode($data));
                //set response headers
                //sleep(1); //simula latenza
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200); 
    }

    public function getLogin(Request $request, Response $response, $args) //reacted
    {
        //controllo se l'utente è già loggato e reindirizzo alla home
        if (isset($_COOKIE['CapycodesTkn'])) {
            $token = $_COOKIE['CapycodesTkn'];
            if (Auth::isTokenValid($token, "session")) {
                $response->getBody()->write(json_encode(["message" => "User already logged in"]));

                //redirect to home
                return $response
                    ->withStatus(200)
                    ->withHeader('Content-Type', 'application/json');
            }
        } 
        //se non è loggato, mostra la pagina di login
        //$view = new View("pages/auth/LoginPage");
        //$error = $request->getQueryParams()['error'] ?? null;
        //$view->setData(['error' => $error]);
        $response->getBody()->write(json_encode(["message" => "User not logged in"]));
        return $response
            ->withStatus(200)
            ->withHeader('Content-Type', 'application/json');
    }

    public function getGoogleLogin(Request $request, Response $response, $args) //reacted
    {
        $react_url = "http://capycodes.ddns.net";
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
                header("Location: $react_url"); // unicom modo per reindirizzare a react per il momento
                exit;
                
            } else {
                $token =  DbStore::storeTempUserData($user->givenName, $user->familyName, null, null, $user->name, $email); //password e data di nascita null
                //$_SESSION['tokenTemp'] = $token;
                header("Location: $react_url/login/google?token=$token");
                exit;
            }

        } else {
            $auth_url = $client->createAuthUrl(); //genera l'url per l'autenticazione

            $response->getBody()->write(json_encode(["url" => $auth_url]));
            return $response
                ->withHeader('Location', $auth_url)
                ->withStatus(200);
        }
        
    }

    public function getCart(Request $request, Response $response, $args)
    {
        if($token = $_COOKIE['CapycodesTkn']){

            $user_id = Auth::isTokenValid($token, "session");
            $data['items'] = DbUtils::getCart($user_id);
            foreach ($data['items'] as $key => $item) {
                $data['items'][$key]['game'] = DbUtils::getGame($item['ID_Game']);
            }

        } else {
            $response->getBody()->write(json_encode(["message" => "User not logged in"]));
            return $response
                ->withStatus(200)
                ->withHeader('Content-Type', 'application/json');
        }

        $response->getBody()->write(json_encode($data));
        //sleep(1); //simula latenza
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function getGame(Request $request, Response $response, $args)
    {
        $id = $args['id'];
        $data = DbUtils::getGame($id);
        $response->getBody()->write(json_encode($data));

        if ($data['Error']) {
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(404);
        }
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function getPrice(Request $request, Response $response, $args) //INUTILIZZATA
    {
        $data = DbUtils::getPrice($args['id']);
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    public function getProfile(Request $request, Response $response, $args) //reacted
    {
        $token = $_COOKIE['CapycodesTkn'] ?? null;
        
        if ($user_id = Auth::isTokenValid($token, "session")) {
            $data = DbUtils::getUserData($token, "session");
            $response->getBody()->write(json_encode($data));
            //sleep(1); //simula latenza
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(200);
        } else {
            $response->getBody()->write(json_encode(["message" => "User not logged in"]));
            return $response
                ->withStatus(401)
                ->withHeader('Content-Type', 'application/json');
        }
    }

    public function getAdmin(Request $request, Response $response, $args) //reacted
    {
        $token = $_COOKIE['CapycodesTkn'] ?? null;
        
        if ($user_id = Auth::isTokenValid($token, "session")) {
            if (Auth::isAdmin($user_id)) {
                $data = DbUtils::getUserData($token, "session");
                $response->getBody()->write(json_encode($data));
                //sleep(1); //simula latenza
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(200);
            } else {
                $response->getBody()->write(json_encode(["message" => "User is not an admin"]));
                return $response
                    ->withStatus(403)
                    ->withHeader('Content-Type', 'application/json');
            }
        } else {
            $response->getBody()->write(json_encode(["message" => "User not logged in"]));
            return $response
                ->withStatus(401)
                ->withHeader('Content-Type', 'application/json');
        }
    }


    public function DeleteLogout(Request $request, Response $response, $args){ //reacted

        // Cancella il token dal database e dal cookie se l'utente è loggato
        if (isset($_COOKIE['CapycodesTkn'])) {
            $token = $_COOKIE['CapycodesTkn'];
            DbUtils::logout($token);

            $response->getBody()->write(json_encode(["message" => "Logout successful"]));
        } else {
            $response->getBody()->write(json_encode(["message" => "User not logged in"]));
        }

        return $response/*->withHeader('Location', '/')*/
            ->withStatus(302);
    }

    public function getGameImages(Request $request, Response $response, $args) //reacted
    {
        $id = $args['id'];
        $data = DbUtils::getGameImages($id);
        $response->getBody()->write(json_encode($data));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    //------------------------ Mustache OLD ------------------------
    public function getGoogleRegister(Request $request, Response $response, $args) //inutilizzato
    {
        $token = $_SESSION['tokenTemp'];
        $view = new View('pages/auth/GoogleRegisterPage');
        $view->setData(DbUtils::getUserData($token, "temp"));
        $response->getBody()->write($view->render());
        return $response;
    }
    public function getResetPassword(Request $request, Response $response, $args){ //inutilizzato
        $verified = $request->getQueryParams()['verified'] ?? null;
        $view = new View('pages/auth/ResetPasswordPage');
        $view->setData(['verified' => $verified, 'std' => is_null($verified)]);
        $response->getBody()->write($view->render());

        return $response;
    }
    public function getNewPassword(Request $request, Response $response, $args){ //inutilizzato

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
    public function getRegister(Request $request, Response $response, $args){ //inutilizzato
        $view = new View('pages/auth/RegisterPage');
        $response->getBody()->write($view->render());
        return $response;
        
    }
    public function getVerify(Request $request, Response $response, $args){ //inutilizzato
        $token = $_SESSION['tokenTemp'];
        $view = new View('pages/auth/VerifyPage');
        $view->setData(DbUtils::getUserData($token, "temp"));
        $response->getBody()->write($view->render());
        return $response;
    }

}