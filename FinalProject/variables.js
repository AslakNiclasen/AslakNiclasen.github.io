//some variables for histograms
var states = ["AL", "AR", "AZ", "CA", "CO", "CT", "DE", "FE",
              "FL", "GA", "ID", "IL", "IN", "KY", "LA", "MD",
              "MO", "MS", "MT", "NC", "NE", "NM", "NV", "OH",
              "OK", "OR", "PA", "SC", "SD", "TN", "TX", "UT",
              "VA", "WA", "WY"];

var races = ["White", "Latino", "Black", "Native American", "Asian", "Other"];
var method = ["Electrocution", "Lethal Injection", "Hanging", "Gas Chamber", "Firing Squad"];
var sexes = ["Male", "Female"];
var ages = [];
count = 0;
for (h = 0; h < 81; h++) {
	ages[h] = count;
	count = count + 1;
}

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