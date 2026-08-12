/**
 * app.js - Marvel Road to Doomsday PWA Complete Logic
 */

// --- 1. LOCAL STORAGE ---
const STORE_KEY = 'marvel_doomsday_v2';
let state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
function save() { localStorage.setItem(STORE_KEY, JSON.stringify(state)); }

// --- 2. DATA STRUCTURE & PROJECT LIST ---
// Helper to assign poster class
function getPosterClass(universe) {
  if (/MCU|Disney\+|Multiverse/i.test(universe)) return 'poster-mcu';
  if (/Fantastic Four/i.test(universe)) return 'poster-ff';
  if (/X-Men|Fox/i.test(universe)) return 'poster-xmen';
  if (/Spider|Sony|Venom/i.test(universe)) return 'poster-spider';
  if (/Netflix/i.test(universe)) return 'poster-netflix';
  if (/Animation|Animated/i.test(universe)) return 'poster-animation';
  return 'poster-legacy';
}

const rawProjects = [
  // Section 01
  [1, 'Iron Man', 2008, 'Movie', 'MCU', '01', 'Doomsday Critical', true, 'Tony Stark builds an armored suit and becomes a superhero.', 'tt0371746'],
  [2, 'The Incredible Hulk', 2008, 'Movie', 'MCU', '01', 'Essential', false, 'Bruce Banner goes on the run to cure his mutation.', 'tt0800080'],
  [3, 'Iron Man 2', 2010, 'Movie', 'MCU', '01', 'Essential', false, 'Tony faces a new foe and the government wanting his tech.', 'tt1228705'],
  [4, 'Thor', 2011, 'Movie', 'MCU', '01', 'Essential', false, 'The God of Thunder is exiled to Earth.', 'tt0800369'],
  [5, 'Captain America: The First Avenger', 2011, 'Movie', 'MCU', '01', 'Essential', false, 'Steve Rogers becomes the first Avenger during WWII.', 'tt0458339'],
  [6, 'Marvel One-Shot: The Consultant', 2011, 'One-Shot', 'MCU', '01', 'Completionist', false, 'Agent Coulson needs help keeping Blonsky out of the Avengers.', 'tt2011109'],
  [7, 'Marvel One-Shot: A Funny Thing Happened on the Way to Thor\'s Hammer', 2011, 'One-Shot', 'MCU', '01', 'Completionist', false, 'Coulson stops a robbery on his way to New Mexico.', 'tt2011118'],
  [8, 'The Avengers', 2012, 'Movie', 'MCU', '01', 'Doomsday Critical', false, 'Earth\'s mightiest heroes must come together to stop Loki.', 'tt0848228'],
  [9, 'Marvel One-Shot: Item 47', 2012, 'One-Shot', 'MCU', '01', 'Completionist', false, 'A couple finds a Chitauri gun and goes on a spree.', 'tt2247732'],
  // Section 02
  [10, 'Iron Man 3', 2013, 'Movie', 'MCU', '02', 'Essential', false, 'Tony Stark struggles with PTSD and faces the Mandarin.', 'tt1300854'],
  [11, 'Marvel One-Shot: Agent Carter', 2013, 'One-Shot', 'MCU', '02', 'Completionist', false, 'Peggy Carter goes on a solo mission after WWII.', 'tt3067038'],
  [12, 'Thor: The Dark World', 2013, 'Movie', 'MCU', '02', 'Recommended', false, 'Thor must save Earth and the Nine Realms from an ancient enemy.', 'tt1981115'],
  [13, 'Marvel One-Shot: All Hail the King', 2014, 'One-Shot', 'MCU', '02', 'Completionist', false, 'Trevor Slattery gets interviewed in prison.', 'tt3438640'],
  [14, 'Captain America: The Winter Soldier', 2014, 'Movie', 'MCU', '02', 'Essential', false, 'Cap discovers a conspiracy within S.H.I.E.L.D.', 'tt1843866'],
  [15, 'Guardians of the Galaxy', 2014, 'Movie', 'MCU', '02', 'Essential', false, 'A group of intergalactic criminals must pull together to stop a fanatical warrior.', 'tt2015381'],
  [16, 'Avengers: Age of Ultron', 2015, 'Movie', 'MCU', '02', 'Essential', false, 'The Avengers must stop the rogue AI Ultron from destroying humanity.', 'tt2395427'],
  [17, 'Ant-Man', 2015, 'Movie', 'MCU', '02', 'Essential', false, 'Scott Lang must embrace his inner hero and help his mentor.', 'tt0478970'],
  // Section 03
  [18, 'Captain America: Civil War', 2016, 'Movie', 'MCU', '03', 'Doomsday Critical', true, 'The Avengers fracture over government oversight.', 'tt3498820'],
  [19, 'Team Thor: Part 1', 2016, 'Short', 'MCU', '03', 'Completionist', false, 'A comedic look at what Thor was doing during Civil War.', 'tt6013230'],
  [20, 'Doctor Strange', 2016, 'Movie', 'MCU', '03', 'Doomsday Critical', true, 'Stephen Strange learns the mystic arts after a tragic accident.', 'tt1228705'],
  [21, 'Team Thor: Part 2', 2017, 'Short', 'MCU', '03', 'Completionist', false, 'Thor continues his roommate adventures in Australia.', 'tt6579202'],
  [22, 'Guardians of the Galaxy Vol. 2', 2017, 'Movie', 'MCU', '03', 'Recommended', false, 'The Guardians uncover the mystery of Peter Quill\'s true parentage.', 'tt3896198'],
  [23, 'Spider-Man: Homecoming', 2017, 'Movie', 'MCU / Spider-Man', '03', 'Essential', false, 'Peter Parker balances high school and being a superhero.', 'tt2250912'],
  [24, 'Thor: Ragnarok', 2017, 'Movie', 'MCU', '03', 'Doomsday Critical', true, 'Thor must escape a gladiatorial planet to save Asgard.', 'tt3501632'],
  [25, 'Team Darryl', 2018, 'Short', 'MCU', '03', 'Completionist', false, 'Darryl gets a new roommate: The Grandmaster.', 'tt7996324'],
  [26, 'Black Panther', 2018, 'Movie', 'MCU', '03', 'Essential', false, 'T\'Challa returns home to Wakanda to take his rightful place as king.', 'tt1825683'],
  [27, 'Avengers: Infinity War', 2018, 'Movie', 'MCU', '03', 'Doomsday Critical', true, 'The Avengers must stop Thanos from collecting all the Infinity Stones.', 'tt4154756'],
  [28, 'Ant-Man and the Wasp', 2018, 'Movie', 'MCU', '03', 'Essential', false, 'Scott Lang and Hope van Dyne team up to rescue Janet from the Quantum Realm.', 'tt5095030'],
  [29, 'Captain Marvel', 2019, 'Movie', 'MCU', '03', 'Essential', false, 'Carol Danvers becomes one of the universe\'s most powerful heroes.', 'tt4154664'],
  [30, 'Avengers: Endgame', 2019, 'Movie', 'MCU', '03', 'Doomsday Critical', true, 'The remaining Avengers attempt to reverse Thanos\'s snap.', 'tt4154796'],
  [31, 'Spider-Man: Far From Home', 2019, 'Movie', 'MCU / Spider-Man', '03', 'Essential', false, 'Peter Parker faces new threats on a school trip to Europe.', 'tt6320628'],
  // Section 04
  [32, 'X-Men', 2000, 'Movie', 'X-Men', '04', 'Recommended', false, 'Mutants must choose sides in a battle for human acceptance.', 'tt0120903'],
  [33, 'X2: X-Men United', 2003, 'Movie', 'X-Men', '04', 'Recommended', false, 'The X-Men team up with Magneto to fight a military threat.', 'tt0290334'],
  [34, 'X-Men: The Last Stand', 2006, 'Movie', 'X-Men', '04', 'Recommended', false, 'A "cure" for mutancy divides the X-Men and the Brotherhood.', 'tt0376994'],
  [35, 'X-Men Origins: Wolverine', 2009, 'Movie', 'X-Men', '04', 'Side Quest', false, 'The early life of Logan and his time with Weapon X.', 'tt0458525'],
  [36, 'X-Men: First Class', 2011, 'Movie', 'X-Men', '04', 'Recommended', false, 'The origins of the X-Men during the Cold War.', 'tt1270798'],
  [37, 'The Wolverine', 2013, 'Movie', 'X-Men', '04', 'Side Quest', false, 'Logan travels to Japan to meet an old acquaintance.', 'tt1430132'],
  [38, 'X-Men: Days of Future Past', 2014, 'Movie', 'X-Men', '04', 'Recommended', false, 'Wolverine goes back in time to prevent a dystopian future.', 'tt1877832'],
  [39, 'Deadpool', 2016, 'Movie', 'X-Men / Fox', '04', 'Recommended', false, 'A wisecracking mercenary seeks revenge after a rogue experiment.', 'tt1431045'],
  [40, 'X-Men: Apocalypse', 2016, 'Movie', 'X-Men', '04', 'Side Quest', false, 'The X-Men must stop the ancient mutant Apocalypse.', 'tt3385516'],
  [41, 'Logan', 2017, 'Movie', 'X-Men', '04', 'Recommended', false, 'An aging Logan cares for Charles Xavier and a young mutant.', 'tt3315342'],
  [42, 'Deadpool 2', 2018, 'Movie', 'X-Men / Fox', '04', 'Recommended', false, 'Deadpool forms X-Force to protect a young mutant from Cable.', 'tt5463162'],
  [43, 'Dark Phoenix', 2019, 'Movie', 'X-Men', '04', 'Side Quest', false, 'Jean Grey loses control of her powers and becomes the Dark Phoenix.', 'tt6565702'],
  [44, 'The New Mutants', 2020, 'Movie', 'X-Men', '04', 'Side Quest', false, 'Young mutants held in a secret facility discover their abilities.', 'tt4620274'],
  [45, 'X-Men \'97 — Season 1', 2024, 'Series', 'Marvel / Animation', '04', 'Side Quest', false, 'A continuation of the classic animated series.', 'tt15852992'],
  [46, 'X-Men \'97 — Season 2', 2026, 'Series', 'Marvel / Animation', '04', 'Side Quest', false, 'The mutant struggle for coexistence continues.', ''],
  [47, 'Legion — Season 1', 2017, 'Series', 'Fox / X-Men', '04', 'Completionist', false, 'David Haller discovers the voices in his head are real.', 'tt5114356'],
  [48, 'Legion — Season 2', 2018, 'Series', 'Fox / X-Men', '04', 'Completionist', false, 'David grapples with the Shadow King.', ''],
  [49, 'Legion — Season 3', 2019, 'Series', 'Fox / X-Men', '04', 'Completionist', false, 'The mind-bending conclusion to David\'s journey.', ''],
  [50, 'The Gifted — Season 1', 2017, 'Series', 'Fox / X-Men', '04', 'Completionist', false, 'A family goes on the run when their children show mutant powers.', 'tt4372826'],
  [51, 'The Gifted — Season 2', 2019, 'Series', 'Fox / X-Men', '04', 'Completionist', false, 'Mutant underground factions fight for their future.', ''],
  // Section 05
  [52, 'Spider-Man', 2002, 'Movie', 'Sony / Spider-Man', '05', 'Recommended', false, 'Peter Parker is bitten by a radioactive spider.', 'tt0145487'],
  [53, 'Spider-Man 2', 2004, 'Movie', 'Sony / Spider-Man', '05', 'Recommended', false, 'Peter struggles to balance his life and fights Doc Ock.', 'tt0316654'],
  [54, 'Spider-Man 3', 2007, 'Movie', 'Sony / Spider-Man', '05', 'Recommended', false, 'Peter faces Sandman, Venom, and his own dark side.', 'tt0413300'],
  [55, 'The Amazing Spider-Man', 2012, 'Movie', 'Sony / Spider-Man', '05', 'Recommended', false, 'A new take on Peter Parker as he battles the Lizard.', 'tt2586634'],
  [56, 'The Amazing Spider-Man 2', 2014, 'Movie', 'Sony / Spider-Man', '05', 'Recommended', false, 'Peter uncovers Oscorp secrets while fighting Electro.', 'tt1872181'],
  [57, 'Venom', 2018, 'Movie', 'Sony / Venom', '05', 'Side Quest', false, 'Eddie Brock bonds with an alien symbiote.', 'tt1270797'],
  [58, 'Venom: Let There Be Carnage', 2021, 'Movie', 'Sony / Venom', '05', 'Recommended', false, 'Eddie Brock faces serial killer Cletus Kasady, host to Carnage.', 'tt7097896'],
  [59, 'Venom: The Last Dance', 2024, 'Movie', 'Sony / Venom', '05', 'Side Quest', false, 'Eddie and Venom face their final challenge together.', 'tt16366836'],
  [60, 'Spider-Man: Into the Spider-Verse', 2018, 'Movie', 'Sony / Spider-Verse', '05', 'Recommended', false, 'Miles Morales learns what it takes to be Spider-Man across dimensions.', 'tt4633694'],
  [61, 'Spider-Man: Across the Spider-Verse', 2023, 'Movie', 'Sony / Spider-Verse', '05', 'Recommended', false, 'Miles is thrown into the multiverse to protect its existence.', 'tt9362722'],
  [62, 'Morbius', 2022, 'Movie', 'Sony Spider-Man Universe', '05', 'Completionist', false, 'A dangerously ill biochemist accidentally infects himself with a form of vampirism.', 'tt5108870'],
  [63, 'Madame Web', 2024, 'Movie', 'Sony Spider-Man Universe', '05', 'Completionist', false, 'Cassandra Webb develops clairvoyant abilities and protects young spider-women.', 'tt11057302'],
  [64, 'Kraven the Hunter', 2024, 'Movie', 'Sony Spider-Man Universe', '05', 'Completionist', false, 'Sergei Kravinoff sets out to prove he is the greatest hunter in the world.', 'tt8746266'],
  // Section 06
  [65, 'Blade', 1998, 'Movie', 'Legacy', '06', 'Completionist', false, 'A half-vampire protects humans from evil vampires.', 'tt0120611'],
  [66, 'Blade II', 2002, 'Movie', 'Legacy', '06', 'Completionist', false, 'Blade teams up with vampires to fight a new mutant strain.', 'tt0187738'],
  [67, 'Blade: Trinity', 2004, 'Movie', 'Legacy', '06', 'Completionist', false, 'Blade joins forces with the Nightstalkers against Dracula.', 'tt0359013'],
  [68, 'Blade: The Series — Season 1', 2006, 'Series', 'Legacy', '06', 'Completionist', false, 'Blade continues his hunt for vampires.', 'tt0823333'],
  [69, 'Daredevil', 2003, 'Movie', 'Fox / Marvel', '06', 'Completionist', false, 'A blind lawyer fights crime as Daredevil.', 'tt0280590'],
  [70, 'Elektra', 2005, 'Movie', 'Fox / Marvel', '06', 'Completionist', false, 'Elektra becomes an assassin for hire.', 'tt0357277'],
  [71, 'The Punisher', 2004, 'Movie', 'Legacy', '06', 'Completionist', false, 'Frank Castle seeks revenge on the crime boss who killed his family.', 'tt0330793'],
  [72, 'Punisher: War Zone', 2008, 'Movie', 'Legacy', '06', 'Completionist', false, 'Frank Castle battles the mobster known as Jigsaw.', 'tt0450811'],
  [73, 'Ghost Rider', 2007, 'Movie', 'Legacy', '06', 'Side Quest', false, 'A stuntman makes a deal with the Devil and becomes his bounty hunter.', 'tt0259153'],
  [74, 'Ghost Rider: Spirit of Vengeance', 2011, 'Movie', 'Legacy', '06', 'Completionist', false, 'Johnny Blaze is called upon to stop the Devil from taking human form.', 'tt1071875'],
  [75, 'Hulk', 2003, 'Movie', 'Legacy', '06', 'Completionist', false, 'Bruce Banner\'s origin story directed by Ang Lee.', 'tt0286716'],
  [76, 'Man-Thing', 2005, 'Movie', 'Legacy', '06', 'Completionist', false, 'A swamp monster guards a sacred Native American land.', 'tt0290145'],
  [77, 'Mutant X — Seasons 1–3', 2001, 'Series', 'Legacy', '06', 'Completionist', false, 'A team of genetically engineered mutants protect their kind.', 'tt0288814'],
  [78, 'X-Men: Evolution — Seasons 1–4', 2000, 'Series', 'Legacy / Animation', '06', 'Completionist', false, 'The X-Men as teenagers in high school.', 'tt0250162'],
  [79, 'Marvel Anime: X-Men — Season 1', 2011, 'Series', 'Legacy / Animation', '06', 'Completionist', false, 'The X-Men investigate cases in Japan.', 'tt1740922'],
  // Section 07
  [80, 'Agent Carter — Season 1', 2015, 'Series', 'Marvel Television', '07', 'Recommended', false, 'Peggy Carter balances secret missions and office life.', 'tt3460014'],
  [81, 'Agent Carter — Season 2', 2016, 'Series', 'Marvel Television', '07', 'Recommended', false, 'Peggy moves to Los Angeles to face a new threat.', ''],
  [82, 'Agents of S.H.I.E.L.D. — Season 1', 2013, 'Series', 'Marvel Television', '07', 'Recommended', false, 'Phil Coulson leads a team to handle strange cases.', 'tt2364582'],
  [83, 'Agents of S.H.I.E.L.D. — Season 2', 2014, 'Series', 'Marvel Television', '07', 'Recommended', false, 'The team rebuilds S.H.I.E.L.D. and faces Inhumans.', ''],
  [84, 'Agents of S.H.I.E.L.D. — Season 3', 2015, 'Series', 'Marvel Television', '07', 'Recommended', false, 'The Inhuman outbreak changes everything for the team.', ''],
  [85, 'Daredevil — Season 1', 2015, 'Series', 'Marvel / Netflix', '07', 'Recommended', false, 'Matt Murdock fights the criminal underworld in Hell\'s Kitchen.', 'tt3322312'],
  [86, 'Jessica Jones — Season 1', 2015, 'Series', 'Marvel / Netflix', '07', 'Recommended', false, 'A super-powered PI deals with her past abuser, Kilgrave.', 'tt2357547'],
  [87, 'Agents of S.H.I.E.L.D. — Season 4', 2016, 'Series', 'Marvel Television', '07', 'Recommended', false, 'Ghost Rider and LMDs test the team\'s limits.', ''],
  [88, 'Daredevil — Season 2', 2016, 'Series', 'Marvel / Netflix', '07', 'Recommended', false, 'Daredevil clashes with the Punisher and Elektra.', ''],
  [89, 'Luke Cage — Season 1', 2016, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'A bulletproof man protects Harlem from corrupt figures.', 'tt3322314'],
  [90, 'Iron Fist — Season 1', 2017, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'Danny Rand returns to New York with a mystical power.', 'tt3322310'],
  [91, 'The Defenders — Season 1', 2017, 'Series', 'Marvel / Netflix', '07', 'Recommended', false, 'The four Netflix heroes unite against the Hand.', 'tt4230076'],
  [92, 'The Punisher — Season 1', 2017, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'Frank Castle uncovers a massive conspiracy tied to his past.', 'tt5675620'],
  [93, 'Jessica Jones — Season 2', 2018, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'Jessica uncovers the dark secrets of how she got her powers.', ''],
  [94, 'Luke Cage — Season 2', 2018, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'Luke Cage faces a new dangerous rival in Harlem.', ''],
  [95, 'Cloak & Dagger — Season 1', 2018, 'Series', 'Marvel Television', '07', 'Completionist', false, 'Two teens from different backgrounds acquire linked superpowers.', 'tt5617622'],
  [96, 'Agents of S.H.I.E.L.D. — Season 5', 2017, 'Series', 'Marvel Television', '07', 'Recommended', false, 'The team is sent to a dystopian future in space.', ''],
  [97, 'Iron Fist — Season 2', 2018, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'Danny Rand protects New York without the support of the Defenders.', ''],
  [98, 'Daredevil — Season 3', 2018, 'Series', 'Marvel / Netflix', '07', 'Recommended', false, 'Matt Murdock returns broken to face Kingpin once more.', ''],
  [99, 'The Punisher — Season 2', 2019, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'Frank gets involved in a mystery surrounding a young girl.', ''],
  [100, 'Runaways — Season 1', 2017, 'Series', 'Marvel Television', '07', 'Completionist', false, 'Teens discover their parents are supervillains.', 'tt1085516'],
  [101, 'Runaways — Season 2', 2018, 'Series', 'Marvel Television', '07', 'Completionist', false, 'The Runaways hide out and hone their abilities.', ''],
  [102, 'Agents of S.H.I.E.L.D. — Season 6', 2019, 'Series', 'Marvel Television', '07', 'Side Quest', false, 'The team faces anomalies across space without Coulson.', ''],
  [103, 'Agents of S.H.I.E.L.D. — Season 7', 2020, 'Series', 'Marvel Television', '07', 'Side Quest', false, 'A time-traveling mission to save S.H.I.E.L.D.\'s history.', ''],
  [104, 'Runaways — Season 3', 2019, 'Series', 'Marvel Television', '07', 'Completionist', false, 'The teens face Morgan le Fay.', ''],
  [105, 'Helstrom — Season 1', 2020, 'Series', 'Marvel Television', '07', 'Completionist', false, 'The children of a serial killer hunt down the worst of humanity.', 'tt10232590'],
  [106, 'Cloak & Dagger — Season 2', 2019, 'Series', 'Marvel Television', '07', 'Completionist', false, 'Tandy and Tyrone face human trafficking and a new villain.', ''],
  [107, 'Jessica Jones — Season 3', 2019, 'Series', 'Marvel / Netflix', '07', 'Side Quest', false, 'Jessica must stop a highly intelligent serial killer.', ''],
  [108, 'Inhumans — Season 1', 2017, 'Series', 'Marvel Television', '07', 'Completionist', false, 'The Royal Family of Inhumans flee to Hawaii after a military coup.', 'tt4122068'],
  // Section 08
  [109, 'Fantastic Four', 1994, 'Movie', 'Legacy / Fantastic Four', '08', 'Completionist', false, 'The unreleased Roger Corman movie.', 'tt0109770'],
  [110, 'Fantastic Four', 2005, 'Movie', 'Fox / Fantastic Four', '08', 'Side Quest', false, 'Four astronauts gain superpowers after cosmic radiation exposure.', 'tt0120667'],
  [111, 'Fantastic Four: Rise of the Silver Surfer', 2007, 'Movie', 'Fox / Fantastic Four', '08', 'Side Quest', false, 'The team faces a cosmic messenger of destruction.', 'tt0486576'],
  [112, 'Fantastic Four', 2015, 'Movie', 'Fox / Fantastic Four', '08', 'Side Quest', false, 'A dark, modern reimagining of Marvel\'s first family.', 'tt1502712'],
  // Section 09
  [113, 'WandaVision — Season 1', 2021, 'Series', 'MCU / Disney+', '09', 'Doomsday Critical', false, 'Wanda Maximoff creates a sitcom reality to cope with Vision\'s death.', 'tt9140560'],
  [114, 'Loki — Season 1', 2021, 'Series', 'MCU / Multiverse', '09', 'Doomsday Critical', true, 'The God of Mischief shatters the timeline and meets the TVA.', 'tt9140554'],
  [115, 'What If...? — Season 1', 2021, 'Series', 'MCU / Animation', '09', 'Essential', false, 'The Watcher observes alternate timelines in the multiverse.', 'tt10168312'],
  [116, 'Spider-Man: No Way Home', 2021, 'Movie', 'MCU / Multiverse', '09', 'Doomsday Critical', true, 'Peter Parker breaks the multiverse to hide his identity.', 'tt10872600'],
  [117, 'Doctor Strange in the Multiverse of Madness', 2022, 'Movie', 'MCU / Multiverse', '09', 'Doomsday Critical', true, 'Strange crosses universes to protect America Chavez from the Scarlet Witch.', 'tt9419884'],
  // Section 10
  [118, 'Black Widow', 2021, 'Movie', 'MCU', '10', 'Recommended', false, 'Natasha Romanoff confronts her past and the Red Room.', 'tt3480822'],
  [119, 'Shang-Chi and the Legend of the Ten Rings', 2021, 'Movie', 'MCU', '10', 'Recommended', false, 'Shang-Chi must face his father and the mysterious Ten Rings.', 'tt9376612'],
  [120, 'Eternals', 2021, 'Movie', 'MCU', '10', 'Completionist', false, 'Immortal beings emerge from hiding to protect Earth from Deviants.', 'tt9032400'],
  [121, 'The Falcon and the Winter Soldier — Season 1', 2021, 'Series', 'MCU / Disney+', '10', 'Recommended', false, 'Sam and Bucky deal with the legacy of Captain America\'s shield.', 'tt9284494'],
  [122, 'Hawkeye — Season 1', 2021, 'Series', 'MCU / Disney+', '10', 'Recommended', false, 'Clint Barton mentors young archer Kate Bishop during the holidays.', 'tt10160804'],
  [123, 'Ms. Marvel — Season 1', 2022, 'Series', 'MCU / Disney+', '10', 'Recommended', false, 'Kamala Khan discovers she has superpowers and a cosmic heritage.', 'tt10857164'],
  [124, 'Moon Knight — Season 1', 2022, 'Series', 'MCU / Disney+', '10', 'Side Quest', false, 'A man with dissociative identity disorder gets powers from an Egyptian moon god.', 'tt10234724'],
  [125, 'She-Hulk: Attorney at Law — Season 1', 2022, 'Series', 'MCU / Disney+', '10', 'Recommended', false, 'Jennifer Walters navigates life as a superhuman lawyer.', 'tt10857160'],
  [126, 'Thor: Love and Thunder', 2022, 'Movie', 'MCU', '10', 'Recommended', false, 'Thor teams up with Mighty Thor to stop Gorr the God Butcher.', 'tt10648342'],
  [127, 'Black Panther: Wakanda Forever', 2022, 'Movie', 'MCU', '10', 'Recommended', false, 'Wakanda mourns T\'Challa and faces a new threat from the sea.', 'tt9114286'],
  [128, 'Ant-Man and the Wasp: Quantumania', 2023, 'Movie', 'MCU / Multiverse', '10', 'Recommended', false, 'The Ant-Family gets trapped in the Quantum Realm and faces Kang.', 'tt10954600'],
  [129, 'Guardians of the Galaxy Vol. 3', 2023, 'Movie', 'MCU', '10', 'Recommended', false, 'The Guardians embark on a final mission to save Rocket\'s life.', 'tt6791350'],
  [130, 'The Marvels', 2023, 'Movie', 'MCU', '10', 'Recommended', false, 'Captain Marvel, Ms. Marvel, and Monica Rambeau\'s powers become entangled.', 'tt10676048'],
  [131, 'Secret Invasion — Season 1', 2023, 'Series', 'MCU / Disney+', '10', 'Recommended', false, 'Nick Fury uncovers a conspiracy by a group of shape-shifting Skrulls.', 'tt13157618'],
  [132, 'Loki — Season 2', 2023, 'Series', 'MCU / Multiverse', '10', 'Doomsday Critical', true, 'Loki battles to save the TVA and the multiverse from unraveling.', ''],
  [133, 'What If...? — Season 2', 2023, 'Series', 'MCU / Animation', '10', 'Recommended', false, 'More alternate timelines are explored across the multiverse.', ''],
  [134, 'What If...? — Season 3', 2024, 'Series', 'MCU / Animation', '10', 'Recommended', false, 'The final adventures in the animated multiverse.', ''],
  [135, 'Echo — Season 1', 2024, 'Series', 'MCU / Disney+', '10', 'Recommended', false, 'Maya Lopez faces her past and the Kingpin.', 'tt13966962'],
  [136, 'Agatha All Along — Season 1', 2024, 'Series', 'MCU / Disney+', '10', 'Recommended', false, 'Agatha Harkness forms a new coven after losing her powers.', 'tt15567558'],
  [137, 'Werewolf by Night', 2022, 'Special', 'MCU', '10', 'Recommended', false, 'Monster hunters gather for a deadly competition.', 'tt15482590'],
  [138, 'The Guardians of the Galaxy Holiday Special', 2022, 'Special', 'MCU', '10', 'Recommended', false, 'Mantis and Drax try to bring Christmas cheer to Peter Quill.', 'tt13623136'],
  [139, 'I Am Groot — Seasons 1–2', 2022, 'Series', 'MCU / Animation', '10', 'Completionist', false, 'Short misadventures of Baby Groot.', 'tt13623148'],
  [140, 'Hit-Monkey — Season 1', 2021, 'Series', 'Marvel / Animation', '10', 'Completionist', false, 'A Japanese snow macaque becomes an assassin.', 'tt11923056'],
  [141, 'Hit-Monkey — Season 2', 2023, 'Series', 'Marvel / Animation', '10', 'Completionist', false, 'The monkey assassin continues his bloody quest.', ''],
  [142, 'M.O.D.O.K. — Season 1', 2021, 'Series', 'Marvel / Animation', '10', 'Completionist', false, 'The megalomaniacal supervillain faces a midlife crisis.', 'tt11923068'],
  // Section 11
  [143, 'Deadpool & Wolverine', 2024, 'Movie', 'MCU / Fox / Multiverse', '11', 'Doomsday Critical', true, 'Deadpool pulls Wolverine from the multiverse to save his timeline.', 'tt6263850'],
  // Section 12
  [144, 'Captain America: Brave New World', 2025, 'Movie', 'MCU', '12', 'Doomsday Critical', false, 'Sam Wilson takes up the mantle of Captain America officially.', 'tt14511726'],
  [145, 'Thunderbolts*', 2025, 'Movie', 'MCU', '12', 'Doomsday Critical', false, 'A team of antiheroes is assembled by the government.', 'tt20986250'],
  [146, 'Daredevil: Born Again — Season 1', 2025, 'Series', 'MCU / Marvel Television', '12', 'Doomsday Critical', false, 'Matt Murdock and Wilson Fisk clash again in the MCU proper.', 'tt20850552'],
  [147, 'Ironheart — Season 1', 2025, 'Series', 'MCU / Disney+', '12', 'Completionist', false, 'Riri Williams creates the most advanced suit of armor since Iron Man.', 'tt13623126'],
  [148, 'Eyes of Wakanda — Season 1', 2025, 'Series', 'MCU / Animation', '12', 'Completionist', false, 'Wakandan warriors travel the world to recover vibranium artifacts.', 'tt30448100'],
  [149, 'Marvel Zombies — Season 1', 2025, 'Series', 'MCU / Animation', '12', 'Recommended', false, 'A continuation of the zombie timeline from What If...?', 'tt15852972'],
  [150, 'Your Friendly Neighborhood Spider-Man — Season 1', 2025, 'Series', 'Marvel / Animation', '12', 'Recommended', false, 'An animated series exploring Peter Parker\'s early days in an alternate timeline.', 'tt15852952'],
  [151, 'Wonder Man — Season 1', 2025, 'Series', 'MCU / Disney+', '12', 'Completionist', false, 'Simon Williams gets involved in superheroism and acting.', 'tt21064560'],
  [152, 'Daredevil: Born Again — Season 2', 2026, 'Series', 'MCU / Marvel Television', '12', 'Essential', false, 'The battle for Hell\'s Kitchen continues.', ''],
  [153, 'The Punisher: One Last Kill', 2026, 'Special', 'MCU / Marvel Television', '12', 'Recommended', false, 'Frank Castle returns for a deadly mission.', ''],
  [154, 'Your Friendly Neighborhood Spider-Man — Season 2', 2026, 'Series', 'Marvel / Animation', '12', 'Recommended', false, 'Spider-Man\'s journey continues in this animated alternate universe.', ''],
  [155, 'VisionQuest', 2026, 'Series', 'MCU / Disney+', '12', 'Doomsday Critical', false, 'White Vision seeks out his humanity and memories.', 'tt23138804'],
  [156, 'The Fantastic Four: First Steps', 2025, 'Movie', 'MCU / Fantastic Four', '12', 'Doomsday Critical', true, 'Marvel\'s First Family arrives in a retro-futuristic alternate universe.', 'tt10676052'],
  [157, 'Spider-Man: Brand New Day', 2026, 'Movie', 'MCU / Spider-Man', '12', 'Doomsday Critical', false, 'Peter Parker starts a new chapter after being forgotten by the world.', ''],
  // Section 13
  [158, 'Armor Wars', 0, 'Movie', 'MCU', '13', 'Completionist', false, 'Rhodey must protect Tony Stark\'s tech from falling into the wrong hands.', 'tt13623158'],
  [159, 'Blade', 0, 'Movie', 'MCU', '13', 'Completionist', false, 'The daywalker makes his official MCU debut.', 'tt10671440'],
  // Section 14
  [160, 'Avengers: Doomsday', 2026, 'Movie', 'MCU / Multiverse', '14', 'Finale', true, 'The Avengers face Doctor Doom in a multiversal clash.', 'tt10676036'],
  [161, 'Avengers: Secret Wars', 2027, 'Movie', 'MCU / Multiverse', '14', 'Finale', false, 'The ultimate conclusion to the Multiverse Saga.', 'tt10676038']
];

const projects = rawProjects.map(p => ({
  id: p[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  n: p[0],
  title: p[1],
  year: p[2],
  type: p[3],
  universe: p[4],
  section: p[5],
  level: p[6],
  doomsdayRun: p[7],
  desc: p[8],
  imdb: p[9],
  posterClass: getPosterClass(p[4])
}));

// --- 3. SECTION DEFINITIONS ---
const sections = {
  '01': { name: 'THE MCU FOUNDATION', desc: 'Start here: learn the Avengers, SHIELD, Infinity Stones and MCU rules.', saga: 'infinity' },
  '02': { name: 'THE MCU EXPANDS', desc: 'Hydra, cosmic heroes, Ultron and the Quantum Realm build the world Civil War will fracture.', saga: 'infinity' },
  '03': { name: 'THE INFINITY SAGA: HEROES → ENDGAME', desc: 'Follow the main MCU spine through the Snap, Endgame and Peter Parker\'s post-Endgame setup.', saga: 'infinity' },
  '04': { name: 'BUILD THE LEGACY WORLDS', desc: 'Learn the mutant timeline, Wolverine and Deadpool before the legacy collision.', saga: 'legacy' },
  '05': { name: 'COMPLETE THE SPIDER-MAN MULTIVERSE', desc: 'Know Tobey, Andrew, Venom and Spider-Verse before No Way Home.', saga: 'legacy' },
  '06': { name: 'LEGACY MARVEL', desc: 'Blade, Ghost Rider, Punisher, Daredevil — the pre-MCU Marvel film universe.', saga: 'legacy' },
  '07': { name: 'MARVEL TELEVISION / NETFLIX', desc: 'Complete the long-form Marvel Television and Netflix world.', saga: 'legacy' },
  '08': { name: 'FANTASTIC FOUR: KNOW THE LEGACY', desc: 'See previous Fantastic Four worlds before the modern MCU team.', saga: 'legacy' },
  '09': { name: 'THE MULTIVERSE AWAKENS', desc: 'Wanda, Loki, What If...? and No Way Home establish the multiverse.', saga: 'multiverse' },
  '10': { name: 'COMPLETE THE MODERN MULTIVERSE', desc: 'Fill in the wider post-Endgame MCU and remaining animation.', saga: 'multiverse' },
  '11': { name: 'THE LEGACY COLLISION', desc: 'Deadpool & Wolverine bridges the legacy worlds with the MCU.', saga: 'multiverse' },
  '12': { name: 'THE CURRENT MCU: DOOMSDAY ASSEMBLY', desc: 'Current heroes, Fantastic Four and Spider-Man lead toward Doom.', saga: 'multiverse' },
  '13': { name: 'UPCOMING / ANNOUNCED', desc: 'Announced projects with no confirmed release date.', saga: 'multiverse' },
  '14': { name: 'DESTINATION', desc: 'The finish line — the culmination of the entire Marvel saga.', saga: 'multiverse' }
};

// --- 4. TYPE ICONS & RELEVANCE MAP ---
const typeIcons = { 'Movie': '🎬', 'Series': '📺', 'Special': '⭐', 'One-Shot': '🎞️', 'Short': '🎬' };

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}

// --- 5. RENDER ENGINE ---
let essentialRunMode = false;

function render() {
  const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const filterRank = document.getElementById('filterRank')?.value || 'all';
  const filterFormat = document.getElementById('filterFormat')?.value || 'all';
  
  let filtered = projects.filter(p => {
    if (essentialRunMode && !p.doomsdayRun) return false;
    if (filterRank !== 'all' && p.level !== filterRank) return false;
    if (filterFormat !== 'all' && p.type !== filterFormat) return false;
    if (searchInput) {
      const q = searchInput;
      const sName = sections[p.section]?.name.toLowerCase() || '';
      if (!p.title.toLowerCase().includes(q) && !p.universe.toLowerCase().includes(q) && !sName.includes(q)) return false;
    }
    return true;
  });

  const grouped = {};
  filtered.forEach(p => {
    if (!grouped[p.section]) grouped[p.section] = [];
    grouped[p.section].push(p);
  });

  const listEl = document.getElementById('projectList');
  if (!listEl) return;
  listEl.innerHTML = '';
  
  if (filtered.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No projects found matching your filters.</div>';
  } else {
    Object.keys(sections).sort().forEach(secKey => {
      const sectionProjects = grouped[secKey];
      if (!sectionProjects) return;
      
      const secInfo = sections[secKey];
      const totalSec = projects.filter(p => p.section === secKey).length;
      const doneSec = projects.filter(p => p.section === secKey && state[p.id]).length;
      const pct = totalSec === 0 ? 0 : Math.round((doneSec / totalSec) * 100);
      
      const sectionHTML = document.createElement('div');
      sectionHTML.className = 'phase-section';
      sectionHTML.id = `section-${secKey}`;
      
      let html = `
        <div class="phase-header">
          <div class="phase-header-main">
            <svg class="phase-ring" viewBox="0 0 36 36">
              <path class="ring-bg" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" />
              <path class="ring-fill" stroke-dasharray="${pct}, 100" d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" />
            </svg>
            <div class="phase-titles">
              <h2>Phase ${secKey}: ${escapeHTML(secInfo.name)}</h2>
              <p>${escapeHTML(secInfo.desc)}</p>
            </div>
            <span class="count-badge">${doneSec}/${totalSec}</span>
          </div>
        </div>
        <div class="project-cards">
      `;
      
      sectionProjects.forEach(p => {
        const isDone = !!state[p.id];
        const isFinal = secKey === '14' ? 'final-card' : '';
        const isDoomsday = p.title.includes('Doomsday') ? 'doomsday-card' : '';
        const yearStr = p.year === 0 ? 'TBA' : p.year;
        const icon = typeIcons[p.type] || '🎬';
        const numStr = String(p.n).padStart(3, '0');
        
        html += `
          <div class="project-card ${isDone ? 'done' : ''} ${isFinal} ${isDoomsday}" data-id="${p.id}" onclick="showDetail('${p.id}')">
            <div class="project-poster ${p.posterClass}">${icon}</div>
            <div class="project-info">
              <h3><span class="num">${numStr}</span> ${escapeHTML(p.title)}</h3>
              <div class="meta">${p.type} &middot; ${escapeHTML(p.universe)} &middot; ${yearStr}</div>
              <span class="rank-badge rank-${p.level.replace(/ /g, '-').toLowerCase()}">${p.level}</span>
            </div>
            <div class="action-zone" onclick="event.stopPropagation()">
              <input type="checkbox" class="check" ${isDone ? 'checked' : ''} onchange="toggle('${p.id}')">
              <span class="project-arrow" onclick="showDetail('${p.id}')">&rsaquo;</span>
            </div>
          </div>
        `;
      });
      html += `</div>`;
      sectionHTML.innerHTML = html;
      listEl.appendChild(sectionHTML);
    });
  }

  updateProgress();
}

// --- 6. PROGRESS TRACKING ---
function updateProgress() {
  const total = projects.length;
  const done = projects.filter(p => state[p.id]).length;
  const pct = Math.round((done / total) * 100);
  
  if (document.getElementById('doneCount')) document.getElementById('doneCount').innerText = done;
  if (document.getElementById('totalCount')) document.getElementById('totalCount').innerText = total;
  if (document.getElementById('progressPct')) document.getElementById('progressPct').innerText = pct + '%';
  if (document.getElementById('progressFill')) document.getElementById('progressFill').style.width = pct + '%';
  if (document.getElementById('statProjects')) document.getElementById('statProjects').innerText = done;
  if (document.getElementById('statRemaining')) document.getElementById('statRemaining').innerText = total - done;
  
  // Infinity Saga progress (01-03)
  const infProjects = projects.filter(p => ['01', '02', '03'].includes(p.section));
  const infDone = infProjects.filter(p => state[p.id]).length;
  const infPct = Math.round((infDone / Math.max(1, infProjects.length)) * 100);
  if (document.getElementById('infinityArc')) document.getElementById('infinityArc').setAttribute('stroke-dasharray', `${infPct}, 100`);
  if (document.getElementById('infinityPct')) document.getElementById('infinityPct').innerText = infPct + '%';
  
  // Multiverse Saga progress (09-14)
  const mvProjects = projects.filter(p => ['09', '10', '11', '12', '13', '14'].includes(p.section));
  const mvDone = mvProjects.filter(p => state[p.id]).length;
  const mvPct = Math.round((mvDone / Math.max(1, mvProjects.length)) * 100);
  if (document.getElementById('multiverseArc')) document.getElementById('multiverseArc').setAttribute('stroke-dasharray', `${mvPct}, 100`);
  if (document.getElementById('multiversePct')) document.getElementById('multiversePct').innerText = mvPct + '%';
}

// --- 7. TOGGLE & MODAL ---
window.toggle = function(id) {
  const wasChecked = !!state[id];
  state[id] = !wasChecked;
  save();
  render();
  
  if (document.getElementById('modalOverlay')?.classList.contains('active')) {
    const btn = document.getElementById('modalWatchBtn');
    if (btn) {
      btn.innerText = state[id] ? 'Unmark Watched' : 'Mark as Watched';
      btn.className = state[id] ? 'btn-watched' : 'btn-unwatched';
    }
  }

  if (!wasChecked) checkAchievements();
};

window.showDetail = function(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  
  const icon = typeIcons[p.type] || '🎬';
  const isDone = !!state[p.id];
  
  document.getElementById('modalPoster').className = `modal-poster ${p.posterClass}`;
  document.getElementById('modalPoster').innerHTML = `<div class="modal-poster-icon">${icon}</div><div class="modal-poster-title">${escapeHTML(p.title)}</div>`;
  
  document.getElementById('modalBadges').innerHTML = `
    <span class="rank-badge rank-${p.level.replace(/ /g, '-').toLowerCase()}">${p.level}</span>
    <span class="rank-badge">${p.type}</span>
    <span class="rank-badge">${escapeHTML(p.universe)}</span>
  `;
  
  document.getElementById('modalTitle').innerText = p.title;
  document.getElementById('modalMeta').innerText = `${p.type} · ${p.universe} · ${p.year === 0 ? 'TBA' : p.year}`;
  document.getElementById('modalDesc').innerText = p.desc;
  
  const relEl = document.getElementById('modalRelevance');
  if (p.level === 'Doomsday Critical' || p.level === 'Essential') {
    relEl.innerText = `Relevance: Crucial path to Avengers: Doomsday.`;
    relEl.style.display = 'block';
  } else {
    relEl.style.display = 'none';
  }
  
  const btn = document.getElementById('modalWatchBtn');
  btn.innerText = isDone ? 'Unmark Watched' : 'Mark as Watched';
  btn.className = isDone ? 'btn-watched' : 'btn-unwatched';
  btn.onclick = () => toggle(p.id);
  
  const imdbBtn = document.getElementById('modalImdb');
  if (p.imdb) imdbBtn.href = `https://www.imdb.com/title/${p.imdb}/`;
  else imdbBtn.href = `https://www.imdb.com/find/?q=${encodeURIComponent(p.title)}`;
  
  document.getElementById('modalOverlay').classList.add('active');
};

// --- 8. ACHIEVEMENTS & CONFETTI ---
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastText').innerText = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function checkAchievements() {
  const total = projects.length;
  const done = projects.filter(p => state[p.id]).length;
  
  if (done === total) {
    showToast('🎉 DOOMSDAY READY: 100% Complete!');
    fireConfetti();
    return;
  }
  
  // Check section completions
  Object.keys(sections).forEach(secKey => {
    const secProjects = projects.filter(p => p.section === secKey);
    if (secProjects.length === 0) return;
    const secDone = secProjects.filter(p => state[p.id]).length;
    
    // If it was just completed (we only call this on newly checked items, so if it's 100% now, we show it)
    // To prevent spam, we could track past completions in state, but simple check is okay for now.
    // For perfection, check if all projects in this section are true.
    if (secDone === secProjects.length) {
      // Just check if we haven't fired a toast for it recently (or just fire it)
      // We will store achievements in state
      if (!state[`achieved_${secKey}`]) {
        state[`achieved_${secKey}`] = true;
        save();
        showToast(`🎉 Phase ${secKey} Complete! ${sections[secKey].name}`);
      }
    } else {
      if (state[`achieved_${secKey}`]) {
        state[`achieved_${secKey}`] = false;
        save();
      }
    }
  });
}

function fireConfetti() {
  const cvs = document.getElementById('confettiCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
  
  const particles = [];
  const colors = ['#e62429', '#f0a500', '#00b050', '#00a8e8'];
  
  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * cvs.width,
      y: Math.random() * cvs.height - cvs.height,
      vx: Math.random() * 4 - 2,
      vy: Math.random() * 5 + 2,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    let active = false;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < cvs.height) active = true;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    frame++;
    if (active && frame < 300) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, cvs.width, cvs.height);
  }
  animate();
}

// --- 9. PWA & EVENTS ---
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('installBtn');
  if (btn) btn.classList.add('show');
  const topBtn = document.getElementById('installTopBtn');
  if (topBtn) topBtn.classList.add('show');
});

function triggerInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      document.getElementById('installBtn')?.classList.remove('show');
      document.getElementById('installTopBtn')?.classList.remove('show');
    });
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Filters
  document.getElementById('searchInput')?.addEventListener('input', render);
  document.getElementById('filterRank')?.addEventListener('change', render);
  document.getElementById('filterFormat')?.addEventListener('change', render);
  
  document.getElementById('filterToggle')?.addEventListener('click', () => {
    document.getElementById('filterPanel')?.classList.toggle('open');
  });
  
  document.getElementById('essentialRunBtn')?.addEventListener('click', (e) => {
    essentialRunMode = !essentialRunMode;
    e.currentTarget.classList.toggle('active');
    render();
  });
  
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all your progress?')) {
      state = {};
      save();
      render();
    }
  });
  
  document.getElementById('installBtn')?.addEventListener('click', triggerInstall);
  document.getElementById('installTopBtn')?.addEventListener('click', triggerInstall);
  
  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('modalOverlay')?.classList.remove('active');
  });
  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') document.getElementById('modalOverlay').classList.remove('active');
  });
  
  // Bottom Nav smooth scroll
  document.querySelectorAll('[data-go]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-go');
      if (targetId === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
  
  render();
});
