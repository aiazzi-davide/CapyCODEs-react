<?php
class Crypt
{
    public static function encrypt($data)
    {
        if (is_array($data)) {
            $data = json_encode($data);
        }

        if (is_null($data)) {
            return null;
        }
        return hash('sha256', $data);
    }
}