var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');
 
db.serialize(function() {
  db.run("CREATE TABLE CLASSROOM (BUILDING VARCHAR(20),ROOM_NUMBER NUMERIC, CAPACITY NUMERIC)");
  db.run("CREATE TABLE DEPARTMENT (DEPT_NAME VARCHAR(20),BUILDING VARCHAR(20), BUDGET NUMERIC)");


  //Array of rooms 
    var rooms = [new Building("Packard",101,500),
    new Building("Painter",514,10),
    new Building("Taylor",3128,70),
    new Building("Watson",100,30),
    new Building("Watson",120,50),
     ];

  //Array of depts
    var depts = [new Department("Biology","Watson",90000),
    new Department("Comp Sci", "Taylor", 100000),   
    new Department("Elec. Eng","Taylor",85000),
    new Department("Finance","Painter",1200000),
    new Department("History","Painter",50000),
    new Department("Music","Packard",80000),
    new Department("Physics","Watson",70000)];
  
  
  var statement1 = db.prepare("INSERT INTO CLASSROOM VALUES (?,?,?)");
  var statement2 = db.prepare("INSERT INTO DEPARTMENT VALUES (?,?,?)")
  for (var i = 0; i < rooms.length; i++) {
    statement1.run(rooms[i].Building,rooms[i].Room_number,rooms[i].Capacity);
  }
      statement1.finalize();

  for(var j = 0;j < depts.length;j++){
    statement2.run(depts[j].Dept_name,depts[j].Building,depts[j].Budget);
  }
      statement2.finalize();
 


  db.each("SELECT ROOM_NUMBER AS rm,  BUILDING as b FROM CLASSROOM where Capacity > 50", function(err, row) {
      console.log(row.rm + ": " + row.b);
  });
  
  db.each("SELECT DEPT_NAME FROM DEPARTMENT where Budget>85000", function(err, row) {
    console.log("Department Name:: "+row.DEPT_NAME );
  }); 
  
  db.each("SELECT d.DEPT_NAME, SUM(c.CAPACITY) CAPACITY from Department d INNER JOIN classroom c WHERE d.BUILDING = c.BUILDING group by d.DEPT_NAME", function(err,row){
    console.log("Department Name:: "+row.DEPT_NAME+" and Capacity: "+row.CAPACITY);
  })
  
});



 
db.close();

function Building(Building,Room_number,Capacity){
    this.Building = Building;
    this.Room_number = Room_number;
    this.Capacity = Capacity;
}

function Department(Dept_name,Building,Budget){
    this.Dept_name = Dept_name;
    this.Building = Building;
    this.Budget = Budget;
}
