<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ControllerAdmin
{

    //PUT
    public function updateDiscount(Request $request, Response $response, $args)
    {
        // Recupera l'ID del gioco e il nuovo sconto dal corpo della richiesta
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $game_id = $data['game_id'];
        $new_discount = $data['new_discount'];
        $end_date = $data['end_date'];

        // Aggiorna lo sconto nel database
        DbStore::updateDiscount($game_id, $new_discount, $end_date);

        $response->getBody()->write(json_encode(["message" => "Discount updated successfully"]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

    //POST
    public function setPrice(Request $request, Response $response, $args) 
    {
        // Recupera l'ID del gioco e il prezzo dal corpo della richiesta
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $game_id = $data['gameId'];
        $price = $data['price'];
        $discount = $data['discount'];
        $end_date = $data['endDate'];

        $token = $_COOKIE['CapycodesTkn'] ?? null;

        if ($userId = Auth::isTokenValid($token, "session")) {
            if (Auth::isAdmin($userId)) {
                // Inserisce il prezzo nel database
                if (DbStore::setPrice($game_id, $price, $discount, $end_date)) {
                    $response->getBody()->write(json_encode(["message" => "Price set successfully", 'status' => 200, 'gameID' => $game_id, 'price' => $price, 'discount' => $discount, 'end_date' => $end_date]));
                    return $response
                        ->withHeader('Content-Type', 'application/json')
                        ->withStatus(200);
                } else {
                    $response->getBody()->write(json_encode(["message" => "Error setting price", 'status' => 500, 'gameID' => $game_id, 'price' => $price, 'discount' => $discount, 'end_date' => $end_date]));
                    return $response
                        ->withHeader('Content-Type', 'application/json')
                        ->withStatus(500);
                }
            } else {
                $response->getBody()->write(json_encode(["message" => "Unauthorized", 'status' => 401]));
                return $response
                    ->withHeader('Content-Type', 'application/json')
                    ->withStatus(401);
            }
            
        } else {
            $response->getBody()->write(json_encode(["message" => "User not logged", 'status' => 401]));
            return $response
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(401);
        }

        
    }
}