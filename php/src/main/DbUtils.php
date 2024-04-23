<?php
class DbUtils
{
    /**
    // getUserData($token, $type) Restituisce i dati dell'utente
        * @param string $token
        * @param string $type session, temp, otp
        * @return array|bool restituisce i dati dell'utente in array associativo se il token è valido, altrimenti restituisce false
    */
    static function getUserData($token, $type)
    {
        
        switch ($type) {
            case "session":
                //se il tipo è session, prendo i dati dell'utente dalla tabella Session_Tokens !!IN SESSION_TOKENS IL TOKEN è HASHATO!!
                $stmt = DB::conn()->prepare("SELECT Users.ID, Users.Email, Users.Username, Users.DataCreazione, UserData.* FROM Users LEFT JOIN UserData ON Users.ID = UserData.ID_User LEFT JOIN Session_Tokens ON Users.ID = Session_Tokens.ID_Utente WHERE Session_Tokens.token = ?");
                //hash del token
                $token = Crypt::encrypt($token);
                break;
            //se il tipo è temp, prendo i dati dell'utente dalla tabella TempUserData !!IN TEMPUSERDATA IL TOKEN NON è HASHATO!!
            case "temp":
                $stmt = DB::conn()->prepare("SELECT ID, Email, Username, Nome, Cognome, DataDiNascita FROM TempUserData WHERE token = ?");
                break;
            //se il tipo è otp, prendo i dati dell'utente dalla tabella OTP_tokens INUTILIZZATO
            case "otp":
                $stmt = DB::conn()->prepare("SELECT * FROM OTP_tokens WHERE token = ?");
                break;
            default:
                return false;
        }
        //eseguo la query
        $stmt->bind_param("s", $token);
        $stmt->execute();

        //restituisco i dati dell'utente senza la password e il token
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return $data;
        //return ["token" => $token];
    }

    static function getTempUserData($token) //funzione che passa tutti i dati (anche la password) dell'utente temporaneo
    {
        $stmt = DB::conn()->prepare("SELECT * FROM TempUserData WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return $data;
    }

    /**
     * getTokenTemp($email) Restituisce il token temporaneo dell'utente
     * @param string $email
     * @return string
     */
    static function getTokenTemp($email)
    {
        $stmt = DB::conn()->prepare("SELECT Token FROM TempUserData WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return $data['Token'];
    }

    static function getUserId($email){
        $stmt = DB::conn()->prepare("SELECT ID FROM Users WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_assoc();
        return $data['ID'];
    }


    /**
    // delOTP($email) Cancella il codice OTP dal database data l'email
     * @param string $email
     */
    static function delOTP($email)
    {
        $stmt = DB::conn()->prepare("DELETE FROM OTP_tokens WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
    }

    /**
     * delToken($user_id) Cancella i token dell'utente
     * @param string $user_id
     */

     static function delToken($user_id)
    {
        //Rimozione dal DB
        // Cancella i token scaduti
        $stmt = DB::conn()->prepare("DELETE FROM Session_Tokens WHERE DataScadenza < NOW()");
        $stmt->execute();

        // Cancella i token dell'utente
        $stmt = DB::conn()->prepare("DELETE FROM Session_Tokens WHERE ID_Utente = ?");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();

        //Rimozione dalla sessione
        setcookie("CapycodesTkn", "x", time() - 3600, "/");
    }

    /**
     * delTempUserData($email) Cancella i dati temporanei dell'utente
     * @param string $email
     */
    static function delTempUserData($email)
    {
        $stmt = DB::conn()->prepare("DELETE FROM TempUserData WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
    }

    /**
     * logout($token) Cancella il token dal database e dalla sessione
     * @param mixed $token
     * @return void
     */
    static function logout($token)
    {
        $token = Crypt::encrypt($token);
        // Cancella il token dal database
        $stmt = DB::conn()->prepare("DELETE FROM Session_Tokens WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();

        // Cancella il token dalla sessione
        setcookie("CapycodesTkn", "x", time() - 3600, "/");
    }

    /**
     * getGames() Restituisce i giochi
     * @return array
     */
    static function getGames()
    {
        $rawg = new RawgAPI();
        return $rawg->getGames();
    }

    /**
     * getGame($id) Restituisce il gioco con l'ID specificato
     * @param string $id
     * @return array
     */
    static function getGame($id)
    {
        $rawg = new RawgAPI();
        return $rawg->getGame($id);
    }

    /**
     * getCart($user_id) Restituisce il carrello dell'utente
     * @param string $user_id
     * @return array
     */
    static function getCart($user_id)
    {
        $stmt = DB::conn()->prepare("SELECT * FROM CartItems WHERE ID_Cart = (SELECT ID_Cart FROM Cart WHERE ID_User = ?)");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        return $data;
    }
}
?>