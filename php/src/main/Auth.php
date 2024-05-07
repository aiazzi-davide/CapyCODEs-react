<?php

class Auth
{
    /** 
    //----------------------------------------LOGIN----------------------------------------

    //  CheckLogin($username, $password) controlla se le credenziali sono corrette
    * 
    * @param string $username
    * @param string $password
    * @return int|bool restituisce l'ID dell'utente se le credenziali sono corrette, altrimenti restituisce false
    */
    static function CheckLogin($username, $password) //-------gestire errori (user non esiste / password sbagliata)
    {
        //hash della password
        $password = Crypt::encrypt($password);
        
        //query per il login
        $stmt = DB::conn()->prepare("SELECT * FROM Users WHERE (username = ? OR email = ?) AND password = ?");
        $stmt->bind_param("sss", $username, $username, $password);
        $stmt->execute();
        $result = $stmt->get_result();

        //controllo se le credenziali sono corrette
        if ($result->num_rows === 1) {

            // Ottiene l'ID dell'utente
            $user_id = $result->fetch_assoc()['ID'];
            return $user_id;

        } else {
            return false;
        }

        //return $password; //debug
    }

    /** 
    //  isTokenValid($token) Verifica se il token è presente nel database e se è ancora valido --------------------------------
    * @param string $token
    * @return int|bool restituisce userID se il token è valido, altrimenti restituisce false
    */
    static function isTokenValid($token, $type)
    {

        // Controllo se il token è vuoto
        if (empty($token)) {
            return false;
        }

        switch ($type) {
            case "session":
                //hash del token
                $token = Crypt::encrypt($token);

                // Controllo se il token è presente nel database
                $stmt = DB::conn()->prepare("SELECT * FROM Session_Tokens WHERE token = ? AND DataScadenza > NOW()");
                $stmt->bind_param("s", $token);
                $stmt->execute();
                $result = $stmt->get_result();
                
                if ($result->num_rows > 0) {
                    // Ottiene l'ID dell'utente
                    $user_id = $result->fetch_assoc()['ID_Utente'];
                    return $user_id;
                } else {
                    return false;
                }

            case "temp":
                $stmt = DB::conn()->prepare("SELECT * FROM TempUserData WHERE token = ?");
                $stmt->bind_param("s", $token);
                $stmt->execute();
                $result = $stmt->get_result();
                
                if ($result->num_rows > 0) {
                    // Ottiene l'ID dell'utente
                    $user_id = $result->fetch_assoc()['ID'];
                    return $user_id;
                } else {
                    return false;
                }
            default:
                return false;
        }
        
        

        
        

    }

    /**
     * isAdmin($token) Verifica se l'utente è un amministratore
     * @param string $token
     * @return bool
     */
    static function isAdmin($user_id)
    {

        // Controllo se l'utente è un amministratore
        $stmt = DB::conn()->prepare("SELECT * FROM Users WHERE ID = ? AND Admin = 1");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();

        return $stmt->get_result()->num_rows == 1;
    }

    static function isUserRegistered($username)
    {
        //controllo se il nome utente è già registrato
        $stmt = DB::conn()->prepare("SELECT * FROM Users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $username, $username);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->num_rows > 0;
    }

    /*----------------------------------------REGISTRAZIONE----------------------------------------*/

    /**
    //  CheckRegister($username, $email) controlla se l'untente è già registrato
    * @param mixed $email
    * @return mixed restituisce un codice errore in caso positivo, altrimenti restituisce 0
    */
    static function CheckRegister($username, $email)
    {
        if (empty($username) || empty($email)) {
            return 3; //codice errore 3: campi vuoti
        }

        //controllo se il nome utente è già registrato
        $stmt = DB::conn()->prepare("SELECT * FROM Users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return 1; //codice errore 1: utente già registrato
        }

        //controllo se l'email è già registrata
        $stmt = DB::conn()->prepare("SELECT * FROM Users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            return 2; //codice errore 2: email già registrata
        }

        return 0; //registrazione avvenuta con successo

    }

    /** 
    // CheckOTP($email, $code) Controlla se il codice OTP è presente e valido --------------------------------
    * @param string $email
    * @param string $code
    * @return int ritorna 0 se il codice è presente e valido, 1 se il codice non è corretto, 2 se il codice è presente ma scaduto
    */
    static function CheckOTP($email, $code)
    {
        if (is_null($email)){
            return 3; // Email non corretta
        }
        if (is_null($code)){
            return 4; // Codice OTP non corretto
        }

        // Controllo se il codice OTP è presente nel database
        $stmt = DB::conn()->prepare("SELECT * FROM OTP_tokens WHERE OTP = ? AND Email = ?");
        $stmt->bind_param("ss", $code, $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {

            // Controllo se il codice OTP è ancora valido
            $data = $result->fetch_assoc();
            $expiryDate = strtotime($data['DataScadenza']);
            $currentDate = time();

            if ($expiryDate >= $currentDate) {

                return 0; // Codice OTP presente e valido
            } else {
                return 2; // Codice OTP presente ma scaduto
            }
        } else {
            return 1; // Codice OTP non corretto
        }
    }

    /**
     * IsOTPVerified($email) Controlla se l'utente ha verificato il codice OTP
     * @param string $email
     * @return bool
     */
    static function IsOTPVerified($email)
    {
        // Controllo se il codice OTP è stato verificato
        $stmt = DB::conn()->prepare("SELECT * FROM OTP_tokens WHERE Email = ? AND Verified = 1");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->num_rows == 1;
    }
    

}