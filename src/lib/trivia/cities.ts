/** Popular world cities with Pythagorean-style name numbers for reflective trivia.
 * `rank` is familiarity order (1 = most widely recognized); used as tie-break in matching.
 */
export type TriviaCity = {
  name: string;
  country: string;
  nameNumber: number;
  /** Lower = more globally familiar (rough metro / recognition order). */
  rank: number;
};

export const TRIVIA_CITIES: TriviaCity[] = [
  {
    "name": "Tokyo",
    "country": "Japan",
    "nameNumber": 5,
    "rank": 1
  },
  {
    "name": "Delhi",
    "country": "India",
    "nameNumber": 2,
    "rank": 2
  },
  {
    "name": "Shanghai",
    "country": "China",
    "nameNumber": 4,
    "rank": 3
  },
  {
    "name": "Sao Paulo",
    "country": "Brazil",
    "nameNumber": 1,
    "rank": 4
  },
  {
    "name": "Mexico City",
    "country": "Mexico",
    "nameNumber": 9,
    "rank": 5
  },
  {
    "name": "Cairo",
    "country": "Egypt",
    "nameNumber": 1,
    "rank": 6
  },
  {
    "name": "Mumbai",
    "country": "India",
    "nameNumber": 5,
    "rank": 7
  },
  {
    "name": "Beijing",
    "country": "China",
    "nameNumber": 2,
    "rank": 8
  },
  {
    "name": "Dhaka",
    "country": "Bangladesh",
    "nameNumber": 7,
    "rank": 9
  },
  {
    "name": "Osaka",
    "country": "Japan",
    "nameNumber": 2,
    "rank": 10
  },
  {
    "name": "New York",
    "country": "United States",
    "nameNumber": 3,
    "rank": 11
  },
  {
    "name": "Karachi",
    "country": "Pakistan",
    "nameNumber": 6,
    "rank": 12
  },
  {
    "name": "Buenos Aires",
    "country": "Argentina",
    "nameNumber": 2,
    "rank": 13
  },
  {
    "name": "Chongqing",
    "country": "China",
    "nameNumber": 4,
    "rank": 14
  },
  {
    "name": "Istanbul",
    "country": "Turkey",
    "nameNumber": 8,
    "rank": 15
  },
  {
    "name": "Kolkata",
    "country": "India",
    "nameNumber": 8,
    "rank": 16
  },
  {
    "name": "Manila",
    "country": "Philippines",
    "nameNumber": 5,
    "rank": 17
  },
  {
    "name": "Lagos",
    "country": "Nigeria",
    "nameNumber": 9,
    "rank": 18
  },
  {
    "name": "Rio de Janeiro",
    "country": "Brazil",
    "nameNumber": 6,
    "rank": 19
  },
  {
    "name": "Tianjin",
    "country": "China",
    "nameNumber": 5,
    "rank": 20
  },
  {
    "name": "Kinshasa",
    "country": "DR Congo",
    "nameNumber": 1,
    "rank": 21
  },
  {
    "name": "Guangzhou",
    "country": "China",
    "nameNumber": 3,
    "rank": 22
  },
  {
    "name": "Los Angeles",
    "country": "United States",
    "nameNumber": 1,
    "rank": 23
  },
  {
    "name": "Moscow",
    "country": "Russia",
    "nameNumber": 7,
    "rank": 24
  },
  {
    "name": "Shenzhen",
    "country": "China",
    "nameNumber": 9,
    "rank": 25
  },
  {
    "name": "Lahore",
    "country": "Pakistan",
    "nameNumber": 5,
    "rank": 26
  },
  {
    "name": "Bangalore",
    "country": "India",
    "nameNumber": 3,
    "rank": 27
  },
  {
    "name": "Paris",
    "country": "France",
    "nameNumber": 9,
    "rank": 28
  },
  {
    "name": "Bogota",
    "country": "Colombia",
    "nameNumber": 6,
    "rank": 29
  },
  {
    "name": "Jakarta",
    "country": "Indonesia",
    "nameNumber": 8,
    "rank": 30
  },
  {
    "name": "Chennai",
    "country": "India",
    "nameNumber": 9,
    "rank": 31
  },
  {
    "name": "Lima",
    "country": "Peru",
    "nameNumber": 8,
    "rank": 32
  },
  {
    "name": "Bangkok",
    "country": "Thailand",
    "nameNumber": 7,
    "rank": 33
  },
  {
    "name": "Seoul",
    "country": "South Korea",
    "nameNumber": 9,
    "rank": 34
  },
  {
    "name": "Nagoya",
    "country": "Japan",
    "nameNumber": 9,
    "rank": 35
  },
  {
    "name": "Hyderabad",
    "country": "India",
    "nameNumber": 5,
    "rank": 36
  },
  {
    "name": "London",
    "country": "United Kingdom",
    "nameNumber": 2,
    "rank": 37
  },
  {
    "name": "Tehran",
    "country": "Iran",
    "nameNumber": 3,
    "rank": 38
  },
  {
    "name": "Chicago",
    "country": "United States",
    "nameNumber": 1,
    "rank": 39
  },
  {
    "name": "Chengdu",
    "country": "China",
    "nameNumber": 8,
    "rank": 40
  },
  {
    "name": "Nanjing",
    "country": "China",
    "nameNumber": 6,
    "rank": 41
  },
  {
    "name": "Wuhan",
    "country": "China",
    "nameNumber": 4,
    "rank": 42
  },
  {
    "name": "Ho Chi Minh City",
    "country": "Vietnam",
    "nameNumber": 9,
    "rank": 43
  },
  {
    "name": "Luanda",
    "country": "Angola",
    "nameNumber": 8,
    "rank": 44
  },
  {
    "name": "Ahmedabad",
    "country": "India",
    "nameNumber": 3,
    "rank": 45
  },
  {
    "name": "Kuala Lumpur",
    "country": "Malaysia",
    "nameNumber": 3,
    "rank": 46
  },
  {
    "name": "Hong Kong",
    "country": "China",
    "nameNumber": 1,
    "rank": 47
  },
  {
    "name": "Dongguan",
    "country": "China",
    "nameNumber": 2,
    "rank": 48
  },
  {
    "name": "Hangzhou",
    "country": "China",
    "nameNumber": 1,
    "rank": 49
  },
  {
    "name": "Foshan",
    "country": "China",
    "nameNumber": 9,
    "rank": 50
  },
  {
    "name": "Shenyang",
    "country": "China",
    "nameNumber": 3,
    "rank": 51
  },
  {
    "name": "Riyadh",
    "country": "Saudi Arabia",
    "nameNumber": 2,
    "rank": 52
  },
  {
    "name": "Baghdad",
    "country": "Iraq",
    "nameNumber": 9,
    "rank": 53
  },
  {
    "name": "Santiago",
    "country": "Chile",
    "nameNumber": 5,
    "rank": 54
  },
  {
    "name": "Surat",
    "country": "India",
    "nameNumber": 7,
    "rank": 55
  },
  {
    "name": "Madrid",
    "country": "Spain",
    "nameNumber": 4,
    "rank": 56
  },
  {
    "name": "Suzhou",
    "country": "China",
    "nameNumber": 2,
    "rank": 57
  },
  {
    "name": "Pune",
    "country": "India",
    "nameNumber": 2,
    "rank": 58
  },
  {
    "name": "Harbin",
    "country": "China",
    "nameNumber": 7,
    "rank": 59
  },
  {
    "name": "Houston",
    "country": "United States",
    "nameNumber": 4,
    "rank": 60
  },
  {
    "name": "Dallas",
    "country": "United States",
    "nameNumber": 4,
    "rank": 61
  },
  {
    "name": "Toronto",
    "country": "Canada",
    "nameNumber": 9,
    "rank": 62
  },
  {
    "name": "Miami",
    "country": "United States",
    "nameNumber": 9,
    "rank": 63
  },
  {
    "name": "Singapore",
    "country": "Singapore",
    "nameNumber": 5,
    "rank": 64
  },
  {
    "name": "Philadelphia",
    "country": "United States",
    "nameNumber": 2,
    "rank": 65
  },
  {
    "name": "Atlanta",
    "country": "United States",
    "nameNumber": 6,
    "rank": 66
  },
  {
    "name": "Washington",
    "country": "United States",
    "nameNumber": 4,
    "rank": 67
  },
  {
    "name": "Barcelona",
    "country": "Spain",
    "nameNumber": 8,
    "rank": 68
  },
  {
    "name": "Saint Petersburg",
    "country": "Russia",
    "nameNumber": 5,
    "rank": 69
  },
  {
    "name": "Khartoum",
    "country": "Sudan",
    "nameNumber": 8,
    "rank": 70
  },
  {
    "name": "Sydney",
    "country": "Australia",
    "nameNumber": 2,
    "rank": 71
  },
  {
    "name": "Melbourne",
    "country": "Australia",
    "nameNumber": 6,
    "rank": 72
  },
  {
    "name": "Cape Town",
    "country": "South Africa",
    "nameNumber": 7,
    "rank": 73
  },
  {
    "name": "Johannesburg",
    "country": "South Africa",
    "nameNumber": 8,
    "rank": 74
  },
  {
    "name": "Casablanca",
    "country": "Morocco",
    "nameNumber": 3,
    "rank": 75
  },
  {
    "name": "Algiers",
    "country": "Algeria",
    "nameNumber": 8,
    "rank": 76
  },
  {
    "name": "Nairobi",
    "country": "Kenya",
    "nameNumber": 5,
    "rank": 77
  },
  {
    "name": "Addis Ababa",
    "country": "Ethiopia",
    "nameNumber": 8,
    "rank": 78
  },
  {
    "name": "Accra",
    "country": "Ghana",
    "nameNumber": 8,
    "rank": 79
  },
  {
    "name": "Dar es Salaam",
    "country": "Tanzania",
    "nameNumber": 4,
    "rank": 80
  },
  {
    "name": "Alexandria",
    "country": "Egypt",
    "nameNumber": 8,
    "rank": 81
  },
  {
    "name": "Berlin",
    "country": "Germany",
    "nameNumber": 6,
    "rank": 82
  },
  {
    "name": "Rome",
    "country": "Italy",
    "nameNumber": 6,
    "rank": 83
  },
  {
    "name": "Milan",
    "country": "Italy",
    "nameNumber": 4,
    "rank": 84
  },
  {
    "name": "Naples",
    "country": "Italy",
    "nameNumber": 4,
    "rank": 85
  },
  {
    "name": "Vienna",
    "country": "Austria",
    "nameNumber": 2,
    "rank": 86
  },
  {
    "name": "Warsaw",
    "country": "Poland",
    "nameNumber": 4,
    "rank": 87
  },
  {
    "name": "Budapest",
    "country": "Hungary",
    "nameNumber": 7,
    "rank": 88
  },
  {
    "name": "Prague",
    "country": "Czechia",
    "nameNumber": 5,
    "rank": 89
  },
  {
    "name": "Amsterdam",
    "country": "Netherlands",
    "nameNumber": 4,
    "rank": 90
  },
  {
    "name": "Brussels",
    "country": "Belgium",
    "nameNumber": 7,
    "rank": 91
  },
  {
    "name": "Lisbon",
    "country": "Portugal",
    "nameNumber": 8,
    "rank": 92
  },
  {
    "name": "Athens",
    "country": "Greece",
    "nameNumber": 4,
    "rank": 93
  },
  {
    "name": "Stockholm",
    "country": "Sweden",
    "nameNumber": 8,
    "rank": 94
  },
  {
    "name": "Copenhagen",
    "country": "Denmark",
    "nameNumber": 7,
    "rank": 95
  },
  {
    "name": "Oslo",
    "country": "Norway",
    "nameNumber": 7,
    "rank": 96
  },
  {
    "name": "Helsinki",
    "country": "Finland",
    "nameNumber": 6,
    "rank": 97
  },
  {
    "name": "Dublin",
    "country": "Ireland",
    "nameNumber": 8,
    "rank": 98
  },
  {
    "name": "Zurich",
    "country": "Switzerland",
    "nameNumber": 4,
    "rank": 99
  },
  {
    "name": "Geneva",
    "country": "Switzerland",
    "nameNumber": 9,
    "rank": 100
  },
  {
    "name": "Munich",
    "country": "Germany",
    "nameNumber": 5,
    "rank": 101
  },
  {
    "name": "Frankfurt",
    "country": "Germany",
    "nameNumber": 7,
    "rank": 102
  },
  {
    "name": "Hamburg",
    "country": "Germany",
    "nameNumber": 7,
    "rank": 103
  },
  {
    "name": "Cologne",
    "country": "Germany",
    "nameNumber": 8,
    "rank": 104
  },
  {
    "name": "Lyon",
    "country": "France",
    "nameNumber": 3,
    "rank": 105
  },
  {
    "name": "Marseille",
    "country": "France",
    "nameNumber": 4,
    "rank": 106
  },
  {
    "name": "Montreal",
    "country": "Canada",
    "nameNumber": 8,
    "rank": 107
  },
  {
    "name": "Vancouver",
    "country": "Canada",
    "nameNumber": 4,
    "rank": 108
  },
  {
    "name": "San Francisco",
    "country": "United States",
    "nameNumber": 5,
    "rank": 109
  },
  {
    "name": "Seattle",
    "country": "United States",
    "nameNumber": 1,
    "rank": 110
  },
  {
    "name": "Boston",
    "country": "United States",
    "nameNumber": 4,
    "rank": 111
  },
  {
    "name": "Denver",
    "country": "United States",
    "nameNumber": 5,
    "rank": 112
  },
  {
    "name": "Phoenix",
    "country": "United States",
    "nameNumber": 1,
    "rank": 113
  },
  {
    "name": "Las Vegas",
    "country": "United States",
    "nameNumber": 5,
    "rank": 114
  },
  {
    "name": "San Diego",
    "country": "United States",
    "nameNumber": 2,
    "rank": 115
  },
  {
    "name": "Detroit",
    "country": "United States",
    "nameNumber": 1,
    "rank": 116
  },
  {
    "name": "Minneapolis",
    "country": "United States",
    "nameNumber": 1,
    "rank": 117
  },
  {
    "name": "Dubai",
    "country": "United Arab Emirates",
    "nameNumber": 1,
    "rank": 118
  },
  {
    "name": "Abu Dhabi",
    "country": "United Arab Emirates",
    "nameNumber": 3,
    "rank": 119
  },
  {
    "name": "Doha",
    "country": "Qatar",
    "nameNumber": 1,
    "rank": 120
  },
  {
    "name": "Kuwait City",
    "country": "Kuwait",
    "nameNumber": 7,
    "rank": 121
  },
  {
    "name": "Jeddah",
    "country": "Saudi Arabia",
    "nameNumber": 5,
    "rank": 122
  },
  {
    "name": "Tel Aviv",
    "country": "Israel",
    "nameNumber": 1,
    "rank": 123
  },
  {
    "name": "Jerusalem",
    "country": "Israel",
    "nameNumber": 5,
    "rank": 124
  },
  {
    "name": "Amman",
    "country": "Jordan",
    "nameNumber": 6,
    "rank": 125
  },
  {
    "name": "Beirut",
    "country": "Lebanon",
    "nameNumber": 3,
    "rank": 126
  },
  {
    "name": "Damascus",
    "country": "Syria",
    "nameNumber": 9,
    "rank": 127
  },
  {
    "name": "Ankara",
    "country": "Turkey",
    "nameNumber": 1,
    "rank": 128
  },
  {
    "name": "Izmir",
    "country": "Turkey",
    "nameNumber": 3,
    "rank": 129
  },
  {
    "name": "Islamabad",
    "country": "Pakistan",
    "nameNumber": 8,
    "rank": 130
  },
  {
    "name": "Rawalpindi",
    "country": "Pakistan",
    "nameNumber": 8,
    "rank": 131
  },
  {
    "name": "Faisalabad",
    "country": "Pakistan",
    "nameNumber": 2,
    "rank": 132
  },
  {
    "name": "Kathmandu",
    "country": "Nepal",
    "nameNumber": 3,
    "rank": 133
  },
  {
    "name": "Colombo",
    "country": "Sri Lanka",
    "nameNumber": 3,
    "rank": 134
  },
  {
    "name": "Yangon",
    "country": "Myanmar",
    "nameNumber": 4,
    "rank": 135
  },
  {
    "name": "Hanoi",
    "country": "Vietnam",
    "nameNumber": 2,
    "rank": 136
  },
  {
    "name": "Phnom Penh",
    "country": "Cambodia",
    "nameNumber": 1,
    "rank": 137
  },
  {
    "name": "Taipei",
    "country": "Taiwan",
    "nameNumber": 6,
    "rank": 138
  },
  {
    "name": "Busan",
    "country": "South Korea",
    "nameNumber": 3,
    "rank": 139
  },
  {
    "name": "Kyoto",
    "country": "Japan",
    "nameNumber": 5,
    "rank": 140
  }
];
