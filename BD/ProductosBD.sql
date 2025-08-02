-- Crear usuario MySQL con todos los permisos
CREATE USER IF NOT EXISTS 'admin_user'@'localhost' IDENTIFIED BY 'admin123';
GRANT ALL PRIVILEGES ON productos_react.* TO 'admin_user'@'localhost';
FLUSH PRIVILEGES;

-- Base de datos y tablas
DROP DATABASE IF EXISTS productos_react;
CREATE DATABASE productos_react;
USE productos_react;

DROP TABLE IF EXISTS PRODUCTO;
DROP TABLE IF EXISTS CATEGORIA;
DROP TABLE IF EXISTS USUARIO;

CREATE TABLE CATEGORIA (
   ID_CATEGORIA INT NOT NULL COMMENT 'identificador �nico de la categor�a',
   NOMBRE_CATEGORIA VARCHAR(100) NOT NULL COMMENT 'nombre de la categor�a a la que pueden pertenecer los productos',
   DESCRIPCION_CATEGORIA VARCHAR(255) COMMENT 'descripci�n de esa categor�a.',
   PRIMARY KEY (ID_CATEGORIA)
);
ALTER TABLE CATEGORIA COMMENT 'entidad categor�a que pertenece a un producto';

CREATE TABLE PRODUCTO (
   ID_PRODUCTO INT NOT NULL,
   ID_CATEGORIA INT NOT NULL COMMENT 'identificador �nico de la categor�a',
   NOMBRE_PRODUCTO VARCHAR(100) NOT NULL COMMENT 'nombre del producto',
   DESCRIPCION_PRODUCTO VARCHAR(500) COMMENT 'detalle del producto',
   PRECIO_PRODUCTO DECIMAL(10,2) NOT NULL COMMENT 'precio correspondiente al producto',
   IMG_URL_PRODUCTO VARCHAR(500) COMMENT 'campo para ingresar el url de la imagen y que se muestre en el frontend',
   IVA_PRODUCTO BOOL COMMENT 'campo que verifica si un producto tiene iva o no tiene iva',
   PRIMARY KEY (ID_PRODUCTO)
);
ALTER TABLE PRODUCTO COMMENT 'entidad del producto en el sistema, se puede crear, modificar y eliminar';

CREATE TABLE USUARIO (
   ID_USUARIO INT NOT NULL COMMENT 'identificador �nico del usuario',
   NOMBRE_USUARIO VARCHAR(100) NOT NULL COMMENT 'nombre del usuario que se registra en el sistema',
   USERNAME_USUARIO VARCHAR(100) NOT NULL COMMENT 'nombre de usuario que se registra en el sistema eje: leodlc, johndoe3',
   CORREO_USUARIO VARCHAR(100) COMMENT 'correo del usuario ej: leodlc@gmail.com, sirve tambi�n para la autenticaci�n con google',
   CONTRASENIA_USUARIO VARCHAR(500) NOT NULL COMMENT 'contrasenia del usuario, su longitud es la m�xima debido a que est� encriptada',
   IMG_URL_USUARIO VARCHAR(500) COMMENT 'campo para ingresar la URL de la imagen de perfil del usuario, visible en el frontend',
   PRIMARY KEY (ID_USUARIO)
);
ALTER TABLE USUARIO COMMENT 'entidad que usa el sistema';

ALTER TABLE PRODUCTO ADD CONSTRAINT FK_TIENE
   FOREIGN KEY (ID_CATEGORIA)
   REFERENCES CATEGORIA (ID_CATEGORIA)
   ON DELETE RESTRICT
   ON UPDATE RESTRICT;
