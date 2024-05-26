<?php

class DbStore
{

    /*----------------------------------------LOGIN----------------------------------------*/

    /** 
    // tokenUpdate($user_id) Genera un token e lo salva nel database
     * @param string $user_id
     * @return string
     */
    static function tokenUpdate($user_id)
    {
        $token = bin2hex(random_bytes(48));
        $datetime = date("Y-m-d H:i:s");
        $expiryDate = date("Y-m-d H:i:s", strtotime($datetime . ' +1 month'));

        // Cancella i token dell'utente
        DbUtils::delToken($user_id);

        //hash del token
        $tokenHash = Crypt::encrypt($token);

        // Salva il token nel database
        $stmt = DB::conn()->prepare("INSERT INTO Session_Tokens (ID_Utente, token, DataCreazione, DataScadenza) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $user_id, $tokenHash, $datetime, $expiryDate);
        $stmt->execute();

        // Restituisce il token all'utente
        return $token;
    }


    /** 
     * sessionUpdate($token) Aggiorna la sessione dell'utente
     * @param string $token
     */
    static function sessionUpdate($token)
    {
        //aggiorno la sessione
        setcookie("CapycodesTkn", $token, [
            'expires' => time() + (86400 * 30),
            'path' => '/',
            'SameSite' => 'Lax',
        ]);
    }



    /*--------------------------------------REGISTER----------------------------------------*/
    /**
    // registerUser($token) Registra l'utente nel database
     * @param mixed $token
     * @return int restituisce l'ID dell'utente appena registrato
     */
    static function registerUser($tokenTemp, $args)
    {

        //prendo i dati dell'utente
        $userData = DbUtils::getTempUserData($tokenTemp);

        $datetime = date("Y-m-d H:i:s");
        if (isset($args['Password'])) {
            $hashpsw = Crypt::encrypt($args['Password']);} //con la regisrazione con google viene passata la password

        //aggiorno i dati dell'utente se sono stati passati
        $userData['Password'] = $hashpsw ?? $userData['Password'];
        $userData['DataDiNascita'] = $args['Birthday'] ?? $userData['DataDiNascita'];
        $userData['Email'] = $args['email'] ?? $userData['Email'];

        //cripto la password
        //$userData['Password'] = Crypt::encrypt($userData['Password']); la password in tempuserdata è già criptata

        //query per la registrazione (tabella Users)
        $stmt = DB::conn()->prepare("INSERT INTO Users (Email, Username, Password, DataCreazione) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $userData['Email'], $userData['Username'], $userData['Password'], $datetime);
        $stmt->execute();

        //getta l'ID dell'utente appena registrato
        $userID = $stmt->insert_id;

        //query per la registrazione (tabella UserData)
        $stmt = DB::conn()->prepare("INSERT INTO UserData (ID_User, Nome, Cognome, DataDiNascita) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $userID, $userData['Nome'], $userData['Cognome'], $userData['DataDiNascita']);
        $stmt->execute();

        //cancello i dati temporanei dell'utente
        //DbUtils::delTempUserData($userData['Email']);

        return $userID;
    }

    /**
    // GenerateOTP($email) Genera un codice OTP e lo salva nel database
     * @param mixed $email
     * @return mixed rende il codice OTP generato
     */
    static function GenerateOTP($email)
    {
        //genero un codice otp
        $OTP = mt_rand(100000, 999999);

        //controllo se il codice è già presente nel database
        $stmt = DB::conn()->prepare("SELECT * FROM OTP_tokens WHERE OTP = ?");
        $stmt->bind_param("s", $OTP);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            //se il codice è già presente nel database, genero un nuovo codice
            return self::GenerateOTP($email);
        }

        //cancello gli altri codici OTP associati all'email
        DbUtils::delOTP($email);

        $datetime = date("Y-m-d H:i:s");
        $expiryDate = date("Y-m-d H:i:s", strtotime($datetime . ' +5 minutes'));

        //salvo il codice OTP nel database
        $stmt = DB::conn()->prepare("INSERT INTO OTP_tokens (Email, DataCreazione, DataScadenza, OTP) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $email, $datetime, $expiryDate, $OTP);
        $stmt->execute();

        return $OTP;
    }

    /**
     * confirmOTP($email) Conferma il codice OTP
     * @param mixed $email
     * 
     */
    static function confirmOTP($email, $otp)
    {
        // imposto il token come verificato
        $stmt = DB::conn()->prepare("UPDATE OTP_tokens SET Verified = 1 WHERE OTP = ? AND Email = ?");
        $stmt->bind_param("ss", $otp, $email);
        $stmt->execute();

        return $stmt->affected_rows > 0;
    }

    /**
    // storeTempUserData($nome, $cognome, $data_nascita, $password, $username, $email) Salva i dati dell'utente nella tabella TempUserData
     * @param mixed $nome
     * @param mixed $cognome
     * @param mixed $data_nascita
     * @param mixed $password
     * @param mixed $username
     * @param mixed $email
     * @return mixed rende il token di TempUserData
     */
    static function storeTempUserData($nome, $cognome, $data_nascita, $password, $username, $email)
    {

        //controllo se l'utente è già presente nel database
        $stmt = DB::conn()->prepare("SELECT * FROM TempUserData WHERE Email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            //se l'utente è già presente nel database, cancello i dati vecchi
            $stmt = DB::conn()->prepare("DELETE FROM TempUserData WHERE Email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
        }

        //genero un token univoco
        $token = bin2hex(random_bytes(16));

        //cripto la password
        $password = Crypt::encrypt($password);

        //salvo i dati dell'utente temporaneamente
        $stmt = DB::conn()->prepare("INSERT INTO TempUserData (Email, Username, Password, Nome, Cognome, DataDiNascita, Token) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssss", $email, $username, $password, $nome, $cognome, $data_nascita, $token);
        $stmt->execute();

        return $token;
    }

    /*--------------------------------------CART----------------------------------------*/
    /**
     * addToCart($user_id, $game_id) Aggiunge un gioco al carrello dell'utente
     * @param mixed $user_id
     * @param mixed $game_id
     */
    static function addToCart($user_id, $game_id/*, $platform_id*/){
        //controllo se il gioco è disponibile
        $stmt = DB::conn()->prepare("SELECT * FROM ProductPrices WHERE ProductID = ?");
        $stmt->bind_param("s", $game_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) return false; //errore: gioco non disponibile


        //controllo se l'utente ha già un carrello          -------------------Il database non prevede che appena un utente si registra, gli venga creato un carrello per motivi di efficienza-------------------
        $stmt = DB::conn()->prepare("SELECT * FROM Cart WHERE ID_User = ?");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();

        //se l'utente non ha un carrello, lo creo
        if ($result->num_rows == 0) {
            $stmt = DB::conn()->prepare("INSERT INTO Cart (ID_User, DataCreazione) VALUES (?, NOW())");
            $stmt->bind_param("s", $user_id);
            $stmt->execute();
        }

        //controllo se il gioco è già presente nel carrello
        $stmt = DB::conn()->prepare("SELECT * FROM CartItems WHERE ID_Cart = (SELECT ID_Cart FROM Cart WHERE ID_User = ?) AND ID_Game = ?");
        $stmt->bind_param("ss", $user_id, $game_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {

            //se il gioco è già presente nel carrello, aumento la quantità
            $stmt = DB::conn()->prepare("UPDATE CartItems SET Amount = Amount + 1 WHERE ID_Cart = (SELECT ID_Cart FROM Cart WHERE ID_User = ?) AND ID_Game = ?");
            $stmt->bind_param("ss", $user_id, $game_id);
            $stmt->execute();
        } else{

            //se il gioco non è presente nel carrello, lo aggiungo
            $stmt = DB::conn()->prepare("INSERT INTO CartItems (ID_Cart, ID_Game /*, ID_Platform*/, Amount) VALUES ((SELECT ID_Cart FROM Cart WHERE ID_User = ?), ?, 1)");
            $stmt->bind_param("ss", $user_id, $game_id /*, $platform_id*/);
            $stmt->execute();
        }
        return true;
    }

    /**
     * delFromCart($user_id, $game_id) Rimuove un gioco dal carrello dell'utente
     * @param mixed $user_id
     * @param mixed $game_id
     */
    static function removeFromCart($user_id, $game_id){
        //controllo se il gioco è presente nel carrello

        $stmt = DB::conn()->prepare("SELECT * FROM CartItems WHERE ID_Cart = (SELECT ID_Cart FROM Cart WHERE ID_User = ?) AND ID_Game = ?");
        $stmt->bind_param("ss", $user_id, $game_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) return 1; //errore: gioco non presente nel carrello

        //se il gioco è presente nel carrello, diminuisco la quantità se è maggiore di 1, altrimenti lo elimino

        //se la quantità è maggiore di 1, diminuisco la quantità
        $stmt = DB::conn()->prepare("UPDATE CartItems SET Amount = Amount - 1 WHERE ID_Cart = (SELECT ID_Cart FROM Cart WHERE ID_User = ?) AND ID_Game = ?");
        $stmt->bind_param("ss", $user_id, $game_id);
        $stmt->execute();

        //se la quantità è 0, elimino il gioco dal carrello
        $stmt = DB::conn()->prepare("DELETE FROM CartItems WHERE ID_Cart = (SELECT ID_Cart FROM Cart WHERE ID_User = ?) AND ID_Game = ? AND Amount = 0");
        $stmt->bind_param("ss", $user_id, $game_id);
        $stmt->execute();

        return 0;
    }

    /*--------------------------------------Amdin----------------------------------------*/
    /**
     * setPrice($game_id, $price, $discount) Imposta il prezzo di un gioco nel database
     * @param mixed $game_id
     * @param mixed $price
     * @param mixed $discount
     */

    static function setPrice($game_id, $price, $discount, $end_date)
    {
        //controllo se il gioco è già presente nel database
        $stmt = DB::conn()->prepare("SELECT * FROM ProductPrices WHERE ProductID = ?");
        $stmt->bind_param("s", $game_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows == 0) {
            //se il gioco non è presente nel database, lo aggiungo
            $stmt = DB::conn()->prepare("INSERT INTO ProductPrices (ProductID, Price, DateEffectiveFrom, DateEffectiveTO, Discount) VALUES (?, ?, NOW(), ?, ?)");
            $stmt->bind_param("ssss", $game_id, $price, $end_date, $discount);
            $stmt->execute();
        } else {
            //se il gioco è già presente nel database, aggiorno il prezzo
            $stmt = DB::conn()->prepare("UPDATE ProductPrices SET Price = ?, Discount = ?, DateEffectiveFrom = NOW(), DateEffectiveTO = ? WHERE ProductID = ?");
            $stmt->bind_param("ssss", $price, $discount, $end_date, $game_id);
            $stmt->execute();
        }

        if ($stmt->error) return $stmt->error;
        if ($stmt->affected_rows > 0) return 'success';
        return 'error';
    }

    /*--------------------------------------OTHER----------------------------------------*/
    /**
     * updatePassword($email, $password) Aggiorna la password dell'utente nel database e la cripta
     * @param mixed $email
     * @param mixed $password
     * @return void
     */
    static function updatePassword($email, $password)
    {
        if (empty($password) or empty($email)) return;
        //cripto la password
        $password = Crypt::encrypt($password);

        //aggiorno la password nel database
        $stmt = DB::conn()->prepare("UPDATE Users SET Password = ? WHERE Email = ? OR Username = ?");
        $stmt->bind_param("sss", $password, $email, $email);
        $stmt->execute();

        //cancello i token dell'utente
        DbUtils::delToken($email);
    }


    /**
     * updatePrice($game_id, $new_price) Aggiorna il prezzo di un gioco nel database
     * @param mixed $game_id
     * @param mixed $new_price
     * @return void
     */
    static function updatePrice($game_id, $new_price)
    {
        //aggiorno il prezzo del gioco
        $stmt = DB::conn()->prepare("UPDATE ProductPrices SET Price = ? WHERE ProductID = ?");
        $stmt->bind_param("ss", $new_price, $game_id);
        $stmt->execute();
    }

    /**
     * getAllPrices() Restituisce tutti i prezzi dei giochi dal database
     * @return mixed
     */
    static function getAllPrices()
    {
        //recupero tutti i prezzi dei giochi
        $stmt = DB::conn()->prepare("SELECT * FROM ProductPrices");
        $stmt->execute();
        $result = $stmt->get_result();

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * updateDiscount($game_id, $new_discount) Aggiorna lo sconto di un gioco nel database
     * @param mixed $game_id
     * @param mixed $new_discount
     * @return void
     */
    static function updateDiscount($game_id, $new_discount, $end_date)
    {
        //aggiorno lo sconto del gioco
        $stmt = DB::conn()->prepare("UPDATE ProductPrices SET Discount = ? WHERE ProductID = ?");
        $stmt->bind_param("ss", $new_discount, $game_id);
        $stmt->execute();
    }

    /**
     * editProfile($user_id, $data) Modifica il profilo dell'utente
     * @param mixed $user_id
     * @param mixed $data
     * @return int
     */

    static function editProfile($user_id, $data)
    {
        $field = $data['field'];
        $value = $data['value'];

        //aggiorno il profilo dell'utente
        if($field == 0) //username
        {
            //controllo se l'username è già presente nel database
            $stmt = DB::conn()->prepare("SELECT * FROM Users WHERE Username = ?");
            $stmt->bind_param("s", $value);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                return 0; //errore: username già presente nel database
            }
        
            //aggiorno l'username
            $stmt = DB::conn()->prepare("UPDATE Users SET Username = ? WHERE ID = ?");
            $stmt->bind_param("ss", $value, $user_id);
            $stmt->execute();
        }
        else if($field == 1) //email
        {
            //controllo se l'email è già presente nel database
            $stmt = DB::conn()->prepare("SELECT * FROM Users WHERE Email = ?");
            $stmt->bind_param("s", $value);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                return 1; //errore: email già presente nel database
            }

            //aggiorno l'email
            $stmt = DB::conn()->prepare("UPDATE Users SET Email = ? WHERE ID = ?");
            $stmt->bind_param("ss", $value, $user_id);
            $stmt->execute();
        }
        else if($field == 2) //nome
        {
            $stmt = DB::conn()->prepare("UPDATE UserData SET Nome = ? WHERE ID_User = ?");
            $stmt->bind_param("ss", $value, $user_id);
            $stmt->execute();
        }
        else if($field == 3) //cognome
        {
            $stmt = DB::conn()->prepare("UPDATE UserData SET Cognome = ? WHERE ID_User = ?");
            $stmt->bind_param("ss", $value, $user_id);
            $stmt->execute();
        }
        else if($field == 4) //data di nascita
        {
            $stmt = DB::conn()->prepare("UPDATE UserData SET DataDiNascita = ? WHERE ID_User = ?");
            $stmt->bind_param("ss", $value, $user_id);
            $stmt->execute();
        }

        if ($stmt->affected_rows > 0) return 100; //successo
        return 2; //errore
    }

    /**
     * deleteAccount($user_id) Cancella l'account dell'utente
     * @param mixed $user_id
     * @return void
     */
    static function deleteAccount($user_id)
    {
        //cancello i dati dell'utente
        $stmt = DB::conn()->prepare("DELETE FROM UserData WHERE ID_User = ?");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();

        //cancello l'account dell'utente
        $stmt = DB::conn()->prepare("DELETE FROM Users WHERE ID = ?");
        $stmt->bind_param("s", $user_id);
        $stmt->execute();

        //cancello i token dell'utente
        DbUtils::delToken($user_id);
    }




}