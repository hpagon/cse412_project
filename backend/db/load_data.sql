\copy People(ASUID,DOB,asuriteUserID,password,firstName,lastName,middleName) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/People.csv' WITH (FORMAT csv, HEADER true);

\copy Students(ASUID,enrollmentDate,gradDate,creditsEarned,Major,Minor,GPA) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Students.csv' WITH (FORMAT csv, HEADER true);

\copy Professors(ASUID,officeNumber,hireDate,salary,rank) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Professors.csv' WITH (FORMAT csv, HEADER true);

\copy Course(courseID,creditNumber,courseName) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Course.csv' WITH (FORMAT csv, HEADER true);

\copy Teaches(ASUID,courseID) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Teachers.csv' WITH (FORMAT csv, HEADER true);

\copy Attends_Course(ASUID,courseID) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Attends_Course.csv' WITH (FORMAT csv, HEADER true);

\copy Location(locationID,campus,roomNumber,building) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Location.csv' WITH (FORMAT csv, HEADER true);

\copy FoundIn_Course(courseID,locationID) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/FoundIn_Course.csv' WITH (FORMAT csv, HEADER true);

\copy Clubs(clubID,name,description,memberCount) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Clubs.csv' WITH (FORMAT csv, HEADER true);

\copy Attends_Club(ASUID,clubID) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Attends_Club.csv' WITH (FORMAT csv, HEADER true);

\copy Event(eventID,endTime,startTime,date) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Event.csv' WITH (FORMAT csv, HEADER true);

\copy Host(clubID,eventID) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/Host.csv' WITH (FORMAT csv, HEADER true);

\copy FoundIn_Event(eventID,locationID) FROM 'C:/Users/colel/Desktop/Comp Sci/CSE 412/cse412_project/backend/data/FoundIn_Event.csv' WITH (FORMAT csv, HEADER true);
