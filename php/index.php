<?php

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;

require __DIR__ . '/vendor/autoload.php';

session_start();

function autoloader($class) {
    $dirs = ['/','/controllers','/src/main','/src/engine','/views','/model', '/src'];
    foreach ($dirs as $d) {
        $file = __DIR__ . '/' . $d . '/' . $class . '.php';
        if (file_exists($file)) {
            require $file;
            return;
        }
    }
}
spl_autoload_register('autoloader');

$app = AppFactory::create();
$app->addRoutingMiddleware();


// ------------------------ ROUTES GET ------------------------

    // ------------------------ HOME ------------------------
    $app->get('/', 'ControllerGet:getHome');
    $app->get('/home', 'ControllerGet:getHome');

    // ------------------------ AUTH ------------------------
    $app->get('/login', 'ControllerGet:getLogin');
    $app->get('/register', 'ControllerGet:getRegister');
    $app->get('/verify', 'ControllerGet:getVerify');
    $app->get('/reset-password', 'ControllerGet:getResetPassword');
    $app->get('/new-password', 'ControllerGet:getNewPassword');
    $app->delete('/logout', 'ControllerGet:getLogout');
    $app->get('/login/google', 'ControllerGet:getGoogleLogin');
    $app->get('/register/google', 'ControllerGet:getGoogleRegister');

    // ------------------------ PROFILE ------------------------
    $app->get('/profile', 'ControllerGet:getProfile');

    // ------------------------ CART ------------------------
    $app->get('/cart', 'ControllerGet:getCart');

    // ------------------------ GAME ------------------------
    $app->get('/game/{id}', 'ControllerGet:getGame');

// ------------------------ ROUTES POST ------------------------

    // ------------------------ AUTH ------------------------
    $app->post('/login', 'ControllerPost:postLogin');
    $app->post('/register', 'ControllerPost:postRegister');
    $app->post('/verify', 'ControllerPost:postVerify'); //aggiunger argomento token /verify/{token}
    $app->post('/send-otp', 'ControllerPost:sendOTP'); //PUT
    $app->post('/reset-password', 'ControllerPost:postResetPassword');
    $app->post('/new-password', 'ControllerPost:postNewPassword');     //PUT
    $app->post('/register/google', 'ControllerPost:postGoogleRegister');

    // ------------------------ PROFILE ------------------------
    //$app->post('/profile', 'ControllerPost:postProfile'); //PUT

    // ------------------------ CART ------------------------
    //$app->post('/cart/add/{id_game}/{id_platform}', 'ControllerPost:AddToCart');   //id platform da rimuovere (il sito vende solo key per PC)
    $app->post('/cart/add/{id_game}', 'ControllerPost:AddToCart');
    $app->post('/cart/remove/{id_game}', 'ControllerPost:RemoveFromCart');
    //$app->post('/cart/checkout', 'ControllerPost:postCheckout');


// ------------------------ ERROR PAGES ------------------------
$app->get('/500', function (Request $request, Response $response, $args) {
    $view = new View('pages/errors/error_500');
        $response->getBody()->write($view->render());
        return $response;
});
$app->get('/404', function (Request $request, Response $response, $args) {
    $view = new View('pages/errors/error_404');
    $response->getBody()->write($view->render());
    return $response;
});

// ------------------------ RUN ------------------------
$errorMiddleware = $app->addErrorMiddleware(true, true, true);
$app->run();
