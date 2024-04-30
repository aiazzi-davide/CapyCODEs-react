
CREATE TABLE indirizzi (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Indirizzo VARCHAR(255),
    Città VARCHAR(100),
    Provincia VARCHAR(100),
    CAP VARCHAR(10),
    Paese VARCHAR(100),
    Telefono VARCHAR(20)
);

CREATE TABLE Users (

    ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100),
    DataCreazione DATE
);

CREATE TABLE UserData (
  ID INT AUTO_INCREMENT PRIMARY KEY,
  ID_User INT NOT NULL,
  Nome VARCHAR(50) NOT NULL,
  Cognome VARCHAR(50) NOT NULL,
  DataDiNascita DATE,
  IndirizzoID INT,
  FOREIGN KEY (IndirizzoID) REFERENCES indirizzi(ID),
  FOREIGN KEY (ID_User) REFERENCES Users(ID)
);

CREATE TABLE TempUserData (

    ID INT AUTO_INCREMENT PRIMARY KEY,
    Token VARCHAR(100) UNIQUE NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(100),
    Nome VARCHAR(50),
    Cognome VARCHAR(50),
    DataDiNascita DATE
);


CREATE TABLE Session_Tokens(

    ID_Token INT AUTO_INCREMENT PRIMARY KEY,
    ID_Utente INT,
    IP VARCHAR(50),
    DataCreazione DATETIME,
    DataScadenza DATETIME,
    Token VARCHAR(100),

    FOREIGN KEY (ID_Utente) REFERENCES Users(ID)
);

CREATE TABLE OTP_tokens(

    ID_Token INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(100),
    IP VARCHAR(50),
    DataCreazione DATETIME,
    DataScadenza DATETIME,
    OTP VARCHAR(100),
    Verified BOOLEAN

);

CREATE TABLE Cart (

    ID_Cart INT AUTO_INCREMENT PRIMARY KEY,
    ID_User INT,
    DataCreazione DATETIME,

    FOREIGN KEY (ID_User) REFERENCES Users(ID)
);

CREATE TABLE CartItems (

    ID_CartItem INT AUTO_INCREMENT PRIMARY KEY,
    ID_Cart INT,
    ID_Game INT,
    ID_Platform INT,
    Amount INT,

    FOREIGN KEY (ID_Cart) REFERENCES Cart(ID_Cart)
);

CREATE TABLE ProductPrices (
    ID_Price INT AUTO_INCREMENT PRIMARY KEY,
    ProductID INT,
    Price DECIMAL(10,2),
    DateEffectiveFrom DATETIME,
    DateEffectiveTo DATETIME,
    Discount DECIMAL(10,2)
);

--CREATE TABLE FavoriteGames (
--  ID_Favorite INT AUTO_INCREMENT PRIMARY KEY,
--ID_User INT,
--  ID_Game INT,
--  FOREIGN KEY (ID_User) REFERENCES Users(ID),
--  FOREIGN KEY (ID_Game) REFERENCES Games(ID_Game)
--);