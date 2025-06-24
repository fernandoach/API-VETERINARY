CREATE DATABASE VETERINARY; 

USE VETERINARY; 

CREATE TABLE User(
	idUser CHAR(36) PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    gender CHAR(1) NOT NULL,
    birthday DATE NOT NULL,
    dni CHAR(8) NOT NULL,
    telephone CHAR(9) NOT NULL,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(60) NOT NULL,
    role CHAR(1) NOT NULL DEFAULT('u')
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
    state CHAR(1) DEFAULT('P'),
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

#SELECT * from User;

#INSERT INTO Pet (
#  idPet, name, species, race, gender, weight, birthday, idUser
#) VALUES
#(uuid(), 'Firulais', 'Perro', 'Labrador', 'M', 25.50, '2020-03-15', 'a3a9297e-508f-11f0-b92f-0a002700000f'),
#(uuid(), 'Michi', 'Gato', 'Siames', 'F', 4.20, '2021-08-10', 'a3a9297e-508f-11f0-b92f-0a002700000f'),
#(uuid(), 'Rocky', 'Perro', 'Bulldog', 'M', 20.00, '2019-01-20', 'a3a9297e-508f-11f0-b92f-0a002700000f'),
#(uuid(), 'Luna', 'Gato', 'Persa', 'F', 3.80, '2022-05-05', 'a3a9297e-508f-11f0-b92f-0a002700000f'),
#(uuid(), 'Max', 'Perro', 'Pastor Alemán', 'M', 30.00, '2021-11-25', 'a3a9297e-508f-11f0-b92f-0a002700000f');
