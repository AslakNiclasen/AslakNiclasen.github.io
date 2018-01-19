//some variables for histograms
var states = ["AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FE",
              "FL", "GA", "ID", "IL", "IN", "KY", "LA", "MD",
              "MO", "MS", "MT", "NC", "NE", "NM", "NV", "OH",
              "OK", "OR", "PA", "SC", "SD", "TN", "TX", "UT",
              "VA", "WA", "WY"];

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

// ages are binned with 10 year intervals
var tt = [20,21,22,23,24,25,26,27,28,29];
var tf = [30,31,32,33,34,35,36,37,38,39];
var ff = [40,41,42,43,44,45,46,47,48,49];
var fs = [50,51,52,53,54,55,56,57,58,59];
var ss = [60,61,62,63,64,65,66,67,68,69];
var se = [70,71,72,73,74,75,76,77,78,79];

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

// grouping all instances within a year together.
var year1977 = [];
var year1978 = [];
var year1979 = [];
var year1980 = [];
var year1981 = [];
var year1982 = [];
var year1983 = [];
var year1984 = [];
var year1985 = [];
var year1986 = [];
var year1987 = [];
var year1988 = [];
var year1989 = [];
var year1990 = [];
var year1991 = [];
var year1992 = [];
var year1993 = [];
var year1994 = [];
var year1995 = [];
var year1996 = [];
var year1997 = [];
var year1998 = [];
var year1999 = [];
var year2000 = [];
var year2001 = [];
var year2002 = [];
var year2003 = [];
var year2004 = [];
var year2005 = [];
var year2006 = [];
var year2007 = [];
var year2008 = [];
var year2009 = [];
var year2010 = [];
var year2011 = [];
var year2012 = [];
var year2013 = [];
var year2014 = [];
var year2015 = [];
var year2016 = [];
var year2017 = [];

// Race Age variables
var white2030 = [];
var white3040 = [];
var white4050 = [];
var white5060 = [];
var white6070 = [];
var white7080 = [];
var latino2030 = [];
var latino3040 = [];
var latino4050 = [];
var latino5060 = [];
var latino6070 = [];
var latino7080 = [];
var american2030 = [];
var american3040 = [];
var american4050 = [];
var american5060 = [];
var american6070 = [];
var american7080 = [];        
var asian2030 = [];
var asian3040 = [];
var asian4050 = [];
var asian5060 = [];
var asian6070 = [];
var asian7080 = [];
var black2030 = [];
var black3040 = [];
var black4050 = [];
var black5060 = [];
var black6070 = [];
var black7080 = [];
var other2030 = [];
var other3040 = [];
var other4050 = [];
var other5060 = [];
var other6070 = [];
var other7080 = [];

//Race State variables
var whiteAL = [];
var whiteAR = [];
var whiteAZ = [];
var whiteCA = [];
var whiteCO = [];
var whiteCT = [];
var whiteDE = [];
var whiteFE = [];
var whiteFL = [];
var whiteGA = [];
var whiteID = [];
var whiteIL = [];
var whiteIN = [];
var whiteKY = [];
var whiteLA = [];
var whiteMD = [];
var whiteMO = [];
var whiteMS = [];
var whiteMT = [];
var whiteNC = [];
var whiteNE = [];
var whiteNM = [];
var whiteNV = [];
var whiteOH = [];
var whiteOK = [];
var whiteOR = [];
var whitePA = [];
var whiteSC = [];
var whiteSD = [];
var whiteTN = [];
var whiteTX = [];
var whiteUT = [];
var whiteVA = [];
var whiteWA = [];
var whiteWY = [];
var latinoAL = [];
var latinoAR = [];
var latinoAZ = [];
var latinoCA = [];
var latinoCO = [];
var latinoCT = [];
var latinoDE = [];
var latinoFE = [];
var latinoFL = [];
var latinoGA = [];
var latinoID = [];
var latinoIL = [];
var latinoIN = [];
var latinoKY = [];
var latinoLA = [];
var latinoMD = [];
var latinoMO = [];
var latinoMS = [];
var latinoMT = [];
var latinoNC = [];
var latinoNE = [];
var latinoNM = [];
var latinoNV = [];
var latinoOH = [];
var latinoOK = [];
var latinoOR = [];
var latinoPA = [];
var latinoSC = [];
var latinoSD = [];
var latinoTN = [];
var latinoTX = [];
var latinoUT = [];
var latinoVA = [];
var latinoWA = [];
var latinoWY = [];
var blackAL = [];
var blackAR = [];
var blackAZ = [];
var blackCA = [];
var blackCO = [];
var blackCT = [];
var blackDE = [];
var blackFE = [];
var blackFL = [];
var blackGA = [];
var blackID = [];
var blackIL = [];
var blackIN = [];
var blackKY = [];
var blackLA = [];
var blackMD = [];
var blackMO = [];
var blackMS = [];
var blackMT = [];
var blackNC = [];
var blackNE = [];
var blackNM = [];
var blackNV = [];
var blackOH = [];
var blackOK = [];
var blackOR = [];
var blackPA = [];
var blackSC = [];
var blackSD = [];
var blackTN = [];
var blackTX = [];
var blackUT = [];
var blackVA = [];
var blackWA = [];
var blackWY = [];

var m2030 = [];
var m3040 = [];
var m4050 = [];
var m5060 = [];
var m6070 = [];
var m7080 = [];
var f2030 = [];
var f3040 = [];
var f4050 = [];
var f5060 = [];
var f6070 = [];
var f7080 = [];

var v1_2030 = [];
var v2_2030 = [];
var v3_2030 = [];
var v4_2030 = [];
var v5_2030 = [];
var v6_2030 = []; // above 5

var v1_3040 = [];
var v2_3040 = [];
var v3_3040 = [];
var v4_3040 = [];
var v5_3040 = [];
var v6_3040 = []; // above 5

var v1_4050 = [];
var v2_4050 = [];
var v3_4050 = [];
var v4_4050 = [];
var v5_4050 = [];
var v6_4050 = []; // above 5

var v1_5060 = [];
var v2_5060 = [];
var v3_5060 = [];
var v4_5060 = [];
var v5_5060 = [];
var v6_5060 = []; // above 5

var v1_6070 = [];
var v2_6070 = [];
var v3_6070 = [];
var v4_6070 = [];
var v5_6070 = [];
var v6_6070 = []; // above 5

var v1_7080 = [];
var v2_7080 = [];
var v3_7080 = [];
var v4_7080 = [];
var v5_7080 = [];
var v6_7080 = []; // above 5