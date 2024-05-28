## Su Linux

```shell script
sudo MY_UID=$(id -u) MY_GID=$(id -g) docker-compose up --build
```

## Su Windows

```shell script
docker-compose up
```

## se non funziona
```shell script
docker-compose up -d
docker-compose run --rm composer composer update
```

## info

- default MySQL root password is `ciccio`
- default MySQL database is `mydb`
- default http port is `81`

All default values mentioned above are configurable in .env file

## ToDo

# Reactable
- ~~login~~ R
- ~~register (with otp)~~ R (manca controlli passw, data, caratteri nell'username)
- ~~change password~~ R
- ~~logout~~ R
- ~~google auth~~ R
- ~~get game page~~ R
- ~~cart managment~~ R 
- ~~profile page~~ R

# post React
- ~~reserach system~~
- ~~loading animations~~
- ~~prices and discount managment with admin page~~ ~~expire date check~~
- ~~Navbar~~
- ~~cart animations~~
- ~~slideshow~~ 
- ~~post game page~~
- ~~profile page features~~
- ~~home page~~ ~~next page button~~
- buy system
- css register ecc...
- news letter
- security emails
- errors and exceptions managment (try catch)
- better documentation

# minors

- ~~React implement~~
- ~~confirm email~~
- docblock
- ~~hashing~~
- ~~Rawg API~~
