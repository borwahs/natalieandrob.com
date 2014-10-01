var fs = require('fs');
var path = require('path');
var CSVParse = require('babyparse');
var _ = require('../server/libs/underscore.1.6.0.min');
var md5 = require('MD5');

var filePath = path.join(__dirname, 'guestlist.csv');

fs.readFile(filePath, "utf-8", function (err, data) {
  if (err) {
    console.log( err );
  }

  //console.log( data );

  var csvParse = CSVParse.parse( data, { header: true } );

  var addressJSON = mapContactInfo(csvParse.data);

  //console.log( addressJSON );

  var strAddressJSON = JSON.stringify(addressJSON, undefined, 2);

  var newJSONFile = path.join(__dirname, 'guestlist.json');

  fs.writeFile(newJSONFile, strAddressJSON, function (err) {
    if (err) return console.log(err);
  });

  var addressJSONStripped = _.map(addressJSON, function(reservation) {



    delete reservation["contacts"];
    delete reservation["addressContacts"];
    delete reservation["addressLineOne"];
    delete reservation["addressLineTwo"];
    delete reservation["addressCity"];
    delete reservation["addressState"];
    delete reservation["addressZipCode"];
    delete reservation["id"];
    delete reservation["isInvitedToRehearsalDinner"];
    delete reservation["addressArray"];

    return reservation;

  });

  console.log(addressJSONStripped);

  var newCSV = CSVParse.unparse(addressJSONStripped);

  var newCSVFile = path.join(__dirname, 'guestlistwithcode.csv');

  fs.writeFile(newCSVFile, newCSV, function (err) {
    if (err) return console.log(err);
  });


});


function mapContactInfo(addressJSON) {

  var rsvpCodes = [];

  var i = 0;

  var reservations = _.map(addressJSON, function(reservation) {

    reservation.id = i++;
    reservation.isInvitedToRehearsalDinner = false;



    var contactsInvitedToRehearsalDinner = false;
    if (reservation.makeItAWeekend === "Yes")
    {
      reservation.isInvitedToRehearsalDinner = true;
      contactsInvitedToRehearsalDinner = true;
    }


    var namesList = reservation.addressContacts.split(",");

    var contacts = _.map(namesList, function(reservationContactName) {
      var contact = {};

      contact.firstName = null;
      contact.lastName = null;
      contact.isInvitedToRehearsalDinner = contactsInvitedToRehearsalDinner;
      contact.isAttendingBigDay = -1;
      contact.isAttendingRehearsalDinner = -1;

      var contactNameSplit = reservationContactName.trim().split(" ");


      if (contactNameSplit.length == 1 && contactNameSplit[0] === "????") {
        contact.firstName = "";
        contact.lastName = "";

        return contact;
      }

      if (contactNameSplit.length >= 2) {
        contact.firstName = contactNameSplit[0] === "????" ? "" : contactNameSplit[0];
        contact.lastName = contactNameSplit[1] === "????" ? "" : contactNameSplit[1];
        return contact
      }

    });


    reservation.addressArray = [reservation.addressTitle,
                                reservation.addressLineOne,
                                reservation.addressLineTwo,
                                reservation.addressCity,
                                reservation.addressState,
                                reservation.addressZipCode,
                                contacts.length
                                ];

    reservation.contacts = contacts;

    reservation.numContacts = contacts.length;

    reservation.rsvpCodeSource = reservation.addressArray.join('|');

    reservation.rsvpCode = md5(reservation.rsvpCodeSource).substring(0,6);

    rsvpCodes.push( reservation.rsvpCode );

    return reservation;
  });

  return reservations;
}
