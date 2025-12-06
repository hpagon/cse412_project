-- Base tables first (people, course, location, clubs, event)
\copy people(asuid,dob,asuriteuserid,password,firstname,lastname,middlename) FROM 'backend/data/People.csv' WITH (FORMAT csv, HEADER true);

\copy course(courseid,creditnumber,coursename) FROM 'backend/data/Course.csv' WITH (FORMAT csv, HEADER true);

\copy location(locationid,campus,roomnumber,building) FROM 'backend/data/Location.csv' WITH (FORMAT csv, HEADER true);

\copy clubs(clubid,name,description,membercount) FROM 'backend/data/Clubs.csv' WITH (FORMAT csv, HEADER true);

\copy event(eventid,endtime,starttime,date) FROM 'backend/data/Event.csv' WITH (FORMAT csv, HEADER true);

-- Subclass tables
\copy students(asuid,enrollmentdate,graddate,creditsearned,major,minor,gpa) FROM 'backend/data/Students.csv' WITH (FORMAT csv, HEADER true);

\copy professors(asuid,officenumber,hiredate,salary,rank) FROM 'backend/data/Professors.csv' WITH (FORMAT csv, HEADER true);

-- Relationship / join tables (after referenced rows exist)
-- make sure the filename matches what's in your data/ folder. rename if needed.
\copy teaches(asuid,courseid) FROM 'backend/data/Teachers.csv' WITH (FORMAT csv, HEADER true);

\copy attends_course(asuid,courseid) FROM 'backend/data/Attends_Course.csv' WITH (FORMAT csv, HEADER true);

\copy foundin_course(courseid,locationid) FROM 'backend/data/FoundIn_Course.csv' WITH (FORMAT csv, HEADER true);

\copy attends_club(asuid,clubid) FROM 'backend/data/Attends_Club.csv' WITH (FORMAT csv, HEADER true);

\copy host(clubid,eventid) FROM 'backend/data/Host.csv' WITH (FORMAT csv, HEADER true);

\copy foundin_event(eventid,locationid) FROM 'backend/data/FoundIn_Event.csv' WITH (FORMAT csv, HEADER true);
