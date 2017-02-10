describe("reservationQuery", function() {
  var reservationQuery = require('../index.js');
  var reservations = require('../test-case.json');
  var resQuery;

  describe("calculateStay", function() {
    beforeEach(function() {
      resQuery = new reservationQuery();

    });

    it("should be able to calculate lengths of stay", function() {
      var stay = resQuery.calculateStay(resQuery.start, resQuery.end);
      expect(stay).toEqual(3);
      expect(stay).toBeTruthy;
      expect(resQuery.gapCheck(4)).not.toBeNull();
    });
  });

  describe("gapCheck", function() {
    beforeEach(function() {
      resQuery = new reservationQuery();

    });

    it("matches an integer to the set gap rules", function() {
      expect(resQuery.gapCheck(2)).toEqual(true);
      expect(resQuery.gapCheck(3)).toEqual(true);
      expect(resQuery.gapCheck(4)).not.toBeNull();
      expect(resQuery.gapCheck(4)).toEqual(false);
    });

  });

  describe("getCurrentReservations", function() {
    beforeEach(function() {
      resQuery = new reservationQuery();
      resQuery.getCurrentReservations();
    });

    it("groups reservations by campsite", function() {

      function isEmpty(obj) {
        for(var prop in obj) {
            if(obj.hasOwnProperty(prop))
                return false;
        }
        return JSON.stringify(obj) === JSON.stringify({});
      }
      expect(isEmpty(resQuery.campsites)).toEqual(false);

    });

  });

  describe("matchCampsites", function() {
    beforeEach(function() {
      resQuery = new reservationQuery();
      resQuery.matchCampsites();
    });

    it("matches campsites respecting availability and gap rules", function() {
      var camps = reservations.campsites;
      var matches = []
      for (var key in resQuery.campsites) {
        camps.forEach(function(c){
          if(key == c.id){
            matches.push(c.name);
          }
        })
      }
      expect(matches).toEqual(['Daniel Boone Bungalow', 'Teddy Rosevelt Tent Site', 'Bear Grylls Cozy Cave', 'Wyatt Earp Corral']);
    });

  });

});
