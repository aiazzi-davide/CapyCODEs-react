<?php
class RawgAPI
{
    private $client;
    private $base_url = "https://api.rawg.io/api/";
    private $api_key = "c4322c43dafb4b6fb295c5a30658b095";
    private $api_version = "1";
    private $api_url;
    private $api_params;
    private $api_response;
    private $api_error;
    private $api_status;
    private $api_data;

    public function __construct()
    {
        $this->client = new GuzzleHttp\Client();
    }

    public function getGames()
    {
        $this->api_url = $this->base_url . "games";
        $this->api_params = [
            'key' => $this->api_key,
            'page_size' => 10
        ];
        $this->api_response = $this->client->request('GET', $this->api_url, ['query' => $this->api_params]);
        $this->api_data = json_decode($this->api_response->getBody(), true);
        return $this->api_data['results'];
    }

    public function getGame($id)
    {
        $this->api_url = $this->base_url . "games/" . $id;
        $this->api_params = [
            'key' => $this->api_key
        ];
        $this->api_response = $this->client->request('GET', $this->api_url, ['query' => $this->api_params]);
        $this->api_data = json_decode($this->api_response->getBody(), true);
        return $this->api_data;
    }

    public function getGenres()
    {
        $this->api_url = $this->base_url . "genres";
        $this->api_params = [
            'key' => $this->api_key
        ];
        $this->api_response = $this->client->request('GET', $this->api_url, ['query' => $this->api_params]);
        $this->api_data = json_decode($this->api_response->getBody(), true);
        return $this->api_data['results'];
    }
}
