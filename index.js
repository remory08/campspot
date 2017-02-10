var reservations = require('./test-case.json');

function reservationQuery(){
  this.search = reservations.search;
  this.start = new Date(this.search.startDate.split('-'));
  this.end = new Date(this.search.endDate.split('-'));
  this.calculateStay = function(date1, date2) {
    var one_day=1000*60*60*24;
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    var difference_ms = date2_ms - date1_ms;
    return Math.round(difference_ms/one_day);
  }
  this.stay = this.calculateStay(this.start, this.end);
  this.campsites = {};
  this.currentRes = reservations.reservations;
  this.gapCheck = function(gap){
    var gRules = reservations.gapRules,
        gapRules= [];
    gRules.forEach(function(g){
      gapRules.push(g.gapSize);
    })
    var check = false;
    gapRules.forEach(function(g){
      if (g == gap){
        check = true;
      }
    })
    return check;
  }
}

reservationQuery.prototype.getCurrentReservations = function () {
  var campsites = this.campsites;
  this.currentRes.forEach(function(rez){
    if (campsites[rez.campsiteId]){
      campsites[rez.campsiteId].push(rez);
    }
    else {
      campsites[rez.campsiteId] = [];
      campsites[rez.campsiteId].push(rez);
    }
  })
}

reservationQuery.prototype.matchCampsites = function(){
  this.getCurrentReservations();
  for (var key in this.campsites) {

    var x = this.start,
        y = this.end,
        res = this.campsites[key],
        calculateStay = this.calculateStay,
        gapCheck = this.gapCheck,
        campsites = this.campsites

    res.forEach(function(r){
      var a = new Date(r.startDate)
      var b = new Date(r.endDate)

      if (Math.min(x, y) <= Math.max(a, b) && Math.max(x, y) >= Math.min(a, b)) {
        delete campsites[key];
      }
      else if(Math.min(x,y) < Math.max(a,b)){
        var gap = calculateStay(y,a) - 1;
          if (gapCheck(gap)){
            delete campsites[key];
          }
      }
      else if(Math.max(x,y) > Math.min(a,b)){
        var gap = calculateStay(b, x) - 1;
        if (gapCheck(gap)){
          delete campsites[key];
        }
      }
    })
  }

  var camps = reservations.campsites;

  for (var key in this.campsites) {
    camps.forEach(function(c){
      if(key == c.id){
        console.log(c.name);
      }
    })
  }
}

module.exports= reservationQuery;

var Ryne = new reservationQuery();
Ryne.matchCampsites();
