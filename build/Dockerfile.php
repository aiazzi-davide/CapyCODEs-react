FROM php:7.4-apache
ARG UID
ARG GID
RUN apt-get update; apt-get install unzip git -y
RUN docker-php-ext-install mysqli && a2enmod rewrite
RUN a2enmod rewrite headers
RUN sed -ri -e 's/^([ \t]*)(<\/VirtualHost>)/\1\tHeader set Access-Control-Allow-Headers "Content-Type"\n\1\2/g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's/^([ \t]*)(<\/VirtualHost>)/\1\tHeader set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\1\2/g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's#^([ \t]*)(</VirtualHost>)#\1\tHeader set Access-Control-Allow-Origin "http://localhost:3000"\n\1\2#g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's/^([ \t]*)(<\/VirtualHost>)/\1\tHeader set Access-Control-Allow-Credentials "true"\n\1\2/g' /etc/apache2/sites-available/*.conf
EXPOSE 81
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
ADD entrypoint-php.sh /usr/local/bin/entrypoint-php.sh
RUN groupadd -f informatica -g$GID
RUN adduser --disabled-password --uid $UID --gid $GID --gecos "" informatica || true
RUN chmod +x /usr/local/bin/entrypoint-php.sh
CMD ["/usr/local/bin/entrypoint-php.sh"]