FROM php:7.4-apache
ARG UID
ARG GID
RUN apt-get update; apt-get install unzip git -y
RUN docker-php-ext-install mysqli && a2enmod rewrite
RUN a2enmod rewrite
EXPOSE 80
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ADD entrypoint-php.sh /entrypoint-php.sh
RUN chmod +x /entrypoint-php.sh
RUN groupadd -f informatica -g$GID
RUN adduser --disabled-password --uid $UID --gid $GID --gecos "" informatica || true
CMD ["/entrypoint-php.sh"]
