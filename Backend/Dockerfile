FROM php:8.2-fpm-alpine

# Cài đặt phần mở rộng cho PostgreSQL và Redis
RUN apk add --no-cache postgresql-dev libpng-dev libzip-dev zip \
    && docker-php-ext-install pdo pdo_pgsql


# Cài đặt Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy toàn bộ mã nguồn vào container
COPY . .

RUN composer install --no-dev --optimize-autoloader

CMD ["php-fpm"]
