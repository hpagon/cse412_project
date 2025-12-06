-- Run this file to create all tables

-- Drop tables in reverse dependency order (for reruns)
DROP TABLE IF EXISTS FoundIn_Event CASCADE;
DROP TABLE IF EXISTS Host CASCADE;
DROP TABLE IF EXISTS Event CASCADE;
DROP TABLE IF EXISTS Attends_Club CASCADE;
DROP TABLE IF EXISTS Clubs CASCADE;
DROP TABLE IF EXISTS FoundIn_Course CASCADE;
DROP TABLE IF EXISTS Location CASCADE;
DROP TABLE IF EXISTS Attends_Course CASCADE;
DROP TABLE IF EXISTS Teaches CASCADE;
DROP TABLE IF EXISTS Course CASCADE;
DROP TABLE IF EXISTS Professors CASCADE;
DROP TABLE IF EXISTS Students CASCADE;
DROP TABLE IF EXISTS People CASCADE;

-- People table
CREATE TABLE People (
    ASUID         VARCHAR(20) PRIMARY KEY,
    DOB           DATE,
    asuriteUserID VARCHAR(50),
    password      VARCHAR(100),
    firstName     VARCHAR(50),
    lastName      VARCHAR(50),
    middleName    VARCHAR(50)
);

-- Students
CREATE TABLE Students (
    ASUID          VARCHAR(20) PRIMARY KEY,
    enrollmentDate DATE,
    gradDate       DATE,
    creditsEarned  INT,
    Major          VARCHAR(100),
    Minor          VARCHAR(100),
    GPA            NUMERIC(3,2),
    FOREIGN KEY (ASUID) REFERENCES People(ASUID) ON DELETE CASCADE
);

-- Professors 
CREATE TABLE Professors (
    ASUID        VARCHAR(20) PRIMARY KEY,
    officeNumber VARCHAR(20),
    hireDate     DATE,
    salary       NUMERIC(10,2),
    rank         VARCHAR(50),
    FOREIGN KEY (ASUID) REFERENCES People(ASUID) ON DELETE CASCADE
);

-- Course
CREATE TABLE Course (
    courseID      SERIAL PRIMARY KEY,
    creditNumber  INT,
    courseName    VARCHAR(100)
);

-- Teaches 
CREATE TABLE Teaches (
    ASUID     VARCHAR(20),
    courseID  INT,
    PRIMARY KEY (ASUID, courseID),
    FOREIGN KEY (ASUID)  REFERENCES Professors(ASUID) ON DELETE CASCADE,
    FOREIGN KEY (courseID) REFERENCES Course(courseID) ON DELETE CASCADE
);

-- Attends_Course 
CREATE TABLE Attends_Course (
    ASUID     VARCHAR(20),
    courseID  INT,
    PRIMARY KEY (ASUID, courseID),
    FOREIGN KEY (ASUID)  REFERENCES Students(ASUID) ON DELETE CASCADE,
    FOREIGN KEY (courseID) REFERENCES Course(courseID) ON DELETE CASCADE
);

-- Location
CREATE TABLE Location (
    locationID  SERIAL PRIMARY KEY,
    campus      VARCHAR(100),
    roomNumber  VARCHAR(20),
    building    VARCHAR(100)
);

-- FoundIn_Course
CREATE TABLE FoundIn_Course (
    courseID   INT,
    locationID INT,
    PRIMARY KEY (courseID, locationID),
    FOREIGN KEY (courseID)   REFERENCES Course(courseID) ON DELETE CASCADE,
    FOREIGN KEY (locationID) REFERENCES Location(locationID) ON DELETE CASCADE
);

-- Clubs
CREATE TABLE Clubs (
    clubID       SERIAL PRIMARY KEY,
    name         VARCHAR(100),
    description  TEXT,
    memberCount  INT
);

-- Attends_Club 
CREATE TABLE Attends_Club (
    ASUID   VARCHAR(20),
    clubID  INT,
    PRIMARY KEY (ASUID, clubID),
    FOREIGN KEY (ASUID) REFERENCES Students(ASUID) ON DELETE CASCADE,
    FOREIGN KEY (clubID) REFERENCES Clubs(clubID) ON DELETE CASCADE
);

-- Event
CREATE TABLE Event (
    eventID    SERIAL PRIMARY KEY,
    endTime    TIME,
    startTime  TIME,
    date       DATE
);

-- Host
CREATE TABLE Host (
    clubID  INT,
    eventID INT,
    PRIMARY KEY (clubID, eventID),
    FOREIGN KEY (clubID)  REFERENCES Clubs(clubID) ON DELETE CASCADE,
    FOREIGN KEY (eventID) REFERENCES Event(eventID) ON DELETE CASCADE
);

-- FoundIn_Event
CREATE TABLE FoundIn_Event (
    eventID    INT,
    locationID INT,
    PRIMARY KEY (eventID),
    FOREIGN KEY (eventID) REFERENCES Event(eventID) ON DELETE CASCADE,
    FOREIGN KEY (locationID) REFERENCES Location(locationID) ON DELETE CASCADE
);
