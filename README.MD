# Version Node
nvm install 16.13.0
# el código de lambda para el algoritmo está en un zip lcrFunction.zip
# el código de lambda para los insert en dynamodb está en un zip lambdaInsert.zip

# Instalar:

```bash
docker-compose up -d --build
docker-compose exec redis redis-cli --eval /insert.lua
```

# Ejecutar:
```
npm run start

```
