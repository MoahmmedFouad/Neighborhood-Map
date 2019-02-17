// variable for ClientId and ClientSecret To Make Request to FourSqaure
var clientID , clientSecret ,map;
//array to save infoWindows that opened
var ListOfViewpoint = [];

// Locations

var AllLocations = [
    
    {
        LocName: 'Al Yasser Language School YLS',
        lat: 30.007002,
        long:  31.486486,
        country:"Egypt"
    },
    {
        LocName: 'Zizinia New Cairo',
        lat: 30.007887,
        long: 31.493157,
        country:"Egypt"
    },
    
    {
        LocName: 'point 90 cinema',
        lat: 30.020321,
        long: 31.495028,
        country:"Egypt"
    },
    {
        LocName: 'Di Milano Pizza',
        lat: 30.006809,
        long: 31.493458,
        country:"Egypt"
    },
    {
        LocName: 'Masjed Zizinya',
        lat: 30.006884,
        long: 31.493940,
        country:"Egypt"
    },
    {
        LocName: 'Zizinia Family Housing',
        lat: 30.003060,
        long: 31.490604,
        country:"Egypt"
    },
    
    {
        LocName: 'Amirican University In cairo',
        lat: 30.018923,
        long: 31.499674,
        country:"Egypt"
    },
    
    {
        LocName: 'Tiba(New Cairo)',
        lat: 30.011574,
        long: 31.491995,
        country:"Egypt"
    },
    {
        LocName: 'South Investor Area (New Cairo)',
        lat: 30.014120,
        long: 31.485607,
        country:"Egypt"
    }
    
];

/* 
this Function to make request to foursquare to get place data and setting markers and
and infoWindows
*/ 
var GetLocation = function(place) {
	var self = this;
	this.LocName = place.LocName;
	this.lat = place.lat;
	this.long = place.long;
	this.street = "";
	this.city = "";
    this.country = place.country;
    
    clientID = "YE5LOISYIPZLL05FYCM24UJZEJQ1ZJN2DBWP3RDH1TWJRQIL";
    clientSecret ="1DONIENX1A4SBIK035FMQEGD4C2JWX4CEJRA1K1WFTSKJMTL";
    // setting URL
	var PlaceURLFromFourSquare = 'https://api.foursquare.com/v2/venues/search?ll='+ this.lat + ',' + this.long + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20180000' + '&query=' + this.LocName;
    // Make Request
    fetch(PlaceURLFromFourSquare).then(function(response){
        // get response
        return response.json();
    }).then(function(place){
        // save data that get from response
        var results = place.response.venues[0];
		self.street = results.location.formattedAddress[0];
     	self.city = results.location.formattedAddress[1];  
    }).catch(function(){
        // Handle Error Connection
        alert("There Was an Error , Please retry The Page ");
    });
    
	this.infoWindow = new google.maps.InfoWindow(); // set infoWindow
    // set markers
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(place.lat, place.long),
			map: map,
			title: place.LocName
	});
    // this function check if this Location Visible in ListOfLocations
	this.showMarker = function(check){
      if(check){
          this.marker.setVisible(true);
      }
      else{
          this.marker.setVisible(false);
      }
    };
    // add event When Click on marker to show the user information about location
	this.marker.addListener('click', function(){
		this.contentString = '<div>'+'<h3>'+place.LocName+'</h3>'+'<p>'+"Countery: "+ self.country+'</p>'+'<p>'+"City: "+ self.city+'</p>'+'<p>'+"Street: "+ self.street+'</p>'+'</div>';
        self.infoWindow.setContent(this.contentString);
        ListOfViewpoint.forEach(function(ViewPointItem){
            ViewPointItem.close();
        });
        ListOfViewpoint.push(self.infoWindow);
		self.infoWindow.open(map, this);

		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 3000);
	});
    // when click on any location in location list , click on the marker
	this.Toshow = function() {
		google.maps.event.trigger(self.marker, 'click');
	};
};
// Initialization the map
function INTIMAP(){
     return new google.maps.Map(document.getElementById('map'), {
			zoom: 15,
			center: {lat: 30.00971, lng:  31.491318}
	});
}

function ViewModel() {
	var self = this;
	this.searchLocation = ko.observable("");
	this.ListOfLoc = ko.observableArray([]);
	map =  INTIMAP();
    // get all Locations
	AllLocations.forEach(function(LocItem){
		self.ListOfLoc.push( new GetLocation(LocItem));
	});
    // filtered List upon input location
	this.filteredList =   ko.computed( function() {
        
        this.ListOfLocs = ko.observableArray([]);
        var searchWord = self.searchLocation().toLowerCase();
        for(var i=0;i<this.ListOfLoc().length;i++){
            var LocItem = self.ListOfLoc()[i];
            var LocName = LocItem.LocName.toLowerCase();
            var check = (LocName.search(searchWord) >= 0); // check if searchWord in LocName 
            LocItem.showMarker(check); // if true make marker of this location visible
            if(check){
                self.ListOfLocs.push(LocItem);
            }
        }
        return this.ListOfLocs();
        
	}, self);
}

// Handle the Error
function HandlingTheError() {
	alert("Failed to connect Please try Again");
}
// strat APP
function startApp() {
	ko.applyBindings(new ViewModel());
}

