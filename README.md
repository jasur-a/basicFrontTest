## Instalar paquetes:

Primero necesitamos instalar los paquetes necesarios para correr json-server, para ello nos ubicamos en la consola en la carpeta del proyecto y ejecutamos:

```
npm install
```

## Correr el servidor:

Una vez instalados los paquetes necesitamos correr el servidor y que se quede viendo nuestro archivo db.json, para ello ejecutamos:

```
json-server --watch db/db.json
```
o 
```
npm start
```

## Verificar que la api ste corriendo

Ve al navegador  ingresa

```
http://localhost:3000
```
o si deseas ver una tabla de la bd

```
http://localhost:3000/users
http://localhost:3000/products
```