<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

class ControllerAdmin
{


    //PUT
    public function updatePrice(Request $request, Response $response, $args)
    {
        // Recupera l'ID del gioco e il nuovo prezzo dal corpo della richiesta
        $contents = $request->getBody()->getContents();
        $data = json_decode($contents, true);
        $game_id = $data['game_id'];
        $new_price = $data['new_price'];

        // Aggiorna il prezzo nel database
        DbStore::updatePrice($game_id, $new_price);

        $response->getBody()->write(json_encode(["message" => "Price updated successfully"]));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200);
    }

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
}