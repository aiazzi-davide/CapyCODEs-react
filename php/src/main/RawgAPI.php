<?php
class RawgAPI
{
    private $client;
    private $base_url = "https://api.rawg.io/api/";
    private $api_key = "0f0f9b9f6b4f4e338760f5c9d9bfc1ec";
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

    public function getGames($query, $page)
    {
        $this->api_url = $this->base_url . "games";
        $this->api_params = [
            'key' => $this->api_key,
            'search' => $query,
            'page_size' => 24,
            'page' => $page
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

    public function getGameImages($id)
    {
        $this->api_url = $this->base_url . "games/" . $id . "/screenshots";
        $this->api_params = [
            'key' => $this->api_key
        ];
        $this->api_response = $this->client->request('GET', $this->api_url, ['query' => $this->api_params]);
        $this->api_data = json_decode($this->api_response->getBody(), true);
        return $this->api_data['results'];
    }
}
