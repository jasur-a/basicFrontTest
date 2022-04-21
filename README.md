Se utiliza jso-server para emular endpoints Fake, primero se deben realizar los siguientes pasos:

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

## Verificar que la api esté corriendo

Ve al navegador e ingresa

```
http://localhost:3000
```
o si deseas ver una tabla de la bd

```
http://localhost:3000/users
http://localhost:3000/products
```