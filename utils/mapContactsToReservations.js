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

});


function mapContactInfo(addressJSON) {

  var rsvpCodes = [];

  var i = 0;

  var reservations = _.map(addressJSON, function(reservation) {

    reservation.id = i++;
    reservation.isInvitedToRehearsalDinner = false;
    reservation.isAttendingBigDay = false;
    reservation.isAttendingRehearsalDinner = false;

    reservation.addressArray = [reservation.addressTitle,
                                reservation.addressLineOne,
                                reservation.addressLineTwo,
                                reservation.addressCity,
                                reservation.addressState,
                                reservation.addressZipCode
                                ];

    reservation.rsvpCodeSource = reservation.addressArray.join('|');

    reservation.rsvpCode = md5(reservation.rsvpCodeSource).substring(0,6);

    rsvpCodes.push( reservation.rsvpCode );

    return reservation;
  });

  console.log( rsvpCodes );

  return reservations;
}
