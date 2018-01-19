var allYears = [];

var states = ["SC", "AR", "ID", "VA", "TX", "WA", "LA", "MO",
              "OK", "GA", "AL", "FL", "CA", "AZ", "OH", "IN",
              "NC", "DE", "NV", "IL", "PA", "MT", "FE", "UT",
              "MS", "KY", "MD", "OR", "NE", "WY", "CO", "NM",
              "TN", "CT", "SD"];

var races = ["White", "Latino", "Black", "Native American", "Asian", "Other"];
var method = ["Electrocution", "Lethal Injection", "Hanging", "Gas Chamber", "Firing Squad"];
var sexes = ["Male", "Female"];

var victimsBand = ["1","2","3","4","5","> 5"];

var ages = [];
count = 0;
for (h = 0; h < 81; h++) {
	ages[h] = count;
	count = count + 1;
}

var copyOfRaceAge = null;

var agesBand = ["20-30", "30-40", "40-50", "50-60", "60-70","70-80"];

// 1 = Age
// 2 = Race
// 3 = Sex
// 4 = State
// 5 = Type
// 6 = Victim
// 100 = Barplot
var xScatterCounter = 0; // equal to initial date feature
var yScatterCounter = 1; // equal to initial Age feature

var mindate = new Date(1977,0,1);
var maxdate = new Date(1977,11,31);

var colors6 = ["blue", "tomato", "green", "steelblue", "yellow", "gray"];