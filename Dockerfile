FROM redis
COPY redis.conf /usr/local/etc/redis/redis.conf
COPY insert.lua /
CMD [ "redis-server", "/usr/local/etc/redis/redis.conf" ]
