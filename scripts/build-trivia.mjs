import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

/** Reduce helpers mirrored from app (masters kept for life path parts). */
function digitSum(n) {
  return String(Math.abs(n))
    .split("")
    .reduce((s, d) => s + Number(d), 0);
}
function reduceNumber(value, keepMasters = true) {
  const masters = new Set([11, 22, 33]);
  let n = Math.abs(Math.trunc(value));
  while (n > 9 && !(keepMasters && masters.has(n))) n = digitSum(n);
  return n;
}
function parseDob(dob) {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob.trim());
  if (!m) throw new Error(dob);
  return { day: Number(m[1]), month: Number(m[2]), year: Number(m[3]) };
}
function lifePathFromDob(dob) {
  const { day, month, year } = parseDob(dob);
  return reduceNumber(
    reduceNumber(day) + reduceNumber(month) + reduceNumber(year),
    true,
  );
}
function vedicDestinyFromDob(dob) {
  const { day, month, year } = parseDob(dob);
  return reduceNumber(day + month + year, false);
}
function vedicPsychicFromDob(dob) {
  const { day } = parseDob(dob);
  return reduceNumber(day, false);
}

const peopleRaw = [
  ["Albert Einstein", "14/03/1879", "Physicist"],
  ["Marie Curie", "07/11/1867", "Scientist"],
  ["Mahatma Gandhi", "02/10/1869", "Leader"],
  ["Nelson Mandela", "18/07/1918", "Leader"],
  ["Martin Luther King Jr.", "15/01/1929", "Leader"],
  ["Abraham Lincoln", "12/02/1809", "Statesman"],
  ["Winston Churchill", "30/11/1874", "Statesman"],
  ["Franklin D. Roosevelt", "30/01/1882", "Statesman"],
  ["John F. Kennedy", "29/05/1917", "Statesman"],
  ["Barack Obama", "04/08/1961", "Statesman"],
  ["Angela Merkel", "17/07/1954", "Statesman"],
  ["Margaret Thatcher", "13/10/1925", "Statesman"],
  ["Indira Gandhi", "19/11/1917", "Statesman"],
  ["Jawaharlal Nehru", "14/11/1889", "Statesman"],
  ["Sardar Patel", "31/10/1875", "Statesman"],
  ["B. R. Ambedkar", "14/04/1891", "Jurist"],
  ["Rabindranath Tagore", "07/05/1861", "Poet"],
  ["Swami Vivekananda", "12/01/1863", "Philosopher"],
  ["APJ Abdul Kalam", "15/10/1931", "Scientist"],
  ["C. V. Raman", "07/11/1888", "Scientist"],
  ["Srinivasa Ramanujan", "22/12/1887", "Mathematician"],
  ["Stephen Hawking", "08/01/1942", "Physicist"],
  ["Isaac Newton", "04/01/1643", "Physicist"],
  ["Galileo Galilei", "15/02/1564", "Astronomer"],
  ["Leonardo da Vinci", "15/04/1452", "Polymath"],
  ["Michelangelo", "06/03/1475", "Artist"],
  ["Vincent van Gogh", "30/03/1853", "Artist"],
  ["Pablo Picasso", "25/10/1881", "Artist"],
  ["Frida Kahlo", "06/07/1907", "Artist"],
  ["Claude Monet", "14/11/1840", "Artist"],
  ["William Shakespeare", "26/04/1564", "Playwright"],
  ["Jane Austen", "16/12/1775", "Writer"],
  ["Charles Dickens", "07/02/1812", "Writer"],
  ["Leo Tolstoy", "09/09/1828", "Writer"],
  ["Mark Twain", "30/11/1835", "Writer"],
  ["Virginia Woolf", "25/01/1882", "Writer"],
  ["Ernest Hemingway", "21/07/1899", "Writer"],
  ["J. K. Rowling", "31/07/1965", "Writer"],
  ["Agatha Christie", "15/09/1890", "Writer"],
  ["Ludwig van Beethoven", "17/12/1770", "Composer"],
  ["Wolfgang Amadeus Mozart", "27/01/1756", "Composer"],
  ["Johann Sebastian Bach", "31/03/1685", "Composer"],
  ["Frédéric Chopin", "01/03/1810", "Composer"],
  ["Pyotr Tchaikovsky", "07/05/1840", "Composer"],
  ["Elvis Presley", "08/01/1935", "Musician"],
  ["John Lennon", "09/10/1940", "Musician"],
  ["Paul McCartney", "18/06/1942", "Musician"],
  ["Michael Jackson", "29/08/1958", "Musician"],
  ["Madonna", "16/08/1958", "Musician"],
  ["Beyoncé", "04/09/1981", "Musician"],
  ["Taylor Swift", "13/12/1989", "Musician"],
  ["Bob Dylan", "24/05/1941", "Musician"],
  ["Aretha Franklin", "25/03/1942", "Musician"],
  ["Freddie Mercury", "05/09/1946", "Musician"],
  ["Charlie Chaplin", "16/04/1889", "Actor"],
  ["Marilyn Monroe", "01/06/1926", "Actor"],
  ["Audrey Hepburn", "04/05/1929", "Actor"],
  ["Meryl Streep", "22/06/1949", "Actor"],
  ["Tom Hanks", "09/07/1956", "Actor"],
  ["Leonardo DiCaprio", "11/11/1974", "Actor"],
  ["Shah Rukh Khan", "02/11/1965", "Actor"],
  ["Amitabh Bachchan", "11/10/1942", "Actor"],
  ["Aishwarya Rai", "01/11/1973", "Actor"],
  ["Priyanka Chopra", "18/07/1982", "Actor"],
  ["Rajinikanth", "12/12/1950", "Actor"],
  ["A. R. Rahman", "06/01/1967", "Composer"],
  ["Sachin Tendulkar", "24/04/1973", "Athlete"],
  ["Virat Kohli", "05/11/1988", "Athlete"],
  ["MS Dhoni", "07/07/1981", "Athlete"],
  ["Pelé", "23/10/1940", "Athlete"],
  ["Diego Maradona", "30/10/1960", "Athlete"],
  ["Lionel Messi", "24/06/1987", "Athlete"],
  ["Cristiano Ronaldo", "05/02/1985", "Athlete"],
  ["Serena Williams", "26/09/1981", "Athlete"],
  ["Roger Federer", "08/08/1981", "Athlete"],
  ["Usain Bolt", "21/08/1986", "Athlete"],
  ["Michael Jordan", "17/02/1963", "Athlete"],
  ["Muhammad Ali", "17/01/1942", "Athlete"],
  ["Steve Jobs", "24/02/1955", "Entrepreneur"],
  ["Bill Gates", "28/10/1955", "Entrepreneur"],
  ["Elon Musk", "28/06/1971", "Entrepreneur"],
  ["Jeff Bezos", "12/01/1964", "Entrepreneur"],
  ["Mark Zuckerberg", "14/05/1984", "Entrepreneur"],
  ["Oprah Winfrey", "29/01/1954", "Media"],
  ["Walt Disney", "05/12/1901", "Entrepreneur"],
  ["Henry Ford", "30/07/1863", "Entrepreneur"],
  ["Thomas Edison", "11/02/1847", "Inventor"],
  ["Nikola Tesla", "10/07/1856", "Inventor"],
  ["Ada Lovelace", "10/12/1815", "Mathematician"],
  ["Alan Turing", "23/06/1912", "Computer scientist"],
  ["Tim Berners-Lee", "08/06/1955", "Computer scientist"],
  ["Malala Yousafzai", "12/07/1997", "Activist"],
  ["Mother Teresa", "26/08/1910", "Humanitarian"],
  ["Dalai Lama", "06/07/1935", "Spiritual leader"],
  ["Pope Francis", "17/12/1936", "Religious leader"],
  ["Queen Elizabeth II", "21/04/1926", "Monarch"],
  ["Princess Diana", "01/07/1961", "Public figure"],
  ["Che Guevara", "14/06/1928", "Revolutionary"],
  ["Simón Bolívar", "24/07/1783", "Leader"],
  ["Napoleon Bonaparte", "15/08/1769", "Leader"],
  ["Karl Marx", "05/05/1818", "Philosopher"],
  ["Sigmund Freud", "06/05/1856", "Psychologist"],
  ["Carl Jung", "26/07/1875", "Psychologist"],
  ["Helen Keller", "27/06/1880", "Author"],
  ["Rosa Parks", "04/02/1913", "Activist"],
  ["Harriet Tubman", "01/03/1822", "Activist"],
  ["Frederick Douglass", "14/02/1818", "Orator"],
  ["George Washington", "22/02/1732", "Statesman"],
  ["Thomas Jefferson", "13/04/1743", "Statesman"],
  ["Benjamin Franklin", "17/01/1706", "Polymath"],
  ["Alexander Graham Bell", "03/03/1847", "Inventor"],
  ["Orville Wright", "19/08/1871", "Aviator"],
  ["Yuri Gagarin", "09/03/1934", "Cosmonaut"],
  ["Neil Armstrong", "05/08/1930", "Astronaut"],
  ["Kalpana Chawla", "17/03/1962", "Astronaut"],
  ["Ratan Tata", "28/12/1937", "Entrepreneur"],
  ["Dhirubhai Ambani", "28/12/1932", "Entrepreneur"],
  ["Narendra Modi", "17/09/1950", "Statesman"],
  ["Joe Biden", "20/11/1942", "Statesman"],
  ["Emmanuel Macron", "21/12/1977", "Statesman"],
  ["Jacinda Ardern", "26/07/1980", "Statesman"],
  ["Volodymyr Zelenskyy", "25/01/1978", "Statesman"],
  ["Rihanna", "20/02/1988", "Musician"],
  ["Lady Gaga", "28/03/1986", "Musician"],
  ["Bruno Mars", "08/10/1985", "Musician"],
  ["Ed Sheeran", "17/02/1991", "Musician"],
  ["Drake", "24/10/1986", "Musician"],
  ["Bruce Lee", "27/11/1940", "Martial artist"],
  ["Jackie Chan", "07/04/1954", "Actor"],
  ["Akira Saruwatari", "01/01/1900", "skip"],
].filter(([, , note]) => note !== "skip");

const people = peopleRaw.map(([name, dob, note]) => ({
  name,
  dob,
  note,
  lifePath: lifePathFromDob(dob),
  destiny: vedicDestinyFromDob(dob),
  psychic: vedicPsychicFromDob(dob),
}));

/** Country founding / independence dates (DD/MM/YYYY) — reflective trivia. */
const countriesRaw = [
  ["Afghanistan", "af", "19/08/1919", 33, 65],
  ["Albania", "al", "28/11/1912", 41, 20],
  ["Algeria", "dz", "05/07/1962", 28, 3],
  ["Andorra", "ad", "08/09/1278", 42.5, 1.5],
  ["Angola", "ao", "11/11/1975", -12.5, 18.5],
  ["Antigua and Barbuda", "ag", "01/11/1981", 17.05, -61.8],
  ["Argentina", "ar", "09/07/1816", -34, -64],
  ["Armenia", "am", "21/09/1991", 40, 45],
  ["Australia", "au", "01/01/1901", -27, 133],
  ["Austria", "at", "26/10/1955", 47.3, 13.3],
  ["Azerbaijan", "az", "18/10/1991", 40.5, 47.5],
  ["Bahamas", "bs", "10/07/1973", 24.25, -76],
  ["Bahrain", "bh", "15/08/1971", 26, 50.5],
  ["Bangladesh", "bd", "26/03/1971", 24, 90],
  ["Barbados", "bb", "30/11/1966", 13.2, -59.5],
  ["Belarus", "by", "25/08/1991", 53, 28],
  ["Belgium", "be", "04/10/1830", 50.8, 4.5],
  ["Belize", "bz", "21/09/1981", 17.25, -88.75],
  ["Benin", "bj", "01/08/1960", 9.5, 2.25],
  ["Bhutan", "bt", "17/12/1907", 27.5, 90.5],
  ["Bolivia", "bo", "06/08/1825", -17, -65],
  ["Bosnia and Herzegovina", "ba", "01/03/1992", 44, 18],
  ["Botswana", "bw", "30/09/1966", -22, 24],
  ["Brazil", "br", "07/09/1822", -10, -55],
  ["Brunei", "bn", "01/01/1984", 4.5, 114.7],
  ["Bulgaria", "bg", "03/03/1878", 43, 25],
  ["Burkina Faso", "bf", "05/08/1960", 13, -2],
  ["Burundi", "bi", "01/07/1962", -3.5, 30],
  ["Cabo Verde", "cv", "05/07/1975", 16, -24],
  ["Cambodia", "kh", "09/11/1953", 13, 105],
  ["Cameroon", "cm", "01/01/1960", 6, 12],
  ["Canada", "ca", "01/07/1867", 60, -95],
  ["Central African Republic", "cf", "13/08/1960", 7, 21],
  ["Chad", "td", "11/08/1960", 15, 19],
  ["Chile", "cl", "18/09/1810", -30, -71],
  ["China", "cn", "01/10/1949", 35, 105],
  ["Colombia", "co", "20/07/1810", 4, -72],
  ["Comoros", "km", "06/07/1975", -12.2, 44.3],
  ["Congo", "cg", "15/08/1960", -1, 15],
  ["Costa Rica", "cr", "15/09/1821", 10, -84],
  ["Croatia", "hr", "25/06/1991", 45.2, 15.5],
  ["Cuba", "cu", "20/05/1902", 22, -80],
  ["Cyprus", "cy", "16/08/1960", 35, 33],
  ["Czechia", "cz", "01/01/1993", 49.75, 15.5],
  ["Denmark", "dk", "05/06/1849", 56, 10],
  ["Djibouti", "dj", "27/06/1977", 11.5, 43],
  ["Dominica", "dm", "03/11/1978", 15.4, -61.3],
  ["Dominican Republic", "do", "27/02/1844", 19, -70.7],
  ["Ecuador", "ec", "10/08/1809", -2, -77.5],
  ["Egypt", "eg", "28/02/1922", 27, 30],
  ["El Salvador", "sv", "15/09/1821", 13.8, -88.9],
  ["Equatorial Guinea", "gq", "12/10/1968", 2, 10],
  ["Eritrea", "er", "24/05/1993", 15, 39],
  ["Estonia", "ee", "24/02/1918", 59, 26],
  ["Eswatini", "sz", "06/09/1968", -26.5, 31.5],
  ["Ethiopia", "et", "28/05/1991", 8, 38],
  ["Fiji", "fj", "10/10/1970", -18, 175],
  ["Finland", "fi", "06/12/1917", 64, 26],
  ["France", "fr", "14/07/1789", 46, 2],
  ["Gabon", "ga", "17/08/1960", -1, 11.7],
  ["Gambia", "gm", "18/02/1965", 13.5, -15.5],
  ["Georgia", "ge", "09/04/1991", 42, 43.5],
  ["Germany", "de", "03/10/1990", 51, 9],
  ["Ghana", "gh", "06/03/1957", 8, -2],
  ["Greece", "gr", "25/03/1821", 39, 22],
  ["Grenada", "gd", "07/02/1974", 12.1, -61.7],
  ["Guatemala", "gt", "15/09/1821", 15.5, -90.2],
  ["Guinea", "gn", "02/10/1958", 11, -10],
  ["Guinea-Bissau", "gw", "24/09/1973", 12, -15],
  ["Guyana", "gy", "26/05/1966", 5, -59],
  ["Haiti", "ht", "01/01/1804", 19, -72.4],
  ["Honduras", "hn", "15/09/1821", 15, -86.5],
  ["Hungary", "hu", "16/11/1918", 47, 20],
  ["Iceland", "is", "17/06/1944", 65, -18],
  ["India", "in", "15/08/1947", 20, 77],
  ["Indonesia", "id", "17/08/1945", -5, 120],
  ["Iran", "ir", "01/04/1979", 32, 53],
  ["Iraq", "iq", "03/10/1932", 33, 44],
  ["Ireland", "ie", "06/12/1922", 53, -8],
  ["Israel", "il", "14/05/1948", 31.5, 34.8],
  ["Italy", "it", "17/03/1861", 42.8, 12.8],
  ["Jamaica", "jm", "06/08/1962", 18.25, -77.5],
  ["Japan", "jp", "11/02/0660", 36, 138],
  ["Jordan", "jo", "25/05/1946", 31, 36],
  ["Kazakhstan", "kz", "16/12/1991", 48, 68],
  ["Kenya", "ke", "12/12/1963", 1, 38],
  ["Kiribati", "ki", "12/07/1979", 1.4, 173],
  ["Kuwait", "kw", "19/06/1961", 29.5, 47.8],
  ["Kyrgyzstan", "kg", "31/08/1991", 41, 83],
  ["Laos", "la", "22/10/1953", 18, 105],
  ["Latvia", "lv", "18/11/1918", 57, 25],
  ["Lebanon", "lb", "22/11/1943", 33.8, 35.8],
  ["Lesotho", "ls", "04/10/1966", -29.5, 28.5],
  ["Liberia", "lr", "26/07/1847", 6.5, -9.5],
  ["Libya", "ly", "24/12/1951", 25, 17],
  ["Liechtenstein", "li", "23/01/1719", 47.15, 9.55],
  ["Lithuania", "lt", "16/02/1918", 56, 24],
  ["Luxembourg", "lu", "23/01/1839", 49.75, 6.15],
  ["Madagascar", "mg", "26/06/1960", -20, 47],
  ["Malawi", "mw", "06/07/1964", -13.5, 34],
  ["Malaysia", "my", "31/08/1957", 2.5, 112.5],
  ["Maldives", "mv", "26/07/1965", 3.25, 73],
  ["Mali", "ml", "22/09/1960", 17, -4],
  ["Malta", "mt", "21/09/1964", 35.9, 14.5],
  ["Marshall Islands", "mh", "21/10/1986", 9, 168],
  ["Mauritania", "mr", "28/11/1960", 20, -12],
  ["Mauritius", "mu", "12/03/1968", -20.3, 57.5],
  ["Mexico", "mx", "16/09/1810", 23, -102],
  ["Micronesia", "fm", "03/11/1986", 6.9, 158.2],
  ["Moldova", "md", "27/08/1991", 47, 29],
  ["Monaco", "mc", "08/01/1297", 43.7, 7.4],
  ["Mongolia", "mn", "29/12/1911", 46, 105],
  ["Montenegro", "me", "03/06/2006", 42.5, 19.3],
  ["Morocco", "ma", "02/03/1956", 32, -5],
  ["Mozambique", "mz", "25/06/1975", -18.25, 35],
  ["Myanmar", "mm", "04/01/1948", 22, 98],
  ["Namibia", "na", "21/03/1990", -22, 17],
  ["Nauru", "nr", "31/01/1968", -0.5, 166.9],
  ["Nepal", "np", "28/05/2008", 28, 84],
  ["Netherlands", "nl", "26/07/1581", 52.5, 5.75],
  ["New Zealand", "nz", "06/02/1840", -41, 174],
  ["Nicaragua", "ni", "15/09/1821", 13, -85],
  ["Niger", "ne", "03/08/1960", 16, 8],
  ["Nigeria", "ng", "01/10/1960", 10, 8],
  ["North Korea", "kp", "09/09/1948", 40, 127],
  ["North Macedonia", "mk", "08/09/1991", 41.8, 22],
  ["Norway", "no", "17/05/1814", 62, 10],
  ["Oman", "om", "18/11/1650", 21, 57],
  ["Pakistan", "pk", "14/08/1947", 30, 70],
  ["Palau", "pw", "01/10/1994", 7.5, 134.5],
  ["Panama", "pa", "03/11/1903", 9, -80],
  ["Papua New Guinea", "pg", "16/09/1975", -6, 147],
  ["Paraguay", "py", "14/05/1811", -23, -58],
  ["Peru", "pe", "28/07/1821", -10, -76],
  ["Philippines", "ph", "12/06/1898", 13, 122],
  ["Poland", "pl", "11/11/1918", 52, 20],
  ["Portugal", "pt", "05/10/1910", 39.5, -8],
  ["Qatar", "qa", "03/09/1971", 25.5, 51.25],
  ["Romania", "ro", "09/05/1877", 46, 25],
  ["Russia", "ru", "12/06/1990", 60, 100],
  ["Rwanda", "rw", "01/07/1962", -2, 30],
  ["Saint Kitts and Nevis", "kn", "19/09/1983", 17.3, -62.7],
  ["Saint Lucia", "lc", "22/02/1979", 13.9, -61],
  ["Saint Vincent and the Grenadines", "vc", "27/10/1979", 13.25, -61.2],
  ["Samoa", "ws", "01/01/1962", -13.6, -172.3],
  ["San Marino", "sm", "03/09/0301", 43.9, 12.45],
  ["Sao Tome and Principe", "st", "12/07/1975", 1, 7],
  ["Saudi Arabia", "sa", "23/09/1932", 25, 45],
  ["Senegal", "sn", "04/04/1960", 14, -14],
  ["Serbia", "rs", "05/06/2006", 44, 21],
  ["Seychelles", "sc", "29/06/1976", -4.6, 55.5],
  ["Sierra Leone", "sl", "27/04/1961", 8.5, -11.5],
  ["Singapore", "sg", "09/08/1965", 1.3, 103.8],
  ["Slovakia", "sk", "01/01/1993", 48.7, 19.5],
  ["Slovenia", "si", "25/06/1991", 46.1, 14.8],
  ["Solomon Islands", "sb", "07/07/1978", -8, 159],
  ["Somalia", "so", "01/07/1960", 10, 49],
  ["South Africa", "za", "31/05/1910", -29, 24],
  ["South Korea", "kr", "15/08/1948", 37, 127.5],
  ["South Sudan", "ss", "09/07/2011", 7, 30],
  ["Spain", "es", "20/11/1975", 40, -4],
  ["Sri Lanka", "lk", "04/02/1948", 7, 81],
  ["Sudan", "sd", "01/01/1956", 15, 30],
  ["Suriname", "sr", "25/11/1975", 4, -56],
  ["Sweden", "se", "06/06/1523", 62, 15],
  ["Switzerland", "ch", "01/08/1291", 47, 8],
  ["Syria", "sy", "17/04/1946", 35, 38],
  ["Tajikistan", "tj", "09/09/1991", 39, 71],
  ["Tanzania", "tz", "09/12/1961", -6, 35],
  ["Thailand", "th", "24/06/1939", 15, 100],
  ["Timor-Leste", "tl", "20/05/2002", -8.8, 125.7],
  ["Togo", "tg", "27/04/1960", 8, 1.2],
  ["Tonga", "to", "04/06/1970", -20, -175],
  ["Trinidad and Tobago", "tt", "31/08/1962", 11, -61],
  ["Tunisia", "tn", "20/03/1956", 34, 9],
  ["Turkey", "tr", "29/10/1923", 39, 35],
  ["Turkmenistan", "tm", "27/10/1991", 40, 60],
  ["Tuvalu", "tv", "01/10/1978", -8, 178],
  ["Uganda", "ug", "09/10/1962", 1, 32],
  ["Ukraine", "ua", "24/08/1991", 49, 32],
  ["United Arab Emirates", "ae", "02/12/1971", 24, 54],
  ["United Kingdom", "gb", "01/01/1801", 54, -2],
  ["United States", "us", "04/07/1776", 38, -97],
  ["Uruguay", "uy", "25/08/1825", -33, -56],
  ["Uzbekistan", "uz", "01/09/1991", 41, 64],
  ["Vanuatu", "vu", "30/07/1980", -16, 167],
  ["Vatican City", "va", "11/02/1929", 41.9, 12.45],
  ["Venezuela", "ve", "05/07/1811", 8, -66],
  ["Vietnam", "vn", "02/09/1945", 16, 108],
  ["Yemen", "ye", "22/05/1990", 15.5, 47.5],
  ["Zambia", "zm", "24/10/1964", -15, 30],
  ["Zimbabwe", "zw", "18/04/1980", -20, 30],
  ["Democratic Republic of the Congo", "cd", "30/06/1960", -4, 25],
];

function padYearDob(dob) {
  // Japan mythic year 0660 -> keep as-is if parse works; skip if year < 1000 for calc Age limits
  const { day, month, year } = parseDob(dob);
  if (year < 1000) {
    // Use a conventional modern founding marker year for numerology trivia only
    const y = year === 660 ? 1952 : year === 301 ? 1600 : 1000 + year;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${String(y).padStart(4, "0")}`;
  }
  return dob;
}

const countries = [];
for (const [name, iso2, dob, lat, lng] of countriesRaw) {
  let useDob = dob;
  try {
    parseDob(dob);
    if (parseDob(dob).year < 1000) useDob = padYearDob(dob);
  } catch {
    continue;
  }
  try {
    countries.push({
      name,
      iso2,
      dob: useDob,
      foundingNote: "Independence / formation date used for reflective trivia",
      lat,
      lng,
      lifePath: lifePathFromDob(useDob),
      destiny: vedicDestinyFromDob(useDob),
      psychic: vedicPsychicFromDob(useDob),
    });
  } catch (e) {
    console.warn("skip", name, e.message);
  }
}

const outPeople = path.join(root, "src/lib/trivia/people.ts");
const outCountries = path.join(root, "src/lib/trivia/countries.ts");

fs.writeFileSync(
  outPeople,
  `/** Curated famous personalities for reflective trivia (DOB-based match). */
export type TriviaPerson = {
  name: string;
  dob: string;
  note: string;
  lifePath: number;
  destiny: number;
  psychic: number;
};

export const TRIVIA_PEOPLE: TriviaPerson[] = ${JSON.stringify(people, null, 2)};
`,
);

fs.writeFileSync(
  outCountries,
  `/** World countries with independence/formation dates for reflective trivia. */
export type TriviaCountry = {
  name: string;
  iso2: string;
  dob: string;
  foundingNote: string;
  lat: number;
  lng: number;
  lifePath: number;
  destiny: number;
  psychic: number;
};

export const TRIVIA_COUNTRIES: TriviaCountry[] = ${JSON.stringify(countries, null, 2)};
`,
);

console.log("people", people.length, "countries", countries.length);
