/** Curated famous personalities for reflective trivia (DOB-based match). */
export type TriviaPerson = {
  name: string;
  dob: string;
  note: string;
  lifePath: number;
  destiny: number;
  psychic: number;
};

export const TRIVIA_PEOPLE: TriviaPerson[] = [
  {
    "name": "Albert Einstein",
    "dob": "14/03/1879",
    "note": "Physicist",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 5
  },
  {
    "name": "Marie Curie",
    "dob": "07/11/1867",
    "note": "Scientist",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 7
  },
  {
    "name": "Mahatma Gandhi",
    "dob": "02/10/1869",
    "note": "Leader",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 2
  },
  {
    "name": "Nelson Mandela",
    "dob": "18/07/1918",
    "note": "Leader",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 9
  },
  {
    "name": "Martin Luther King Jr.",
    "dob": "15/01/1929",
    "note": "Leader",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 6
  },
  {
    "name": "Abraham Lincoln",
    "dob": "12/02/1809",
    "note": "Statesman",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 3
  },
  {
    "name": "Winston Churchill",
    "dob": "30/11/1874",
    "note": "Statesman",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 3
  },
  {
    "name": "Franklin D. Roosevelt",
    "dob": "30/01/1882",
    "note": "Statesman",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 3
  },
  {
    "name": "John F. Kennedy",
    "dob": "29/05/1917",
    "note": "Statesman",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 2
  },
  {
    "name": "Barack Obama",
    "dob": "04/08/1961",
    "note": "Statesman",
    "lifePath": 2,
    "destiny": 2,
    "psychic": 4
  },
  {
    "name": "Angela Merkel",
    "dob": "17/07/1954",
    "note": "Statesman",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 8
  },
  {
    "name": "Margaret Thatcher",
    "dob": "13/10/1925",
    "note": "Statesman",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 4
  },
  {
    "name": "Indira Gandhi",
    "dob": "19/11/1917",
    "note": "Statesman",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 1
  },
  {
    "name": "Jawaharlal Nehru",
    "dob": "14/11/1889",
    "note": "Statesman",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 5
  },
  {
    "name": "Sardar Patel",
    "dob": "31/10/1875",
    "note": "Statesman",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 4
  },
  {
    "name": "B. R. Ambedkar",
    "dob": "14/04/1891",
    "note": "Jurist",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 5
  },
  {
    "name": "Rabindranath Tagore",
    "dob": "07/05/1861",
    "note": "Poet",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 7
  },
  {
    "name": "Swami Vivekananda",
    "dob": "12/01/1863",
    "note": "Philosopher",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 3
  },
  {
    "name": "APJ Abdul Kalam",
    "dob": "15/10/1931",
    "note": "Scientist",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 6
  },
  {
    "name": "C. V. Raman",
    "dob": "07/11/1888",
    "note": "Scientist",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 7
  },
  {
    "name": "Srinivasa Ramanujan",
    "dob": "22/12/1887",
    "note": "Mathematician",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 4
  },
  {
    "name": "Stephen Hawking",
    "dob": "08/01/1942",
    "note": "Physicist",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 8
  },
  {
    "name": "Isaac Newton",
    "dob": "04/01/1643",
    "note": "Physicist",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 4
  },
  {
    "name": "Galileo Galilei",
    "dob": "15/02/1564",
    "note": "Astronomer",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 6
  },
  {
    "name": "Leonardo da Vinci",
    "dob": "15/04/1452",
    "note": "Polymath",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 6
  },
  {
    "name": "Michelangelo",
    "dob": "06/03/1475",
    "note": "Artist",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 6
  },
  {
    "name": "Vincent van Gogh",
    "dob": "30/03/1853",
    "note": "Artist",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 3
  },
  {
    "name": "Pablo Picasso",
    "dob": "25/10/1881",
    "note": "Artist",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 7
  },
  {
    "name": "Frida Kahlo",
    "dob": "06/07/1907",
    "note": "Artist",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 6
  },
  {
    "name": "Claude Monet",
    "dob": "14/11/1840",
    "note": "Artist",
    "lifePath": 2,
    "destiny": 2,
    "psychic": 5
  },
  {
    "name": "William Shakespeare",
    "dob": "26/04/1564",
    "note": "Playwright",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 8
  },
  {
    "name": "Jane Austen",
    "dob": "16/12/1775",
    "note": "Writer",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 7
  },
  {
    "name": "Charles Dickens",
    "dob": "07/02/1812",
    "note": "Writer",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 7
  },
  {
    "name": "Leo Tolstoy",
    "dob": "09/09/1828",
    "note": "Writer",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 9
  },
  {
    "name": "Mark Twain",
    "dob": "30/11/1835",
    "note": "Writer",
    "lifePath": 22,
    "destiny": 4,
    "psychic": 3
  },
  {
    "name": "Virginia Woolf",
    "dob": "25/01/1882",
    "note": "Writer",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 7
  },
  {
    "name": "Ernest Hemingway",
    "dob": "21/07/1899",
    "note": "Writer",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 3
  },
  {
    "name": "J. K. Rowling",
    "dob": "31/07/1965",
    "note": "Writer",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 4
  },
  {
    "name": "Agatha Christie",
    "dob": "15/09/1890",
    "note": "Writer",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 6
  },
  {
    "name": "Ludwig van Beethoven",
    "dob": "17/12/1770",
    "note": "Composer",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 8
  },
  {
    "name": "Wolfgang Amadeus Mozart",
    "dob": "27/01/1756",
    "note": "Composer",
    "lifePath": 11,
    "destiny": 2,
    "psychic": 9
  },
  {
    "name": "Johann Sebastian Bach",
    "dob": "31/03/1685",
    "note": "Composer",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 4
  },
  {
    "name": "Frédéric Chopin",
    "dob": "01/03/1810",
    "note": "Composer",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 1
  },
  {
    "name": "Pyotr Tchaikovsky",
    "dob": "07/05/1840",
    "note": "Composer",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 7
  },
  {
    "name": "Elvis Presley",
    "dob": "08/01/1935",
    "note": "Musician",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 8
  },
  {
    "name": "John Lennon",
    "dob": "09/10/1940",
    "note": "Musician",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 9
  },
  {
    "name": "Paul McCartney",
    "dob": "18/06/1942",
    "note": "Musician",
    "lifePath": 22,
    "destiny": 4,
    "psychic": 9
  },
  {
    "name": "Michael Jackson",
    "dob": "29/08/1958",
    "note": "Musician",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 2
  },
  {
    "name": "Madonna",
    "dob": "16/08/1958",
    "note": "Musician",
    "lifePath": 2,
    "destiny": 2,
    "psychic": 7
  },
  {
    "name": "Beyoncé",
    "dob": "04/09/1981",
    "note": "Musician",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 4
  },
  {
    "name": "Taylor Swift",
    "dob": "13/12/1989",
    "note": "Musician",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 4
  },
  {
    "name": "Bob Dylan",
    "dob": "24/05/1941",
    "note": "Musician",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 6
  },
  {
    "name": "Aretha Franklin",
    "dob": "25/03/1942",
    "note": "Musician",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 7
  },
  {
    "name": "Freddie Mercury",
    "dob": "05/09/1946",
    "note": "Musician",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 5
  },
  {
    "name": "Charlie Chaplin",
    "dob": "16/04/1889",
    "note": "Actor",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 7
  },
  {
    "name": "Marilyn Monroe",
    "dob": "01/06/1926",
    "note": "Actor",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 1
  },
  {
    "name": "Audrey Hepburn",
    "dob": "04/05/1929",
    "note": "Actor",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 4
  },
  {
    "name": "Meryl Streep",
    "dob": "22/06/1949",
    "note": "Actor",
    "lifePath": 33,
    "destiny": 6,
    "psychic": 4
  },
  {
    "name": "Tom Hanks",
    "dob": "09/07/1956",
    "note": "Actor",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 9
  },
  {
    "name": "Leonardo DiCaprio",
    "dob": "11/11/1974",
    "note": "Actor",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 2
  },
  {
    "name": "Shah Rukh Khan",
    "dob": "02/11/1965",
    "note": "Actor",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 2
  },
  {
    "name": "Amitabh Bachchan",
    "dob": "11/10/1942",
    "note": "Actor",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 2
  },
  {
    "name": "Aishwarya Rai",
    "dob": "01/11/1973",
    "note": "Actor",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 1
  },
  {
    "name": "Priyanka Chopra",
    "dob": "18/07/1982",
    "note": "Actor",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 9
  },
  {
    "name": "Rajinikanth",
    "dob": "12/12/1950",
    "note": "Actor",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 3
  },
  {
    "name": "A. R. Rahman",
    "dob": "06/01/1967",
    "note": "Composer",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 6
  },
  {
    "name": "Sachin Tendulkar",
    "dob": "24/04/1973",
    "note": "Athlete",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 6
  },
  {
    "name": "Virat Kohli",
    "dob": "05/11/1988",
    "note": "Athlete",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 5
  },
  {
    "name": "MS Dhoni",
    "dob": "07/07/1981",
    "note": "Athlete",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 7
  },
  {
    "name": "Pelé",
    "dob": "23/10/1940",
    "note": "Athlete",
    "lifePath": 11,
    "destiny": 2,
    "psychic": 5
  },
  {
    "name": "Diego Maradona",
    "dob": "30/10/1960",
    "note": "Athlete",
    "lifePath": 11,
    "destiny": 2,
    "psychic": 3
  },
  {
    "name": "Lionel Messi",
    "dob": "24/06/1987",
    "note": "Athlete",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 6
  },
  {
    "name": "Cristiano Ronaldo",
    "dob": "05/02/1985",
    "note": "Athlete",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 5
  },
  {
    "name": "Serena Williams",
    "dob": "26/09/1981",
    "note": "Athlete",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 8
  },
  {
    "name": "Roger Federer",
    "dob": "08/08/1981",
    "note": "Athlete",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 8
  },
  {
    "name": "Usain Bolt",
    "dob": "21/08/1986",
    "note": "Athlete",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 3
  },
  {
    "name": "Michael Jordan",
    "dob": "17/02/1963",
    "note": "Athlete",
    "lifePath": 11,
    "destiny": 2,
    "psychic": 8
  },
  {
    "name": "Muhammad Ali",
    "dob": "17/01/1942",
    "note": "Athlete",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 8
  },
  {
    "name": "Steve Jobs",
    "dob": "24/02/1955",
    "note": "Entrepreneur",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 6
  },
  {
    "name": "Bill Gates",
    "dob": "28/10/1955",
    "note": "Entrepreneur",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 1
  },
  {
    "name": "Elon Musk",
    "dob": "28/06/1971",
    "note": "Entrepreneur",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 1
  },
  {
    "name": "Jeff Bezos",
    "dob": "12/01/1964",
    "note": "Entrepreneur",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 3
  },
  {
    "name": "Mark Zuckerberg",
    "dob": "14/05/1984",
    "note": "Entrepreneur",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 5
  },
  {
    "name": "Oprah Winfrey",
    "dob": "29/01/1954",
    "note": "Media",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 2
  },
  {
    "name": "Walt Disney",
    "dob": "05/12/1901",
    "note": "Entrepreneur",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 5
  },
  {
    "name": "Henry Ford",
    "dob": "30/07/1863",
    "note": "Entrepreneur",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 3
  },
  {
    "name": "Thomas Edison",
    "dob": "11/02/1847",
    "note": "Inventor",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 2
  },
  {
    "name": "Nikola Tesla",
    "dob": "10/07/1856",
    "note": "Inventor",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 1
  },
  {
    "name": "Ada Lovelace",
    "dob": "10/12/1815",
    "note": "Mathematician",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 1
  },
  {
    "name": "Alan Turing",
    "dob": "23/06/1912",
    "note": "Computer scientist",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 5
  },
  {
    "name": "Tim Berners-Lee",
    "dob": "08/06/1955",
    "note": "Computer scientist",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 8
  },
  {
    "name": "Malala Yousafzai",
    "dob": "12/07/1997",
    "note": "Activist",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 3
  },
  {
    "name": "Mother Teresa",
    "dob": "26/08/1910",
    "note": "Humanitarian",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 8
  },
  {
    "name": "Dalai Lama",
    "dob": "06/07/1935",
    "note": "Spiritual leader",
    "lifePath": 22,
    "destiny": 4,
    "psychic": 6
  },
  {
    "name": "Pope Francis",
    "dob": "17/12/1936",
    "note": "Religious leader",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 8
  },
  {
    "name": "Queen Elizabeth II",
    "dob": "21/04/1926",
    "note": "Monarch",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 3
  },
  {
    "name": "Princess Diana",
    "dob": "01/07/1961",
    "note": "Public figure",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 1
  },
  {
    "name": "Che Guevara",
    "dob": "14/06/1928",
    "note": "Revolutionary",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 5
  },
  {
    "name": "Simón Bolívar",
    "dob": "24/07/1783",
    "note": "Leader",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 6
  },
  {
    "name": "Napoleon Bonaparte",
    "dob": "15/08/1769",
    "note": "Leader",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 6
  },
  {
    "name": "Karl Marx",
    "dob": "05/05/1818",
    "note": "Philosopher",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 5
  },
  {
    "name": "Sigmund Freud",
    "dob": "06/05/1856",
    "note": "Psychologist",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 6
  },
  {
    "name": "Carl Jung",
    "dob": "26/07/1875",
    "note": "Psychologist",
    "lifePath": 9,
    "destiny": 9,
    "psychic": 8
  },
  {
    "name": "Helen Keller",
    "dob": "27/06/1880",
    "note": "Author",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 9
  },
  {
    "name": "Rosa Parks",
    "dob": "04/02/1913",
    "note": "Activist",
    "lifePath": 11,
    "destiny": 2,
    "psychic": 4
  },
  {
    "name": "Harriet Tubman",
    "dob": "01/03/1822",
    "note": "Activist",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 1
  },
  {
    "name": "Frederick Douglass",
    "dob": "14/02/1818",
    "note": "Orator",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 5
  },
  {
    "name": "George Washington",
    "dob": "22/02/1732",
    "note": "Statesman",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 4
  },
  {
    "name": "Thomas Jefferson",
    "dob": "13/04/1743",
    "note": "Statesman",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 4
  },
  {
    "name": "Benjamin Franklin",
    "dob": "17/01/1706",
    "note": "Polymath",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 8
  },
  {
    "name": "Alexander Graham Bell",
    "dob": "03/03/1847",
    "note": "Inventor",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 3
  },
  {
    "name": "Orville Wright",
    "dob": "19/08/1871",
    "note": "Aviator",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 1
  },
  {
    "name": "Yuri Gagarin",
    "dob": "09/03/1934",
    "note": "Cosmonaut",
    "lifePath": 2,
    "destiny": 2,
    "psychic": 9
  },
  {
    "name": "Neil Armstrong",
    "dob": "05/08/1930",
    "note": "Astronaut",
    "lifePath": 8,
    "destiny": 8,
    "psychic": 5
  },
  {
    "name": "Kalpana Chawla",
    "dob": "17/03/1962",
    "note": "Astronaut",
    "lifePath": 2,
    "destiny": 2,
    "psychic": 8
  },
  {
    "name": "Ratan Tata",
    "dob": "28/12/1937",
    "note": "Entrepreneur",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 1
  },
  {
    "name": "Dhirubhai Ambani",
    "dob": "28/12/1932",
    "note": "Entrepreneur",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 1
  },
  {
    "name": "Narendra Modi",
    "dob": "17/09/1950",
    "note": "Statesman",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 8
  },
  {
    "name": "Joe Biden",
    "dob": "20/11/1942",
    "note": "Statesman",
    "lifePath": 2,
    "destiny": 2,
    "psychic": 2
  },
  {
    "name": "Emmanuel Macron",
    "dob": "21/12/1977",
    "note": "Statesman",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 3
  },
  {
    "name": "Jacinda Ardern",
    "dob": "26/07/1980",
    "note": "Statesman",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 8
  },
  {
    "name": "Volodymyr Zelenskyy",
    "dob": "25/01/1978",
    "note": "Statesman",
    "lifePath": 6,
    "destiny": 6,
    "psychic": 7
  },
  {
    "name": "Rihanna",
    "dob": "20/02/1988",
    "note": "Musician",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 2
  },
  {
    "name": "Lady Gaga",
    "dob": "28/03/1986",
    "note": "Musician",
    "lifePath": 1,
    "destiny": 1,
    "psychic": 1
  },
  {
    "name": "Bruno Mars",
    "dob": "08/10/1985",
    "note": "Musician",
    "lifePath": 5,
    "destiny": 5,
    "psychic": 8
  },
  {
    "name": "Ed Sheeran",
    "dob": "17/02/1991",
    "note": "Musician",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 8
  },
  {
    "name": "Drake",
    "dob": "24/10/1986",
    "note": "Musician",
    "lifePath": 4,
    "destiny": 4,
    "psychic": 6
  },
  {
    "name": "Bruce Lee",
    "dob": "27/11/1940",
    "note": "Martial artist",
    "lifePath": 7,
    "destiny": 7,
    "psychic": 9
  },
  {
    "name": "Jackie Chan",
    "dob": "07/04/1954",
    "note": "Actor",
    "lifePath": 3,
    "destiny": 3,
    "psychic": 7
  }
];
