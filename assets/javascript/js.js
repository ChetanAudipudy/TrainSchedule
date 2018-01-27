/* global moment firebase */
// Initialize Firebase
var config = {
  apiKey: "AIzaSyBGsfur_flDYMeRhWVNRWh0rfPjAmEYVdI",
  authDomain: "trainschedule-d1e7c.firebaseapp.com",
  databaseURL: "https://trainschedule-d1e7c.firebaseio.com",
  projectId: "trainschedule-d1e7c",
  storageBucket: "",
  messagingSenderId: "521296485121"
};
firebase.initializeApp(config);
// Create a variable to reference the database.
var database = firebase.database();

// --------------------------------------------------------------
// Whenever a user clicks the click button
$("#submitBtn").on("click", function(event) {
  event.preventDefault();

  // Get the input values

  var trainName = $("#train-name").val().trim();
  var dest = $("#dest").val().trim();
  var startTime = $("#start-time").val().trim();
  var freq = $("#freq").val().trim();


  database.ref().push({
    trainName: trainName,
    dest: dest,
    startTime: startTime,
    freq: freq,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
});


database.ref().on("child_added", function(childSnapshot) {
 var trainName = childSnapshot.val().trainName;
 var dest = childSnapshot.val().dest;
 var startTime = childSnapshot.val().startTime;    
 var freq = childSnapshot.val().freq;

//Calculations for the next train to arrive and minutes left

var diffTime = moment().diff(moment(startTime, "hh:mm"), "minutes");
var rem = diffTime % freq;
var nextTrain = freq - rem; 
var minAway = moment().add(nextTrain, "minutes");

//Creating table rows

$("#trainTableBody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" +
  freq + "</td><td>" +  minAway.format("hh:mm A") + "</td><td>" + nextTrain + "</td> " + "<td><button class='editbtn'>Edit</button><button class='delbtn'>Delete</button></td></tr>");

  // Handle the errors
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});


$(document).on("click",'.editbtn', function () {
  console.log("asf");
  var currentTD = $(this).parents('tr').find('td');
  if ($(this).html() == 'Edit') {                  
    $.each(currentTD, function () {
      $(this).prop('contenteditable', true)
    });
  } else {
   $.each(currentTD, function () {
    $(this).prop('contenteditable', false)
  });
 }

 $(this).html($(this).html() == 'Edit' ? 'Save' : 'Edit')

});

$('#trainTableBody').on('click', ".delbtn", function(){

  $(this).closest ('tr').remove();

  var dateAdded = $row.data('dateAdded');
  database.ref().child(dateAdded).remove();
 
});

