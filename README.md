## Su Linux

`sudo MY_UID=$(id -u) MY_GID=$(id -g) docker-compose up --build`

## Su Windows

`docker-compose up`

```shell script
docker-compose up -d
docker-compose run --rm composer composer update
```

## info

- default document root is `./source` folder
- default MySQL root password is `ciccio`
- default MySQL database is `mydb`
- default http port is `81`
- if you change `composer.json` and you need to install/update packages, you have to run `composer update` manually: docker-compose run --rm composer composer update
- in order to create database dump from mysql container run following:

```shell script
docker exec mysql sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > /some/path/on/your/host/all-databases.sql
```

- in order ro restore database dump into mysql container run following:

```shell script
docker exec -i mysql sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"' < /some/path/on/your/host/all-databases.sql
```

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
- buy system
- css register ecc...
- news letter
- security emails
- errors and exceptions managment (try catch)
- home page 90% (next-page button)
- better documentation

# minors

- ~~React implement~~
- ~~confirm email~~
- docblock
- ~~hashing~~
- ~~Rawg API~~
