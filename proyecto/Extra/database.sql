create database db_so1;

use db_so1;

DROP TABLE IF EXISTS  Votos_data;

CREATE TABLE Votos_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sede INT NOT NULL,
    municipio VARCHAR(255) NOT NULL,
    departamento VARCHAR(255) NOT NULL,
    papeleta VARCHAR(255) NOT NULL,
    partido VARCHAR(255) NOT NULL
);
