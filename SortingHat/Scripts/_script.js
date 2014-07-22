var app = angular.module("myApp", []);
app.factory("Students", function () {
    return [];
});
app.factory("Houses", function () {
    return [
            { name: "Gryffindor", crest: "/Images/Gryffindorcrest.jpg" },
            { name: "Ravenclaw", crest:"/Images/Ravenclawcrest.jpg" },
            { name: "Slytherin", crest: "/Images/Slytherincrest.jpg" },
            { name: "Hufflepuff", crest:"/Images/Hufflepuffcrest.jpg" }
    ];
});
app.controller("SortingHatController",
    function ($scope, $http, Students, Houses) {
        $scope.houses = Houses;
        $scope.students = Students;
        $scope.addStudent = function (student) {
            var newStudent = { name: student.name, house: student.house };
            $http.post("https://testalex2.firebaseio.com/.json", newStudent)
            .success(function (data) {
                newStudent.id = data.name;
                $scope.students.push(newStudent);
                student.name = "";
                student.house = "";
            })
            .error(function (data) {
                Console.log(JSON.stringify(data));
            }) 
        };
        $http.get("https://testalex2.firebaseio.com/.json")
        .success(function (data) {
            for (var s in data) {
                data[s].id = s;
                $scope.students.push(data[s]);
            }
        })
        .error(function () {
            console.log("Error on Get")
        })
    });
app.controller("HousesController", function ($scope, $http, Students, Houses) {
    $scope.students = Students;
    $scope.houses = Houses;
    //Delete student function
    $scope.deleteStudent = function (student) {
        $http.delete("https://testalex2.firebaseio.com/" + student.id + "/.json")
        .success(function () {
            $scope.students.splice($scope.students.indexOf(student), 1);
        })
        .error(function (data) {
            console.log("Errror on delete:" + JSON.stringify(data));
        });
    };
    //Edit Student Function
    $scope.editStudent = function (student) {
        $scope.aStudent = { name: student.name, house: student.house, id: student.id };
        $("#editModal").modal();
    };
    //Save changes on a student
    $scope.saveStudent = function (student) {
        $http({
            method:"PATCH", 
            url:"https://testalex2.firebaseio.com/" + student.id + "/.json",
            data: { name: student.name, house: student.house }
        })
        .success(function () {
            //alert();
            $("#editModal").modal("hide");
            $scope.students[
                $scope.students.map(function (x) {return x.id}).indexOf(student.id)            ] = student;
        })
        .error(function (data) { alert("Awwwww: " + JSON.stringify(data)) });
    }
    $scope.getCrest = function (house) {
        return $scope.houses[
            $scope.houses.map(function (x) { return x.name }).indexOf(house)
        ].crest;
    }
});

