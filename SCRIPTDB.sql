CREATE DATABASE VETERINARY; 

USE VETERINARY; 

CREATE TABLE User(
	idUser CHAR(36) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL,
    birthday DATE NOT NULL,
    dni CHAR(8) NOT NULL UNIQUE,
    telephone CHAR(9) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    password VARCHAR(60) NOT NULL,
    role CHAR(1) NOT NULL DEFAULT('U')
);

CREATE TABLE Pet(
	idPet CHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    species VARCHAR(50) NOT NULL,
    race VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL,
    weight DECIMAL(5,2) NOT NULL,
    birthday DATE NOT NULL,
    idUser CHAR(36) NOT NULL,
    FOREIGN KEY (idUser) REFERENCES User(idUser)
);


CREATE TABLE Appointment(
	idAppointment CHAR(36) PRIMARY KEY, 
    date DATE NOT NULL,
    startTime TIME NOT NULL,
	endTime TIME NOT NULL,
    reason VARCHAR(200) NOT NULL,
    state CHAR(1) DEFAULT('p'),
    idVeterinary CHAR(36) NOT NULL,
    idPet CHAR(36) NOT NULL,
    FOREIGN KEY (idVeterinary) REFERENCES User(idUser),
    FOREIGN KEY (idPet) REFERENCES Pet(idPet)
);


CREATE TABLE Diagnostic(
	idDiagnostic CHAR(36) PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(200) NOT NULL,
    reason VARCHAR(200) NOT NULL,
    treatment VARCHAR(500) NOT NULL,
    idAppointment CHAR(36) NOT NULL,
	FOREIGN KEY (idAppointment) REFERENCES Appointment(idAppointment)
);