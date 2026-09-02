/**
 * app.js - Marvel Road to Doomsday PWA Complete Engine & Knowledge Suite v3
 */

// ══════════════════════════════════════════════════════════
// 1. STATE, SETTINGS & PROFILE STORAGE
// ══════════════════════════════════════════════════════════
const STORE_KEY = 'marvel_doomsday_v2';
const SETTINGS_KEY = 'marvel_doomsday_settings_v2';
const PROFILE_KEY = 'marvel_doomsday_profile_v3';

let state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
let settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify({
  activeTab: 'tracker',
  orderMode: 'release',
  activeChip: 'all'
}));
let profile = JSON.parse(localStorage.getItem(PROFILE_KEY) || JSON.stringify({
  heroName: '',
  avatar: '🦸',
  joinedDate: new Date().toISOString().slice(0, 10)
}));

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function saveProfile() {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

// ══════════════════════════════════════════════════════════
// 2. DATA STRUCTURE & SECTION DEFINITIONS
// ══════════════════════════════════════════════════════════
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

const typeIcons = {
  'Movie': '🎬',
  'Series': '📺',
  'Special': '⭐',
  'One-Shot': '🎞️',
  'Short': '🎬'
};

const rankClasses = {
  'Doomsday Critical': 'rank-doomsday-critical',
  'Essential': 'rank-essential',
  'Recommended': 'rank-recommended',
  'Side Quest': 'rank-side-quest',
  'Completionist': 'rank-completionist',
  'Finale': 'rank-finale'
};

function getPosterClass(universe) {
  if (/MCU|Disney\+|Multiverse/i.test(universe)) return 'poster-mcu';
  if (/Fantastic Four/i.test(universe)) return 'poster-ff';
  if (/X-Men|Fox/i.test(universe)) return 'poster-xmen';
  if (/Spider|Sony|Venom/i.test(universe)) return 'poster-spider';
  if (/Netflix/i.test(universe)) return 'poster-netflix';
  if (/Animation|Animated/i.test(universe)) return 'poster-animation';
  return 'poster-legacy';
}

function getEstimatedRuntime(type, title) {
  if (title.includes('Endgame')) return 181;
  if (title.includes('Infinity War')) return 149;
  if (type === 'Movie') return 125;
  if (type === 'Series') {
    if (title.includes('Agents of S.H.I.E.L.D.') || title.includes('Mutant X') || title.includes('Evolution')) return 900;
    if (title.includes('Daredevil') || title.includes('Jessica') || title.includes('Luke') || title.includes('Iron Fist') || title.includes('Punisher') || title.includes('Legion') || title.includes('Runaways') || title.includes('Cloak')) return 580;
    return 300;
  }
  if (type === 'Special') return 52;
  if (type === 'One-Shot') return 12;
  if (type === 'Short') return 6;
  return 90;
}

const chronoRankMap = {
  'captain-america-the-first-avenger': 1,
  'marvel-one-shot-agent-carter': 2,
  'agent-carter-season-1': 3,
  'agent-carter-season-2': 4,
  'captain-marvel': 5,
  'iron-man': 6,
  'the-incredible-hulk': 7,
  'iron-man-2': 8,
  'thor': 9,
  'marvel-one-shot-the-consultant': 10,
  'marvel-one-shot-a-funny-thing-happened-on-the-way-to-thor-s-hammer': 11,
  'the-avengers': 12,
  'marvel-one-shot-item-47': 13,
  'iron-man-3': 14,
  'marvel-one-shot-all-hail-the-king': 15,
  'agents-of-s-h-i-e-l-d-season-1': 16,
  'thor-the-dark-world': 17,
  'captain-america-the-winter-soldier': 18,
  'guardians-of-the-galaxy': 19,
  'guardians-of-the-galaxy-vol-2': 20,
  'daredevil-season-1': 21,
  'jessica-jones-season-1': 22,
  'agents-of-s-h-i-e-l-d-season-2': 23,
  'avengers-age-of-ultron': 24,
  'ant-man': 25,
  'daredevil-season-2': 26,
  'luke-cage-season-1': 27,
  'iron-fist-season-1': 28,
  'the-defenders-season-1': 29,
  'agents-of-s-h-i-e-l-d-season-3': 30,
  'captain-america-civil-war': 31,
  'team-thor-part-1': 32,
  'black-widow': 33,
  'black-panther': 34,
  'spider-man-homecoming': 35,
  'the-punisher-season-1': 36,
  'doctor-strange': 37,
  'team-thor-part-2': 38,
  'jessica-jones-season-2': 39,
  'luke-cage-season-2': 40,
  'iron-fist-season-2': 41,
  'daredevil-season-3': 42,
  'the-punisher-season-2': 43,
  'jessica-jones-season-3': 44,
  'cloak-dagger-season-1': 45,
  'cloak-dagger-season-2': 46,
  'runaways-season-1': 47,
  'runaways-season-2': 48,
  'runaways-season-3': 49,
  'agents-of-s-h-i-e-l-d-season-4': 50,
  'agents-of-s-h-i-e-l-d-season-5': 51,
  'agents-of-s-h-i-e-l-d-season-6': 52,
  'agents-of-s-h-i-e-l-d-season-7': 53,
  'inhumans-season-1': 54,
  'helstrom-season-1': 55,
  'thor-ragnarok': 56,
  'team-darryl': 57,
  'ant-man-and-the-wasp': 58,
  'avengers-infinity-war': 59,
  'avengers-endgame': 60,
  'loki-season-1': 61,
  'what-if-season-1': 62,
  'wandavision-season-1': 63,
  'shang-chi-and-the-legend-of-the-ten-rings': 64,
  'the-falcon-and-the-winter-soldier-season-1': 65,
  'spider-man-far-from-home': 66,
  'spider-man-no-way-home': 67,
  'eternals': 68,
  'doctor-strange-in-the-multiverse-of-madness': 69,
  'hawkeye-season-1': 70,
  'moon-knight-season-1': 71,
  'black-panther-wakanda-forever': 72,
  'echo-season-1': 73,
  'she-hulk-attorney-at-law-season-1': 74,
  'ms-marvel-season-1': 75,
  'thor-love-and-thunder': 76,
  'werewolf-by-night': 77,
  'the-guardians-of-the-galaxy-holiday-special': 78,
  'ant-man-and-the-wasp-quantumania': 79,
  'guardians-of-the-galaxy-vol-3': 80,
  'secret-invasion-season-1': 81,
  'the-marvels': 82,
  'loki-season-2': 83,
  'what-if-season-2': 84,
  'what-if-season-3': 85,
  'deadpool-wolverine': 86,
  'agatha-all-along-season-1': 87,
  'i-am-groot-seasons-1-2': 88,
  'hit-monkey-season-1': 89,
  'hit-monkey-season-2': 90,
  'm-o-d-o-k-season-1': 91,
  'captain-america-brave-new-world': 92,
  'thunderbolts': 93,
  'daredevil-born-again-season-1': 94,
  'the-fantastic-four-first-steps': 95,
  'ironheart-season-1': 96,
  'eyes-of-wakanda-season-1': 97,
  'marvel-zombies-season-1': 98,
  'your-friendly-neighborhood-spider-man-season-1': 99,
  'wonder-man-season-1': 100,
  'daredevil-born-again-season-2': 101,
  'the-punisher-one-last-kill': 102,
  'your-friendly-neighborhood-spider-man-season-2': 103,
  'visionquest': 104,
  'spider-man-brand-new-day': 105,
  'armor-wars': 106,
  'blade': 107,
  'avengers-doomsday': 108,
  'avengers-secret-wars': 109
};

const rawProjects = [
  [
    1,
    "Iron Man",
    2008,
    "Movie",
    "MCU",
    "01",
    "Doomsday Critical",
    true,
    "Billionaire Tony Stark builds a high-tech suit of armor to escape captivity and becomes the foundational hero of the MCU.",
    "tt0371746",
    "Robert Downey Jr. as Tony Stark / Iron Man, Gwyneth Paltrow as Pepper Potts, Jeff Bridges as Obadiah Stane, Terrence Howard as James Rhodes",
    "Jon Favreau",
    [
      "Robert Downey Jr. improvised the iconic line \"I am Iron Man\" in the final press conference scene.",
      "The film began production without a completed screenplay; actors and director improvised dialogue during filming.",
      "Samuel L. Jackson made his secret post-credits cameo as Nick Fury, setting up the entire Avengers Initiative."
    ]
  ],
  [
    2,
    "The Incredible Hulk",
    2008,
    "Movie",
    "MCU",
    "01",
    "Essential",
    false,
    "Scientist Bruce Banner searches for a cure to his gamma-radiation mutation while hunted by General Ross and the monstrous Abomination.",
    "tt0800080",
    "Edward Norton as Bruce Banner / Hulk, Liv Tyler as Betty Ross, Tim Roth as Emil Blonsky / Abomination, William Hurt as Thaddeus Ross",
    "Louis Leterrier",
    [
      "Edward Norton uncreditedly rewrote substantial portions of the script before filming.",
      "Lou Ferrigno, who played Hulk in the classic 1970s TV show, voiced the Hulk and had a security guard cameo.",
      "Tony Stark appears in the final scene at a bar, officially linking the Hulk to Iron Man in the shared MCU."
    ]
  ],
  [
    3,
    "Iron Man 2",
    2010,
    "Movie",
    "MCU",
    "01",
    "Essential",
    false,
    "Tony Stark faces declining health from his arc reactor, corporate rivals, and Ivan Vanko while Black Widow and War Machine make their debuts.",
    "tt1228705",
    "Robert Downey Jr. as Tony Stark, Gwyneth Paltrow as Pepper Potts, Don Cheadle as James Rhodes / War Machine, Scarlett Johansson as Natasha Romanoff / Black Widow, Mickey Rourke as Ivan Vanko",
    "Jon Favreau",
    [
      "This marked Don Cheadle's debut as James Rhodes / War Machine, replacing Terrence Howard.",
      "Scarlett Johansson dyed her hair red before even landing the role of Natasha Romanoff / Black Widow.",
      "A prototype of Captain America's shield is used by Tony Stark to balance his particle accelerator."
    ]
  ],
  [
    4,
    "Thor",
    2011,
    "Movie",
    "MCU",
    "01",
    "Essential",
    false,
    "The arrogant God of Thunder is stripped of his powers and cast out of Asgard to Earth, discovering humility while Loki plots for the throne.",
    "tt0800369",
    "Chris Hemsworth as Thor, Natalie Portman as Jane Foster, Tom Hiddleston as Loki, Anthony Hopkins as Odin, Stellan Skarsgård as Erik Selvig",
    "Kenneth Branagh",
    [
      "Tom Hiddleston originally auditioned for the role of Thor before Kenneth Branagh cast him as Loki.",
      "Chris Hemsworth and Tom Hiddleston both put on immense muscle, but Hiddleston was told to lean down for Loki.",
      "Jeremy Renner made an uncredited first appearance as Clint Barton / Hawkeye perched in a crane."
    ]
  ],
  [
    5,
    "Captain America: The First Avenger",
    2011,
    "Movie",
    "MCU",
    "01",
    "Essential",
    false,
    "Steve Rogers undergoes a secret super-soldier experiment during WWII to combat the Red Skull and the rogue Nazi science division Hydra.",
    "tt0458339",
    "Chris Evans as Steve Rogers / Captain America, Hayley Atwell as Peggy Carter, Sebastian Stan as Bucky Barnes, Hugo Weaving as Johann Schmidt / Red Skull, Tommy Lee Jones as Col. Chester Phillips",
    "Joe Johnston",
    [
      "Chris Evans initially declined the role three times due to anxiety about a multi-picture contract before accepting.",
      "Digital \"skinny Steve\" effects were achieved by filming Chris Evans, using body double Leander Deeny, and combining them.",
      "The Tesseract (Space Stone) is formally introduced as Hydra's ultimate cosmic energy weapon."
    ]
  ],
  [
    6,
    "Marvel One-Shot: The Consultant",
    2011,
    "One-Shot",
    "MCU",
    "01",
    "Completionist",
    false,
    "S.H.I.E.L.D. Agents Coulson and Sitwell conspire to send Tony Stark to annoy General Ross, preventing Emil Blonsky from joining the Avengers.",
    "tt2011109",
    "Clark Gregg as Phil Coulson, Maximiliano Hernández as Jasper Sitwell",
    "Leythum",
    [
      "Connects the post-credits scene of The Incredible Hulk back to the S.H.I.E.L.D. Avengers initiative.",
      "Created to demonstrate that S.H.I.E.L.D. actively manipulated events behind the scenes of Phase 1."
    ]
  ],
  [
    7,
    "Marvel One-Shot: A Funny Thing Happened on the Way to Thor's Hammer",
    2011,
    "One-Shot",
    "MCU",
    "01",
    "Completionist",
    false,
    "Agent Phil Coulson displays his lethal combat skills while stopping an armed gas station robbery in New Mexico.",
    "tt2011118",
    "Clark Gregg as Phil Coulson, Jessica Manuel as Gas Station Clerk",
    "Leythum",
    [
      "Proved Agent Coulson was a formidable field operative, not just a bureaucrat.",
      "Takes place directly on the road to the crater site in New Mexico during the events of Thor."
    ]
  ],
  [
    8,
    "The Avengers",
    2012,
    "Movie",
    "MCU",
    "01",
    "Doomsday Critical",
    false,
    "Earth's Mightiest Heroes assemble for the first time to stop Loki and the Chitauri army from subjugating humanity.",
    "tt0848228",
    "Robert Downey Jr. as Tony Stark, Chris Evans as Steve Rogers, Mark Ruffalo as Bruce Banner, Chris Hemsworth as Thor, Scarlett Johansson as Black Widow, Jeremy Renner as Hawkeye, Tom Hiddleston as Loki, Samuel L. Jackson as Nick Fury",
    "Joss Whedon",
    [
      "First film in history to feature a multi-franchise superhero team-up, crossing $1.5 billion worldwide.",
      "Mark Ruffalo took over Bruce Banner and provided full motion-capture performance for the Hulk.",
      "The famous shawarma post-credits scene was filmed in Los Angeles just one day after the world premiere."
    ]
  ],
  [
    9,
    "Marvel One-Shot: Item 47",
    2012,
    "One-Shot",
    "MCU",
    "01",
    "Completionist",
    false,
    "A down-on-their-luck couple discovers a discarded Chitauri energy weapon after the Battle of New York and goes on a bank-robbing spree.",
    "tt2247732",
    "Lizzy Caplan as Claire Weiss, Jesse Bradford as Benny Pollack, Titus Welliver as Agent Felix Blake, Maximiliano Hernández as Jasper Sitwell",
    "Louis D'Esposito",
    [
      "The critical success of this short inspired Marvel Television to develop the Agents of S.H.I.E.L.D. TV series.",
      "Introduced Agent Felix Blake, who later recurred in Marvel's Agents of S.H.I.E.L.D."
    ]
  ],
  [
    10,
    "Iron Man 3",
    2013,
    "Movie",
    "MCU",
    "02",
    "Essential",
    false,
    "Tony Stark wrestles with severe PTSD following the Battle of New York while facing the elusive Mandarin and Extremis-enhanced soldiers.",
    "tt1300854",
    "Robert Downey Jr. as Tony Stark, Gwyneth Paltrow as Pepper Potts, Don Cheadle as James Rhodes / Iron Patriot, Guy Pearce as Aldrich Killian, Ben Kingsley as Trevor Slattery",
    "Shane Black",
    [
      "Shane Black previously directed Robert Downey Jr. in the career-resurrecting thriller Kiss Kiss Bang Bang (2005).",
      "The Trevor Slattery \"Mandarin\" twist was one of the most guarded secrets in MCU history.",
      "Grossed over $1.2 billion, making it the highest-grossing solo superhero film of its time."
    ]
  ],
  [
    11,
    "Marvel One-Shot: Agent Carter",
    2013,
    "One-Shot",
    "MCU",
    "02",
    "Completionist",
    false,
    "Working at the sexist SSR in 1946, Peggy Carter embarks on a solo clandestine mission to retrieve the mysterious Zodiac serum.",
    "tt3067038",
    "Hayley Atwell as Peggy Carter, Bradley Whitford as Agent John Flynn, Dominic Cooper as Howard Stark, Neal McDonough as Dum Dum Dugan",
    "Louis D'Esposito",
    [
      "Hayley Atwell performed all her own hand-to-hand fight stunts in this 15-minute short.",
      "Served as the official proof-of-concept pilot that greenlit the ABC Agent Carter television series."
    ]
  ],
  [
    12,
    "Thor: The Dark World",
    2013,
    "Movie",
    "MCU",
    "02",
    "Recommended",
    false,
    "Thor reluctantly joins forces with Loki to save Jane Foster and protect the cosmos from Malekith and the Reality Stone (Aether).",
    "tt1981115",
    "Chris Hemsworth as Thor, Natalie Portman as Jane Foster, Tom Hiddleston as Loki, Christopher Eccleston as Malekith, Anthony Hopkins as Odin",
    "Alan Taylor",
    [
      "Introduced the Reality Stone in its fluid form as the Aether.",
      "The mid-credits scene introduced Benicio del Toro as The Collector, establishing the Infinity Stone mythos.",
      "Tom Hiddleston disguised as Captain America featured a surprise cameo appearance by Chris Evans."
    ]
  ],
  [
    13,
    "Marvel One-Shot: All Hail the King",
    2014,
    "One-Shot",
    "MCU",
    "02",
    "Completionist",
    false,
    "Imprisoned actor Trevor Slattery enjoys celebrity status in Seagate Prison until a real Ten Rings operative arrives to break him out.",
    "tt3438640",
    "Ben Kingsley as Trevor Slattery, Scoot McNairy as Jackson Norriss, Sam Rockwell as Justin Hammer",
    "Drew Pearce",
    [
      "Directly canonized that the real Mandarin (Wenwu) existed in the MCU, paying off 7 years later in Shang-Chi.",
      "Sam Rockwell returned for a humorous cameo reprising his role as Justin Hammer from Iron Man 2."
    ]
  ],
  [
    14,
    "Captain America: The Winter Soldier",
    2014,
    "Movie",
    "MCU",
    "02",
    "Essential",
    false,
    "Steve Rogers uncovers a pervasive Hydra conspiracy within S.H.I.E.L.D. while confronting a deadly assassin who is his former best friend Bucky.",
    "tt1843866",
    "Chris Evans as Steve Rogers, Scarlett Johansson as Natasha Romanoff, Sebastian Stan as Bucky Barnes / Winter Soldier, Anthony Mackie as Sam Wilson / Falcon, Robert Redford as Alexander Pierce, Samuel L. Jackson as Nick Fury",
    "Anthony Russo, Joe Russo",
    [
      "The Russo Brothers' MCU debut; they drew heavy inspiration from 1970s political thrillers like All the President's Men.",
      "Legendary actor Robert Redford took the role specifically because his grandchildren were passionate Marvel fans.",
      "The glass-elevator fight sequence took over a week to rehearse and shoot with practical stunt combat."
    ]
  ],
  [
    15,
    "Guardians of the Galaxy",
    2014,
    "Movie",
    "MCU",
    "02",
    "Essential",
    false,
    "A reckless outlaw, an assassin, a revenge-driven warrior, a talking raccoon, and a sentient tree unite to protect the Power Stone from Ronan.",
    "tt2015381",
    "Chris Pratt as Peter Quill / Star-Lord, Zoe Saldana as Gamora, Dave Bautista as Drax, Vin Diesel as Groot, Bradley Cooper as Rocket, Lee Pace as Ronan",
    "James Gunn",
    [
      "Chris Pratt lost 60 pounds in 6 months to transform his physique for the role of Star-Lord.",
      "Awesome Mix Vol. 1 topped the Billboard 200 chart with zero original songs, certified Platinum.",
      "Vin Diesel recorded \"I am Groot\" over a thousand times in 15 different languages for international dubs."
    ]
  ],
  [
    16,
    "Avengers: Age of Ultron",
    2015,
    "Movie",
    "MCU",
    "02",
    "Essential",
    false,
    "Tony Stark's rogue artificial intelligence creation seeks humanity's extinction, forcing the Avengers to recruit Wanda, Pietro, and Vision.",
    "tt2395427",
    "Robert Downey Jr., Chris Evans, Chris Hemsworth, Mark Ruffalo, Scarlett Johansson, Jeremy Renner, James Spader as Ultron, Elizabeth Olsen as Wanda Maximoff, Aaron Taylor-Johnson as Pietro, Paul Bettany as Vision",
    "Joss Whedon",
    [
      "James Spader performed on-set in a motion-capture suit with balls positioned at eye-level for his 8-foot robot frame.",
      "Paul Bettany transitioned from voicing J.A.R.V.I.S. for 7 years into live-action physical acting as the android Vision.",
      "Introduced Wanda Maximoff (Scarlet Witch) and the Mind Stone embedded in Vision's forehead."
    ]
  ],
  [
    17,
    "Ant-Man",
    2015,
    "Movie",
    "MCU",
    "02",
    "Essential",
    false,
    "Reformed thief Scott Lang learns to shrink in size and command ants using Hank Pym's technology to pull off an impossible corporate heist.",
    "tt0478970",
    "Paul Rudd as Scott Lang / Ant-Man, Michael Douglas as Hank Pym, Evangeline Lilly as Hope van Dyne, Corey Stoll as Darren Cross / Yellowjacket, Michael Peña as Luis",
    "Peyton Reed",
    [
      "Paul Rudd co-wrote the script alongside Adam McKay after Edgar Wright departed the project.",
      "Michael Douglas stated he took the role because he wanted to be in a movie his children could watch.",
      "Introduced the Quantum Realm, which later proved crucial for time travel in Avengers: Endgame."
    ]
  ],
  [
    18,
    "Captain America: Civil War",
    2016,
    "Movie",
    "MCU",
    "03",
    "Doomsday Critical",
    true,
    "Government oversight splits the Avengers into opposing factions led by Cap and Iron Man, introducing Black Panther and Spider-Man.",
    "tt3498820",
    "Chris Evans as Steve Rogers, Robert Downey Jr. as Tony Stark, Scarlett Johansson as Natasha Romanoff, Sebastian Stan as Bucky Barnes, Anthony Mackie as Sam Wilson, Chadwick Boseman as T'Challa, Tom Holland as Peter Parker, Paul Rudd as Scott Lang",
    "Anthony Russo, Joe Russo",
    [
      "Tom Holland's and Chadwick Boseman's landmark MCU debuts as Spider-Man and Black Panther.",
      "The Leipzig-Halle airport battle sequence was filmed entirely with cutting-edge IMAX digital cameras.",
      "Directly shattered the Avengers team, leaving Earth vulnerable when Thanos arrived two years later."
    ]
  ],
  [
    19,
    "Team Thor: Part 1",
    2016,
    "Short",
    "MCU",
    "03",
    "Completionist",
    false,
    "A hilarious mockumentary exploring what Thor was up to in Australia with his ordinary human roommate Darryl during Civil War.",
    "tt6013230",
    "Chris Hemsworth as Thor, Daley Pearson as Darryl Jacobson, Mark Ruffalo as Bruce Banner",
    "Taika Waititi",
    [
      "Directed by Taika Waititi to test the comedic tone for Thor: Ragnarok before principal photography began.",
      "Thor tries to send an electronic letter to Tony Stark via a child carrying a handwritten paper."
    ]
  ],
  [
    20,
    "Doctor Strange",
    2016,
    "Movie",
    "MCU",
    "03",
    "Doomsday Critical",
    true,
    "Arrogant neurosurgeon Stephen Strange discovers the Mystic Arts, alternate dimensions, and the Time Stone following a catastrophic car crash.",
    "tt1228705",
    "Benedict Cumberbatch as Stephen Strange, Chiwetel Ejiofor as Karl Mordo, Rachel McAdams as Christine Palmer, Benedict Wong as Wong, Mads Mikkelsen as Kaecilius, Tilda Swinton as Ancient One",
    "Scott Derrickson",
    [
      "Benedict Cumberbatch also provided the facial motion capture and voice for the dark cosmic entity Dormammu.",
      "The \"Dormammu, I've come to bargain\" time loop has become one of the most famous tactical climaxes in superhero cinema.",
      "Introduced the Eye of Agamotto housing the green Time Stone."
    ]
  ],
  [
    21,
    "Team Thor: Part 2",
    2017,
    "Short",
    "MCU",
    "03",
    "Completionist",
    false,
    "Thor attempts to pay his domestic rent with Asgardian coins and holds a household meeting with roommate Darryl.",
    "tt6579202",
    "Chris Hemsworth as Thor, Daley Pearson as Darryl Jacobson",
    "Taika Waititi",
    [
      "Continued the beloved comedic mockumentary series about Thor's downtime in Australia.",
      "Thor hires a servant to carry his hammer around the house."
    ]
  ],
  [
    22,
    "Guardians of the Galaxy Vol. 2",
    2017,
    "Movie",
    "MCU",
    "03",
    "Recommended",
    false,
    "The Guardians travel the cosmos to unravel Peter Quill's true Celestial parentage while confronting the living planet Ego.",
    "tt3896198",
    "Chris Pratt as Peter Quill, Zoe Saldana as Gamora, Dave Bautista as Drax, Vin Diesel as Baby Groot, Bradley Cooper as Rocket, Michael Rooker as Yondu, Karen Gillan as Nebula, Kurt Russell as Ego",
    "James Gunn",
    [
      "Kurt Russell was cast as Ego after Chris Pratt suggested him as his dream casting choice.",
      "Features 5 separate post-credits scenes, including the first tease of Adam Warlock.",
      "Michael Rooker's Yondu delivered the legendary emotional line \"He may have been your father, boy, but he wasn't your daddy.\""
    ]
  ],
  [
    23,
    "Spider-Man: Homecoming",
    2017,
    "Movie",
    "MCU / Spider-Man",
    "03",
    "Essential",
    false,
    "Peter Parker balances high school life under Tony Stark's mentorship while taking down Adrian Toomes (The Vulture).",
    "tt2250912",
    "Tom Holland as Peter Parker / Spider-Man, Michael Keaton as Adrian Toomes / Vulture, Robert Downey Jr. as Tony Stark, Marisa Tomei as Aunt May, Zendaya as MJ, Jacob Batalon as Ned",
    "Jon Watts",
    [
      "Michael Keaton previously played Batman (1989) and Birdman (2014) before taking on the feathered villain Vulture.",
      "The car conversation scene between Peter and Adrian Toomes was shot with natural tension without any music score.",
      "First solo Spider-Man movie produced under the historic Marvel Studios and Sony Pictures co-production partnership."
    ]
  ],
  [
    24,
    "Thor: Ragnarok",
    2017,
    "Movie",
    "MCU",
    "03",
    "Doomsday Critical",
    true,
    "Thor is stranded on the trash planet Sakaar, battles the Hulk in a gladiatorial arena, and races to stop his sister Hela from destroying Asgard.",
    "tt3501632",
    "Chris Hemsworth as Thor, Tom Hiddleston as Loki, Cate Blanchett as Hela, Idris Elba as Heimdall, Jeff Goldblum as Grandmaster, Tessa Thompson as Valkyrie, Karl Urban as Skurge, Mark Ruffalo as Bruce Banner / Hulk",
    "Taika Waititi",
    [
      "Taika Waititi revitalized the Thor franchise by improvising nearly 80% of the film's comedic dialogue on set.",
      "Cate Blanchett practiced the Brazilian martial art Capoeira to master Hela's fluid, menacing movement.",
      "Led directly into Avengers: Infinity War, as Thanos' massive ship Sanctuary II intercepts Asgardian refugees in the post-credits."
    ]
  ],
  [
    25,
    "Team Darryl",
    2018,
    "Short",
    "MCU",
    "03",
    "Completionist",
    false,
    "After moving to Los Angeles, Darryl finds a bizarre new roommate: the eccentric Grandmaster deposed from Sakaar.",
    "tt7996324",
    "Jeff Goldblum as The Grandmaster, Daley Pearson as Darryl Jacobson",
    "Taika Waititi",
    [
      "Jeff Goldblum brings his signature eccentric improvisation to Darryl's Los Angeles apartment.",
      "Grandmaster attempts to run for \"President of the Apartment Building.\""
    ]
  ],
  [
    26,
    "Black Panther",
    2018,
    "Movie",
    "MCU",
    "03",
    "Essential",
    false,
    "T'Challa ascends the throne of the hidden African nation of Wakanda and defends its secret Vibranium technology against Erik Killmonger.",
    "tt1825683",
    "Chadwick Boseman as T'Challa / Black Panther, Michael B. Jordan as Erik Killmonger, Lupita Nyong'o as Nakia, Danai Gurira as Okoye, Martin Freeman as Everett Ross, Letitia Wright as Shuri, Angela Bassett as Ramonda, Forest Whitaker as Zuri",
    "Ryan Coogler",
    [
      "First superhero film in history to receive an Academy Award nomination for Best Picture; won 3 Oscars.",
      "Grossed over $1.34 billion worldwide and became a monumental global cultural milestone.",
      "Chadwick Boseman insisted on Wakandans speaking with authentic South African Xhosa-influenced accents."
    ]
  ],
  [
    27,
    "Avengers: Infinity War",
    2018,
    "Movie",
    "MCU",
    "03",
    "Doomsday Critical",
    true,
    "The Avengers and the Guardians of the Galaxy face their greatest threat as Thanos embarks on a relentless quest to collect all six Infinity Stones.",
    "tt4154756",
    "Robert Downey Jr., Chris Hemsworth, Mark Ruffalo, Chris Evans, Scarlett Johansson, Benedict Cumberbatch, Don Cheadle, Tom Holland, Chadwick Boseman, Paul Bettany, Elizabeth Olsen, Anthony Mackie, Sebastian Stan, Danai Gurira, Letitia Wright, Dave Bautista, Zoe Saldana, Josh Brolin as Thanos",
    "Anthony Russo, Joe Russo",
    [
      "Josh Brolin's Thanos is the true protagonist of the film, receiving the highest screen time and character arc.",
      "The \"Dusting\" ending was kept so secret that actors only learned their characters would vanish on the day of filming.",
      "First film to gross over $2 billion without adjusting for inflation during its initial summer run."
    ]
  ],
  [
    28,
    "Ant-Man and the Wasp",
    2018,
    "Movie",
    "MCU",
    "03",
    "Essential",
    false,
    "Scott Lang and Hope van Dyne venture deep into the Quantum Realm to rescue Janet van Dyne while evading Ghost and the FBI.",
    "tt5095030",
    "Paul Rudd as Scott Lang / Ant-Man, Evangeline Lilly as Hope van Dyne / Wasp, Michael Peña as Luis, Walton Goggins as Sonny Burch, Hannah John-Kamen as Ghost, Michelle Pfeiffer as Janet van Dyne, Laurence Fishburne as Bill Foster, Michael Douglas as Hank Pym",
    "Peyton Reed",
    [
      "First Marvel Studios film to feature a female superhero's name in the titular movie title (The Wasp).",
      "The devastating mid-credits scene shows Hank, Janet, and Hope turning to dust from Thanos's Snap, trapping Scott in the Quantum Realm."
    ]
  ],
  [
    29,
    "Captain Marvel",
    2019,
    "Movie",
    "MCU",
    "03",
    "Essential",
    false,
    "Former U.S. Air Force pilot Carol Danvers uncovers her forgotten human past and unlocks supreme cosmic power during a 1995 galactic war.",
    "tt4154664",
    "Brie Larson as Carol Danvers / Captain Marvel, Samuel L. Jackson as Nick Fury, Ben Mendelsohn as Talos, Djimon Hounsou as Korath, Lee Pace as Ronan, Lashana Lynch as Maria Rambeau, Gemma Chan as Minn-Erva, Annette Bening as Supreme Intelligence, Jude Law as Yon-Rogg",
    "Anna Boden, Ryan Fleck",
    [
      "Samuel L. Jackson was digitally de-aged by 25 years for the entire runtime of the film without artifacts.",
      "Goose the Flerken cat was portrayed by four different real feline actors: Reggie, Archie, Rizzo, and Gonzo.",
      "Earned $1.13 billion globally, making it the first female-led superhero film to cross the $1B threshold."
    ]
  ],
  [
    30,
    "Avengers: Endgame",
    2019,
    "Movie",
    "MCU",
    "03",
    "Doomsday Critical",
    true,
    "Five years after Thanos erased half of all life, the surviving Avengers execute a daring Time Heist across MCU history to undo the Snap.",
    "tt4154796",
    "Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Don Cheadle, Paul Rudd, Brie Larson, Karen Gillan, Danai Gurira, Bradley Cooper, Josh Brolin as Thanos",
    "Anthony Russo, Joe Russo",
    [
      "Became the highest-grossing film of all time during its 2019 theatrical run ($2.798 billion).",
      "Robert Downey Jr.'s final MCU performance as Tony Stark before his announced return as Doctor Doom in Avengers: Doomsday.",
      "The \"Avengers Assemble\" portal scene united over 35 MCU superheroes on screen in a single continuous shot."
    ]
  ],
  [
    31,
    "Spider-Man: Far From Home",
    2019,
    "Movie",
    "MCU / Spider-Man",
    "03",
    "Essential",
    false,
    "Grieving the loss of Tony Stark, Peter Parker travels to Europe on a school trip and is manipulated by the illusionist Quentin Beck (Mysterio).",
    "tt6320628",
    "Tom Holland as Peter Parker / Spider-Man, Samuel L. Jackson as Nick Fury, Zendaya as MJ, Cobie Smulders as Maria Hill, Jon Favreau as Happy Hogan, Jacob Batalon as Ned, Marisa Tomei as Aunt May, Jake Gyllenhaal as Quentin Beck / Mysterio",
    "Jon Watts",
    [
      "The shocking mid-credits scene featured J.K. Simmons reprising his iconic role as J. Jonah Jameson from the Tobey Maguire trilogy.",
      "Mysterio revealed Spider-Man's secret identity to the entire world, setting up the multiverse catalyst in No Way Home.",
      "Officially concluded Phase 3 and the 23-movie Infinity Saga."
    ]
  ],
  [
    32,
    "X-Men",
    2000,
    "Movie",
    "X-Men",
    "04",
    "Recommended",
    false,
    "Mutants Wolverine and Rogue join Charles Xavier's school to combat Magneto's militant Brotherhood.",
    "tt0120903",
    "Hugh Jackman as Logan / Wolverine, Patrick Stewart as Charles Xavier, Ian McKellen as Magneto, Famke Janssen as Jean Grey, James Marsden as Cyclops, Halle Berry as Storm, Anna Paquin as Rogue",
    "Bryan Singer",
    [
      "Hugh Jackman was a last-minute replacement for Dougray Scott, who was delayed filming Mission: Impossible II.",
      "The critical and box office success of X-Men in 2000 sparked the modern golden era of comic book cinema.",
      "Patrick Stewart was the fan-favorite casting choice for Professor X for years in comic book fan letters before the movie."
    ]
  ],
  [
    33,
    "X2: X-Men United",
    2003,
    "Movie",
    "X-Men",
    "04",
    "Recommended",
    false,
    "The X-Men forge an uneasy alliance with Magneto to stop military commander William Stryker from eradicating all mutantkind.",
    "tt0290334",
    "Hugh Jackman, Patrick Stewart, Ian McKellen, Halle Berry, Famke Janssen, James Marsden, Rebecca Romijn, Brian Cox as William Stryker, Alan Cumming as Nightcrawler",
    "Bryan Singer",
    [
      "The White House opening sequence featuring Nightcrawler teleporting is considered one of the best superhero opening scenes.",
      "Alan Cumming underwent four hours of prosthetic application daily for Nightcrawler's blue skin and scarifications.",
      "Set up the Phoenix Saga with the climactic sacrifice at Alkali Lake."
    ]
  ],
  [
    34,
    "X-Men: The Last Stand",
    2006,
    "Movie",
    "X-Men",
    "04",
    "Recommended",
    false,
    "A \"mutant cure\" sparks an all-out ideological war while Jean Grey returns as the godlike, uncontrollable Dark Phoenix.",
    "tt0376994",
    "Hugh Jackman, Halle Berry, Ian McKellen, Patrick Stewart, Famke Janssen, Kelsey Grammer as Beast, Elliot Page as Kitty Pryde",
    "Brett Ratner",
    [
      "Kelsey Grammer wore extensive blue fur prosthetics to bring Hank McCoy (Beast) to live action.",
      "Features the iconic line from Juggernaut (Vinnie Jones): \"I'm the Juggernaut, bitch!\"",
      "The post-credits scene teased Professor X transferring his consciousness into a comatose patient."
    ]
  ],
  [
    35,
    "X-Men Origins: Wolverine",
    2009,
    "Movie",
    "X-Men",
    "04",
    "Side Quest",
    false,
    "Logan's violent origins, his sibling rivalry with Sabretooth, and his fateful Adamantium bonding in the Weapon X facility.",
    "tt0458525",
    "Hugh Jackman as Logan / Wolverine, Liev Schreiber as Victor Creed / Sabretooth, Danny Huston as William Stryker, Ryan Reynolds as Wade Wilson",
    "Gavin Hood",
    [
      "Marked Ryan Reynolds' very first appearance as Wade Wilson before his redemption in the 2016 Deadpool film.",
      "Liev Schreiber gained 40 pounds of muscle to match Hugh Jackman's imposing physical frame.",
      "Featured an early live-action cameo of Gambit played by Taylor Kitsch."
    ]
  ],
  [
    36,
    "X-Men: First Class",
    2011,
    "Movie",
    "X-Men",
    "04",
    "Recommended",
    false,
    "Set during the 1962 Cuban Missile Crisis, young Charles Xavier and Erik Lehnsherr form the first X-Men team before their ideological split.",
    "tt1270798",
    "James McAvoy as Charles Xavier, Michael Fassbender as Erik Lehnsherr / Magneto, Jennifer Lawrence as Raven / Mystique, Kevin Bacon as Sebastian Shaw, Nicholas Hoult as Hank McCoy / Beast",
    "Matthew Vaughn",
    [
      "Michael Fassbender and James McAvoy revitalized the prequel franchise with electric dramatic chemistry.",
      "Hugh Jackman delivered a memorable one-line cameo telling Charles and Erik to \"Go fuck yourself\" at a bar.",
      "Set against the authentic Cold War backdrop of the Cuban Missile Crisis."
    ]
  ],
  [
    37,
    "The Wolverine",
    2013,
    "Movie",
    "X-Men",
    "04",
    "Side Quest",
    false,
    "Grieving Jean Grey's death, Logan travels to modern-day Tokyo and is stripped of his healing factor by a dying WWII acquaintance.",
    "tt1430132",
    "Hugh Jackman as Logan / Wolverine, Tao Okamoto as Mariko Yashida, Rila Fukushima as Yukio, Hiroyuki Sanada as Shingen Yashida, Svetlana Khodchenkova as Viper",
    "James Mangold",
    [
      "James Mangold's gritty samurai-influenced direction laid the thematic groundwork for Logan (2017).",
      "The bullet train rooftop fight was choreographed at simulated speeds of 300 mph.",
      "The post-credits scene reunited Logan with Patrick Stewart and Ian McKellen, directly teasing Days of Future Past."
    ]
  ],
  [
    38,
    "X-Men: Days of Future Past",
    2014,
    "Movie",
    "X-Men",
    "04",
    "Recommended",
    false,
    "In a dark dystopian future, Wolverine's consciousness is projected back to 1973 to stop Mystique and prevent the Sentinel apocalypse.",
    "tt1877832",
    "Hugh Jackman, James McAvoy, Michael Fassbender, Jennifer Lawrence, Halle Berry, Nicholas Hoult, Anna Paquin, Elliot Page, Peter Dinklage as Bolivar Trask, Ian McKellen, Patrick Stewart",
    "Bryan Singer",
    [
      "United both the original 2000 cast and the First Class prequel cast in a single temporal storyline.",
      "Evan Peters' \"Time in a Bottle\" Quicksilver kitchen scene was filmed at 3,600 frames per second.",
      "Successfully reset the previous Fox X-Men continuity timeline."
    ]
  ],
  [
    39,
    "Deadpool",
    2016,
    "Movie",
    "X-Men / Fox",
    "04",
    "Recommended",
    false,
    "Former Special Forces operative Wade Wilson undergoes a rogue regenerative mutation and embarks on a fourth-wall-shattering revenge spree.",
    "tt1431045",
    "Ryan Reynolds as Wade Wilson / Deadpool, Morena Baccarin as Vanessa, Ed Skrein as Francis Freeman / Ajax, T.J. Miller as Weasel, Stefan Kapičić as Colossus, Brianna Hildebrand as Negasonic Teenage Warhead",
    "Tim Miller",
    [
      "Ryan Reynolds fought for over 10 years to get an R-rated, comic-accurate Deadpool movie made.",
      "Became the highest-grossing R-rated film in history at the time ($782 million) on a modest $58 million budget.",
      "Features endless self-referential jokes mocking Fox's X-Men timeline and Hugh Jackman."
    ]
  ],
  [
    40,
    "X-Men: Apocalypse",
    2016,
    "Movie",
    "X-Men",
    "04",
    "Side Quest",
    false,
    "The primordial god-mutant En Sabah Nur awakens in 1983 and recruits Four Horsemen to cleanse humanity, forcing young X-Men to assemble.",
    "tt3385516",
    "James McAvoy, Michael Fassbender, Jennifer Lawrence, Oscar Isaac as En Sabah Nur / Apocalypse, Nicholas Hoult, Rose Byrne, Tye Sheridan as Cyclops, Sophie Turner as Jean Grey, Olivia Munn as Psylocke",
    "Bryan Singer",
    [
      "Oscar Isaac wore a 40-pound suit and cooling mechanism under heavy prosthetic makeup to play Apocalypse.",
      "Featured Hugh Jackman's Wolverine in a brutal, comic-accurate \"Weapon X\" helmet cameo sequence.",
      "Evan Peters performed another iconic high-speed rescue sequence set to \"Sweet Dreams\" by Eurythmics."
    ]
  ],
  [
    41,
    "Logan",
    2017,
    "Movie",
    "X-Men",
    "04",
    "Recommended",
    false,
    "In a desolate 2029 future, an aging, ailing Wolverine cares for a deteriorating Charles Xavier while protecting young mutant clone Laura (X-23).",
    "tt3315342",
    "Hugh Jackman as Logan / Wolverine, Patrick Stewart as Charles Xavier, Richard E. Grant as Dr. Zander Rice, Boyd Holbrook as Pierce, Stephen Merchant as Caliban, Dafne Keen as Laura / X-23",
    "James Mangold",
    [
      "First live-action superhero film to be nominated for the Academy Award for Best Adapted Screenplay.",
      "Hugh Jackman agreed to take a pay cut so the studio would greenlight an uncompromised R-rated drama.",
      "Dafne Keen was cast at age 11, performing intense acrobatic fight choreography in Spanish and English."
    ]
  ],
  [
    42,
    "Deadpool 2",
    2018,
    "Movie",
    "X-Men / Fox",
    "04",
    "Recommended",
    false,
    "Wade Wilson forms the eclectic X-Force team to protect a mutant orphan from the time-traveling cybernetic soldier Cable.",
    "tt5463162",
    "Ryan Reynolds as Wade Wilson, Josh Brolin as Cable, Morena Baccarin as Vanessa, Julian Dennison as Russell Collins / Firefist, Zazie Beetz as Domino, T.J. Miller as Weasel, Terry Crews as Bedlam",
    "David Leitch",
    [
      "Josh Brolin portrayed Cable in the same summer he played Thanos in Avengers: Infinity War.",
      "Brad Pitt made a surprise half-second blink-and-you-miss-it cameo as the invisible mutant Vanisher for a cup of coffee.",
      "The time-travel mid-credits scene saw Deadpool murder his own character from X-Men Origins: Wolverine."
    ]
  ],
  [
    43,
    "Dark Phoenix",
    2019,
    "Movie",
    "X-Men",
    "04",
    "Side Quest",
    false,
    "Jean Grey absorbs an alien cosmic flare during a space mission, unleashing dark psychic entities in the final installment of Fox's main X-Men line.",
    "tt6565702",
    "James McAvoy, Michael Fassbender, Jennifer Lawrence, Nicholas Hoult, Sophie Turner as Jean Grey / Dark Phoenix, Tye Sheridan, Alexandra Shipp, Jessica Chastain as Vuk",
    "Simon Kinberg",
    [
      "Marked the conclusion of Fox's 19-year mainline X-Men franchise before Marvel Studios regained the rights.",
      "Hans Zimmer composed the cinematic score, coming out of superhero retirement."
    ]
  ],
  [
    44,
    "The New Mutants",
    2020,
    "Movie",
    "X-Men",
    "04",
    "Side Quest",
    false,
    "Five traumatized young mutants held inside an isolated psychiatric hospital discover their dark powers and must face the Demon Bear.",
    "tt4620274",
    "Maisie Williams as Rahne Sinclair / Wolfsbane, Anya Taylor-Joy as Illyana Rasputina / Magik, Charlie Heaton as Sam Guthrie / Cannonball, Alice Braga as Dr. Reyes, Blu Hunt as Dani Moonstar",
    "Josh Boone",
    [
      "Conceived as a psychological horror spin-off within the Fox X-Men universe.",
      "Anya Taylor-Joy wielded Magik's iconic Soulsword and manifested Lockheed the dragon."
    ]
  ],
  [
    45,
    "X-Men '97 — Season 1",
    2024,
    "Series",
    "Marvel / Animation",
    "04",
    "Side Quest",
    false,
    "The acclaimed animated revival continuing the legendary 1992 X-Men: The Animated Series with modern emotional storytelling.",
    "tt16026746",
    "Ray Chase as Cyclops, Jennifer Hale as Jean Grey, Cal Dodd as Wolverine, Lenore Zann as Rogue, George Buza as Beast, Matthew Waterson as Magneto",
    "Beau DeMayo (Creator)",
    [
      "Holds a rare 99% Rotten Tomatoes score, hailed as one of the best Marvel animated projects ever produced.",
      "Episode 5 (\"Remember It\") featuring the Genosha Sentinel massacre became an instant critical sensation."
    ]
  ],
  [
    46,
    "X-Men '97 — Season 2",
    2026,
    "Series",
    "Marvel / Animation",
    "04",
    "Side Quest",
    false,
    "The mutant heroes navigate disparate temporal eras following the climactic cliffhanger of Season 1.",
    "",
    "Ray Chase, Jennifer Hale, Cal Dodd, Lenore Zann, Matthew Waterson",
    "Marvel Studios Animation",
    [
      "Explores the team split between ancient Egypt with En Sabah Nur and the far dystopian future with Clan Askani."
    ]
  ],
  [
    47,
    "Legion — Season 1",
    2017,
    "Series",
    "Fox / X-Men",
    "04",
    "Completionist",
    false,
    "David Haller, the schizophrenic son of Charles Xavier, realizes the voices and hallucinations in his mind are godlike mutant powers.",
    "tt5114356",
    "Dan Stevens as David Haller, Rachel Keller as Syd Barrett, Aubrey Plaza as Lenny Busker / Shadow King, Bill Irwin as Cary Loudermilk, Jeremie Harris as Ptonomy",
    "Noah Hawley (Creator)",
    [
      "Created by Noah Hawley (Fargo), renowned for its surrealist visual style and psychological depth.",
      "Aubrey Plaza gave a career-defining performance as the shape-shifting psychic parasite Amahl Farouk (Shadow King)."
    ]
  ],
  [
    48,
    "Legion — Season 2",
    2018,
    "Series",
    "Fox / X-Men",
    "04",
    "Completionist",
    false,
    "David teams with Division 3 to search for the Shadow King's physical body while questioning his own moral sanity.",
    "",
    "Dan Stevens, Rachel Keller, Aubrey Plaza, Bill Irwin, Navid Negahban as Amahl Farouk",
    "Noah Hawley",
    [
      "Featured Jon Hamm providing philosophical voiceover narration about delusions and collective psychology."
    ]
  ],
  [
    49,
    "Legion — Season 3",
    2019,
    "Series",
    "Fox / X-Men",
    "04",
    "Completionist",
    false,
    "David builds a utopian time-travel cult to alter his past, bringing young Charles Xavier into confrontation with the Shadow King.",
    "",
    "Dan Stevens, Rachel Keller, Aubrey Plaza, Harry Lloyd as Charles Xavier, Lauren Tsai as Switch",
    "Noah Hawley",
    [
      "Introduced Harry Lloyd as a comic-accurate young Charles Xavier building the first Cerebro machine."
    ]
  ],
  [
    50,
    "The Gifted — Season 1",
    2017,
    "Series",
    "Fox / X-Men",
    "04",
    "Completionist",
    false,
    "Suburban parents go on the run from Sentinel Services after discovering their teenage children possess mutant abilities.",
    "tt4372826",
    "Stephen Moyer as Reed Strucker, Amy Acker as Caitlin Strucker, Sean Teale as Eclipse, Natalie Alyn Lind as Lauren, Percy Hynes White as Andy, Emma Dumont as Polaris",
    "Matt Nix (Creator)",
    [
      "Emma Dumont portrayed Polaris (Lorna Dane), the green-haired daughter of Magneto manipulating magnetic fields.",
      "The pilot episode was directed by original X-Men filmmaker Bryan Singer."
    ]
  ],
  [
    51,
    "The Gifted — Season 2",
    2019,
    "Series",
    "Fox / X-Men",
    "04",
    "Completionist",
    false,
    "The Mutant Underground fractures over ideological extremism as the Frost Sisters and Inner Circle build an empire.",
    "",
    "Stephen Moyer, Amy Acker, Sean Teale, Natalie Alyn Lind, Percy Hynes White, Emma Dumont, Skyler Samuels as Frost Sisters",
    "Matt Nix",
    [
      "Skyler Samuels played all three telepathic Frost Sisters (Esme, Sophie, and Phoebe) through split-screen acting."
    ]
  ],
  [
    52,
    "Spider-Man",
    2002,
    "Movie",
    "Sony / Spider-Man",
    "05",
    "Recommended",
    false,
    "After being bitten by a genetically altered spider, mild-mannered Peter Parker battles Norman Osborn (Green Goblin) in NYC.",
    "tt0145487",
    "Tobey Maguire as Peter Parker / Spider-Man, Willem Dafoe as Norman Osborn / Green Goblin, Kirsten Dunst as Mary Jane Watson, James Franco as Harry Osborn, Cliff Robertson as Uncle Ben, J.K. Simmons as J. Jonah Jameson",
    "Sam Raimi",
    [
      "First film in box office history to cross $100 million in a single opening weekend.",
      "Willem Dafoe performed 90% of his own stunt work inside the green metallic Goblin armor.",
      "The upside-down rain kiss won Best Kiss at the MTV Movie Awards and became iconic in pop culture."
    ]
  ],
  [
    53,
    "Spider-Man 2",
    2004,
    "Movie",
    "Sony / Spider-Man",
    "05",
    "Recommended",
    false,
    "Peter Parker suffers a crisis of confidence and loses his powers while facing the multi-tentacled tragedy of Doctor Otto Octavius.",
    "tt0316654",
    "Tobey Maguire, Kirsten Dunst, James Franco, Alfred Molina as Dr. Otto Octavius / Doc Ock, Rosemary Harris as Aunt May, J.K. Simmons as J. Jonah Jameson",
    "Sam Raimi",
    [
      "Frequently cited by critics and filmmakers as one of the greatest superhero movies ever made; won the Oscar for Visual Effects.",
      "Doc Ock's mechanical tentacles were operated on set by 16 puppeteers using practical hydraulic animatronics.",
      "The runaway subway train sequence remains a benchmark in cinematic action choreography."
    ]
  ],
  [
    54,
    "Spider-Man 3",
    2007,
    "Movie",
    "Sony / Spider-Man",
    "05",
    "Recommended",
    false,
    "Peter Parker is corrupted by a parasitic alien symbiote while facing Sandman, the New Goblin, and Eddie Brock's monstrous Venom.",
    "tt0413300",
    "Tobey Maguire, Kirsten Dunst, James Franco, Thomas Haden Church as Flint Marko / Sandman, Topher Grace as Eddie Brock / Venom, Bryce Dallas Howard as Gwen Stacy",
    "Sam Raimi",
    [
      "Thomas Haden Church trained for two years to build physical mass for the tragic character of Sandman.",
      "At the time of release, its $258 million budget made it the most expensive film ever produced.",
      "Concluded Sam Raimi's landmark Spider-Man trilogy."
    ]
  ],
  [
    55,
    "The Amazing Spider-Man",
    2012,
    "Movie",
    "Sony / Spider-Man",
    "05",
    "Recommended",
    false,
    "Peter Parker investigates his parents' disappearance, leading to Oscorp scientist Dr. Curt Connors and the reptilian Lizard.",
    "tt2586634",
    "Andrew Garfield as Peter Parker / Spider-Man, Emma Stone as Gwen Stacy, Rhys Ifans as Dr. Curt Connors / The Lizard, Denis Leary as Captain Stacy, Martin Sheen as Uncle Ben, Sally Field as Aunt May",
    "Marc Webb",
    [
      "Andrew Garfield cried upon putting on the Spider-Man suit for the first time, having idolized the character since childhood.",
      "The real-life romantic chemistry between Andrew Garfield and Emma Stone received widespread critical praise.",
      "Featured practical stunt web-slinging rigs built across Manhattan streets."
    ]
  ],
  [
    56,
    "The Amazing Spider-Man 2",
    2014,
    "Movie",
    "Sony / Spider-Man",
    "05",
    "Recommended",
    false,
    "Peter Parker uncovers deep Oscorp secrets while battling the electrical fury of Max Dillon (Electro) and Harry Osborn (Green Goblin).",
    "tt1872181",
    "Andrew Garfield, Emma Stone, Jamie Foxx as Max Dillon / Electro, Dane DeHaan as Harry Osborn / Green Goblin, Colm Feore, Paul Giamatti as Rhino, Sally Field as Aunt May",
    "Marc Webb",
    [
      "Adapted the tragic, legendary comic book storyline \"The Night Gwen Stacy Died\" from 1973.",
      "Hans Zimmer formed a supergroup \"The Magnificent Six\" (including Pharrell Williams) to compose the score.",
      "Set the stage for Andrew Garfield's emotional redemption arc in Spider-Man: No Way Home."
    ]
  ],
  [
    57,
    "Venom",
    2018,
    "Movie",
    "Sony / Venom",
    "05",
    "Side Quest",
    false,
    "Investigative journalist Eddie Brock bonds with an alien symbiote in San Francisco, becoming a lethal protector.",
    "tt1270797",
    "Tom Hardy as Eddie Brock / Venom, Michelle Williams as Anne Weying, Riz Ahmed as Carlton Drake / Riot, Scott Haze, Reid Scott",
    "Ruben Fleischer",
    [
      "Tom Hardy wore an earbud playing his own pre-recorded Venom voice lines to react to the symbiote in real time.",
      "Grossed over $856 million worldwide, kicking off Sony's Spider-Man Universe (SSU).",
      "The restaurant lobster tank scene was entirely unscripted and improvised by Tom Hardy on set."
    ]
  ],
  [
    58,
    "Venom: Let There Be Carnage",
    2021,
    "Movie",
    "Sony / Venom",
    "05",
    "Recommended",
    false,
    "Eddie Brock and Venom clash with deranged serial killer Cletus Kasady, who spawns the bloodthirsty symbiote Carnage.",
    "tt7097896",
    "Tom Hardy, Woody Harrelson as Cletus Kasady / Carnage, Michelle Williams, Naomie Harris as Frances Barrison / Shriek, Reid Scott, Stephen Graham",
    "Andy Serkis",
    [
      "Directed by motion-capture master Andy Serkis (Gollum, Caesar).",
      "The mid-credits scene transported Eddie and Venom directly into the MCU during Tom Holland's Far From Home news broadcast."
    ]
  ],
  [
    59,
    "Venom: The Last Dance",
    2024,
    "Movie",
    "Sony / Venom",
    "05",
    "Side Quest",
    false,
    "Eddie and Venom find themselves hunted by military forces and monstrous Xenophages sent by Knull, the Creator of Symbiotes.",
    "tt16366836",
    "Tom Hardy as Eddie Brock / Venom, Chiwetel Ejiofor as Rex Strickland, Juno Temple as Dr. Payne, Rhys Ifans as Martin Moon, Peggy Lu as Mrs. Chen",
    "Kelly Marcel",
    [
      "Concluded Tom Hardy's Venom trilogy while introducing Knull the God of the Symbiotes.",
      "Features a musical dance sequence between Venom and Mrs. Chen in Las Vegas."
    ]
  ],
  [
    60,
    "Spider-Man: Into the Spider-Verse",
    2018,
    "Movie",
    "Sony / Spider-Verse",
    "05",
    "Recommended",
    false,
    "Teenager Miles Morales becomes Spider-Man and unites with alternate-dimension spider-heroes to stop Kingpin's multiverse collider.",
    "tt4633694",
    "Shameik Moore as Miles Morales, Jake Johnson as Peter B. Parker, Hailee Steinfeld as Gwen Stacy, Mahershala Ali as Uncle Aaron, Brian Tyree Henry as Jefferson Davis, Nicolas Cage as Spider-Man Noir, Liev Schreiber as Kingpin",
    "Bob Persichetti, Peter Ramsey, Rodney Rothman",
    [
      "Won the Academy Award for Best Animated Feature, breaking Disney's multi-year streak.",
      "Pioneered a revolutionary hybrid 2D/3D comic book art style, animating on \"twos\" to emulate print pages.",
      "Introduced Miles Morales to mainstream worldwide pop culture audiences."
    ]
  ],
  [
    61,
    "Spider-Man: Across the Spider-Verse",
    2023,
    "Movie",
    "Sony / Spider-Verse",
    "05",
    "Recommended",
    false,
    "Miles Morales catapults across the Multiverse and clashes with Miguel O'Hara and the Spider-Society over the morality of \"canon events.\"",
    "tt9362722",
    "Shameik Moore, Hailee Steinfeld, Oscar Isaac as Miguel O'Hara / Spider-Man 2099, Jason Schwartzman as The Spot, Daniel Kaluuya as Hobie Brown / Spider-Punk, Karan Soni as Pavitr Prabhakar",
    "Joaquim Dos Santos, Kemp Powers, Justin K. Thompson",
    [
      "Employed over 1,000 animators using six distinct visual animation styles for each parallel universe.",
      "Daniel Kaluuya's Spider-Punk was animated at different frame rates for different parts of his body to match punk-rock collage art.",
      "Received widespread acclaim as one of the greatest animated sequels in cinema history."
    ]
  ],
  [
    62,
    "Morbius",
    2022,
    "Movie",
    "Sony Spider-Man Universe",
    "05",
    "Completionist",
    false,
    "Biochemist Michael Morbius infects himself with vampire bat DNA to cure a rare blood disease, turning into a living vampire.",
    "tt5108870",
    "Jared Leto as Dr. Michael Morbius, Matt Smith as Milo / Lucien, Adria Arjona as Martine Bancroft, Jared Harris, Tyrese Gibson",
    "Daniel Espinosa",
    [
      "Matt Smith's exuberant dancing scene became a viral pop culture meme worldwide.",
      "The post-credits scene featured Michael Keaton's Vulture transported from the MCU via the No Way Home multiverse rift."
    ]
  ],
  [
    63,
    "Madame Web",
    2024,
    "Movie",
    "Sony Spider-Man Universe",
    "05",
    "Completionist",
    false,
    "Manhattan paramedic Cassie Webb develops clairvoyant powers to protect three future Spider-Women from an enigmatic hunter.",
    "tt11057302",
    "Dakota Johnson as Cassandra Webb, Sydney Sweeney as Julia Cornwall, Celeste O'Connor as Mattie Franklin, Isabela Merced as Anya Corazon, Tahar Rahim as Ezekiel Sims",
    "S.J. Clarkson",
    [
      "Featured four different Spider-heroines working together in a clairvoyant thriller structure.",
      "Directed by S.J. Clarkson, who previously helmed episodes of Marvel's Jessica Jones and The Defenders."
    ]
  ],
  [
    64,
    "Kraven the Hunter",
    2024,
    "Movie",
    "Sony Spider-Man Universe",
    "05",
    "Completionist",
    false,
    "Russian immigrant Sergei Kravinoff turns his lethal hunting skills against poachers and organized crime syndicates.",
    "tt8746266",
    "Aaron Taylor-Johnson as Sergei Kravinoff / Kraven, Russell Crowe as Nikolai Kravinoff, Ariana DeBose as Calypso, Fred Hechinger as Chameleon, Alessandro Nivola as Rhino",
    "J.C. Chandor",
    [
      "Aaron Taylor-Johnson's second major Marvel role after playing Quicksilver in Avengers: Age of Ultron.",
      "First R-rated release under Sony's Spider-Man Universe."
    ]
  ],
  [
    65,
    "Blade",
    1998,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "The half-human, half-vampire Daywalker wages a violent martial arts war against vampire overlord Deacon Frost.",
    "tt0120611",
    "Wesley Snipes as Eric Brooks / Blade, Stephen Dorff as Deacon Frost, Kris Kristofferson as Abraham Whistler, N'Bushe Wright, Donal Logue",
    "Stephen Norrington",
    [
      "The vampire rave blood-shower opening scene set a new stylistic high bar for comic book cinema in 1998.",
      "Wesley Snipes was a martial arts 5th-degree black belt and designed the fight choreography.",
      "Widely credited by Kevin Feige as the film that proved Marvel comic properties could succeed as serious films."
    ]
  ],
  [
    66,
    "Blade II",
    2002,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "Blade forms an alliance with the elite vampire Bloodpack to exterminate a mutated reaper strain threatening both humans and vampires.",
    "tt0187738",
    "Wesley Snipes, Kris Kristofferson, Ron Perlman as Reinhardt, Leonor Varela, Norman Reedus as Scud, Thomas Kretschmann, Luke Goss as Nomak",
    "Guillermo del Toro",
    [
      "Directed by visionary horror filmmaker Guillermo del Toro with practical creature designs.",
      "Featured a young Norman Reedus (The Walking Dead) as Blade's weaponsmith Scud."
    ]
  ],
  [
    67,
    "Blade: Trinity",
    2004,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "Blade teams with the Nightstalkers vigilante squad to hunt the resurrected progenitor of all vampires, Drake (Dracula).",
    "tt0359013",
    "Wesley Snipes, Jessica Biel as Abigail Whistler, Ryan Reynolds as Hannibal King, Dominic Purcell as Drake, Parker Posey",
    "David S. Goyer",
    [
      "Ryan Reynolds' hilarious performance as Hannibal King directly convinced Marvel execs he was born to play Deadpool.",
      "Triple H (Paul Levesque) made his feature film acting debut as the vampire enforcer Jarko Grimwood."
    ]
  ],
  [
    68,
    "Blade: The Series — Season 1",
    2006,
    "Series",
    "Legacy",
    "06",
    "Completionist",
    false,
    "Blade continues his crusade against vampire houses in Detroit alongside an undercover combat veteran.",
    "tt0823333",
    "Sticky Fingaz as Blade, Jill Wagner as Krista Starr, Neil Jackson as Marcus van Sciver, Jessica Gower as Chase",
    "David S. Goyer (Creator)",
    [
      "Rapper and actor Sticky Fingaz (Kirk Jones) stepped into the trenchcoat following Wesley Snipes.",
      "Aired on Spike TV as the first live-action TV series based on a Marvel film property."
    ]
  ],
  [
    69,
    "Daredevil",
    2003,
    "Movie",
    "Fox / Marvel",
    "06",
    "Completionist",
    false,
    "Blind attorney Matt Murdock uses his radar senses to fight crime as Daredevil in Hell's Kitchen, clashing with Bullseye and Kingpin.",
    "tt0280590",
    "Ben Affleck as Matt Murdock / Daredevil, Jennifer Garner as Elektra Natchios, Colin Farrell as Bullseye, Michael Clarke Duncan as Wilson Fisk / Kingpin, Jon Favreau as Foggy Nelson",
    "Mark Steven Johnson",
    [
      "Jon Favreau played Foggy Nelson 5 years before directing Iron Man and kickstarting the MCU.",
      "Colin Farrell played Bullseye with over-the-top theatrical glee, never using his gun.",
      "The R-rated Director's Cut restored 30 minutes of subplots and is widely praised."
    ]
  ],
  [
    70,
    "Elektra",
    2005,
    "Movie",
    "Fox / Marvel",
    "06",
    "Completionist",
    false,
    "Resurrected martial artist Elektra Natchios defies the assassin Hand syndicate to protect a prodigy and her father.",
    "tt0357277",
    "Jennifer Garner as Elektra Natchios, Goran Visnjic as Mark Miller, Kirsten Prout as Abby, Will Yun Lee as Kirigi, Terence Stamp as Stick",
    "Rob Bowman",
    [
      "Jennifer Garner returned as Elektra 19 years later in Deadpool & Wolverine (2024).",
      "Terence Stamp (General Zod in Superman II) played the blind martial arts master Stick."
    ]
  ],
  [
    71,
    "The Punisher",
    2004,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "After his entire extended family is slaughtered by a crime boss, undercover FBI agent Frank Castle exacts calculated tactical vengeance.",
    "tt0330793",
    "Thomas Jane as Frank Castle / The Punisher, John Travolta as Howard Saint, Will Patton, Rebecca Romijn as Joan, Ben Foster as Spacker Dave, Kevin Nash as The Russian",
    "Jonathan Hensleigh",
    [
      "WWE wrestler Kevin Nash was accidentally stabbed for real during the brutal apartment fight scene with Thomas Jane.",
      "Thomas Jane performed 90% of his own stunt driving and weapon handling maneuvers."
    ]
  ],
  [
    72,
    "Punisher: War Zone",
    2008,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "An ultra-violent, hyper-stylized Frank Castle wages a one-man war on disfigured mob boss Billy Russoti (Jigsaw).",
    "tt0450811",
    "Ray Stevenson as Frank Castle / The Punisher, Dominic West as Billy Russoti / Jigsaw, Doug Hutchison as Loony Bin Jim, Colin Salmon, Wayne Knight as Micro",
    "Lexi Alexander",
    [
      "First female director to helm a Marvel feature film (Lexi Alexander, a former karate world champion).",
      "Ray Stevenson later joined the MCU as Volstagg in Thor, and voiced the Punisher in animation."
    ]
  ],
  [
    73,
    "Ghost Rider",
    2007,
    "Movie",
    "Legacy",
    "06",
    "Side Quest",
    false,
    "Stunt motorcycle legend Johnny Blaze sells his soul to Mephistopheles and becomes the flaming Spirit of Vengeance.",
    "tt0259153",
    "Nicolas Cage as Johnny Blaze / Ghost Rider, Eva Mendes as Roxanne Simpson, Wes Bentley as Blackheart, Sam Elliott as Caretaker / Carter Slade, Peter Fonda as Mephistopheles",
    "Mark Steven Johnson",
    [
      "Nicolas Cage had a real Ghost Rider tattoo covered up with makeup so he could play Johnny Blaze.",
      "Western screen legend Sam Elliott portrayed the original phantom horseback Ghost Rider."
    ]
  ],
  [
    74,
    "Ghost Rider: Spirit of Vengeance",
    2011,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "Johnny Blaze hides in Eastern Europe before battling the Devil to save a boy targeted for demonic possession.",
    "tt1071875",
    "Nicolas Cage as Johnny Blaze, Ciaran Hinds as Roarke / The Devil, Violante Placido, Idris Elba as Moreau, Johnny Whitworth as Blackout",
    "Mark Neveldine, Brian Taylor",
    [
      "Directed by the adrenaline-fueled Crank directing duo Neveldine/Taylor on rollerblades with handheld cameras.",
      "Idris Elba starred as the monk Moreau before joining the MCU as Heimdall."
    ]
  ],
  [
    75,
    "Hulk",
    2003,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "Ang Lee's psychological exploration of Bruce Banner's repressed trauma, genetic engineering, and gamma-fueled rage.",
    "tt0286716",
    "Eric Bana as Bruce Banner / Hulk, Jennifer Connelly as Betty Ross, Sam Elliott as General Ross, Nick Nolte as David Banner, Josh Lucas as Talbot",
    "Ang Lee",
    [
      "Pioneered split-screen visual storytelling designed to emulate multi-panel comic book layouts.",
      "Ang Lee personally performed the motion capture movements for the Hulk on set."
    ]
  ],
  [
    76,
    "Man-Thing",
    2005,
    "Movie",
    "Legacy",
    "06",
    "Completionist",
    false,
    "A small-town sheriff investigates gruesome deaths in Dark Waters swamp, encountering the vegetative monster creature.",
    "tt0290145",
    "Matthew Le Nevez as Sheriff Kyle Williams, Rachel Taylor as Teri, Jack Thompson, Rawiri Paratene",
    "Brett Leonard",
    [
      "Filmed in Australia as a swamp creature horror flick under Marvel's early Lionsgate partnership.",
      "Man-Thing later made his official MCU debut in Werewolf by Night (2022)."
    ]
  ],
  [
    77,
    "Mutant X — Seasons 1–3",
    2001,
    "Series",
    "Legacy",
    "06",
    "Completionist",
    false,
    "A clandestine team of genetically engineered \"New Mutants\" fight to protect their kind from the geneticist who created them.",
    "tt0288814",
    "Forbes March as Jesse Kilmartin, Victoria Pratt as Shalimar Fox, Victor Webster as Brennan Mulwray, John Shea as Adam Kane",
    "Avi Arad (Creator)",
    [
      "Created by Avi Arad and ran for 66 syndicated episodes in the early 2000s.",
      "Subject to a high-profile copyright lawsuit between Fox and Marvel over X-Men TV rights."
    ]
  ],
  [
    78,
    "X-Men: Evolution — Seasons 1–4",
    2000,
    "Series",
    "Legacy / Animation",
    "06",
    "Completionist",
    false,
    "The classic animated reimagining of the X-Men as high school teenagers balancing classes and mutant battles in Bayville.",
    "tt0250162",
    "Kirby Morrow as Cyclops, Venus Terzo as Jean Grey, Scott McNeil as Wolverine, David Kaye as Professor X, Meghan Black as Rogue",
    "Boyd Kirkland (Showrunner)",
    [
      "Created the character of X-23 (Laura Kinney), who became so popular she was introduced into Marvel comics and Logan.",
      "Ran for 52 acclaimed episodes on Kids' WB in the 2000s."
    ]
  ],
  [
    79,
    "Marvel Anime: X-Men — Season 1",
    2011,
    "Series",
    "Legacy / Animation",
    "06",
    "Completionist",
    false,
    "The X-Men travel to Japan to investigate the mysterious disappearance of young mutants and the U-Men syndicate.",
    "tt1740922",
    "Toshiyuki Morikawa / Cam Clarke as Cyclops, Aya Hisakawa / Jennifer Hale as Jean Grey, Rikiya Koyama / Steve Blum as Wolverine",
    "Fuminori Kizaki (Director)",
    [
      "Produced in Japan by legendary animation studio Madhouse (Death Note, One-Punch Man).",
      "Steve Blum reprised his definitive voice acting role as Wolverine in the English dub."
    ]
  ],
  [
    80,
    "Agent Carter — Season 1",
    2015,
    "Series",
    "Marvel Television",
    "07",
    "Recommended",
    false,
    "Peggy Carter works as a secret agent in 1946 New York while clearing Howard Stark's name from treason accusations.",
    "tt3460014",
    "Hayley Atwell as Peggy Carter, James D'Arcy as Edwin Jarvis, Chad Michael Murray as Jack Thompson, Enver Gjokaj as Daniel Sousa, Shea Whigham as Roger Dooley",
    "Christopher Markus, Stephen McFeely",
    [
      "James D'Arcy's human Edwin Jarvis became the first Marvel TV actor to crossover into a Marvel Studios movie (Avengers: Endgame).",
      "Hayley Atwell brought depth, humor, and 1940s spy espionage to the founding era of S.H.I.E.L.D."
    ]
  ],
  [
    81,
    "Agent Carter — Season 2",
    2016,
    "Series",
    "Marvel Television",
    "07",
    "Recommended",
    false,
    "Peggy relocates to sun-drenched 1947 Los Angeles to investigate atomic anomalies, Zero Matter, and Whitney Frost.",
    "",
    "Hayley Atwell, James D'Arcy, Enver Gjokaj, Wynn Everett as Whitney Frost, Reggie Austin, Dominic Cooper as Howard Stark",
    "Tara Butters, Michele Fazekas",
    [
      "Explored Zero Matter / Darkforce, which linked the 1940s lore to Doctor Strange and Cloak & Dagger."
    ]
  ],
  [
    82,
    "Agents of S.H.I.E.L.D. — Season 1",
    2013,
    "Series",
    "Marvel Television",
    "07",
    "Recommended",
    false,
    "Resurrected Agent Phil Coulson leads a mobile specialized team, shaken by the catastrophic Hydra uprising within S.H.I.E.L.D.",
    "tt2364582",
    "Clark Gregg as Phil Coulson, Ming-Na Wen as Melinda May, Brett Dalton as Grant Ward, Chloe Bennet as Skye / Daisy, Iain De Caestecker as Fitz, Elizabeth Henstridge as Simmons",
    "Joss Whedon, Jed Whedon, Maurissa Tancharoen",
    [
      "The mid-season Hydra reveal in Captain America: The Winter Soldier completely revolutionized the show's trajectory.",
      "Samuel L. Jackson, Cobie Smulders, and Jaimie Alexander made guest crossover appearances."
    ]
  ],
  [
    83,
    "Agents of S.H.I.E.L.D. — Season 2",
    2014,
    "Series",
    "Marvel Television",
    "07",
    "Recommended",
    false,
    "Coulson rebuilds a covert S.H.I.E.L.D. as Daisy Johnson discovers her Inhuman heritage and Terrigenesis.",
    "",
    "Clark Gregg, Ming-Na Wen, Chloe Bennet, Iain De Caestecker, Elizabeth Henstridge, Nick Blood as Lance Hunter, Adrianne Palicki as Bobbi Morse",
    "Jed Whedon, Maurissa Tancharoen",
    [
      "Introduced Inhumans into live-action Marvel canon years before other MCU properties."
    ]
  ],
  [
    84,
    "Agents of S.H.I.E.L.D. — Season 3",
    2015,
    "Series",
    "Marvel Television",
    "07",
    "Recommended",
    false,
    "The Secret Warriors team faces off against the primordial parasitic Inhuman god Hive.",
    "",
    "Clark Gregg, Ming-Na Wen, Chloe Bennet, Iain De Caestecker, Elizabeth Henstridge, Brett Dalton as Hive, Henry Simmons as Mack, Luke Mitchell as Lincoln",
    "Jed Whedon, Maurissa Tancharoen",
    [
      "Daisy Johnson fully stepped into her comic identity as Quake, commanding shockwave seismic powers."
    ]
  ],
  [
    85,
    "Daredevil — Season 1",
    2015,
    "Series",
    "Marvel / Netflix",
    "07",
    "Recommended",
    false,
    "Blind lawyer Matt Murdock fights crime by night as Daredevil, engaging in a bloody turf war against kingpin Wilson Fisk.",
    "tt3322312",
    "Charlie Cox as Matt Murdock / Daredevil, Deborah Ann Woll as Karen Page, Elden Henson as Foggy Nelson, Toby Leonard Moore, Vondie Curtis-Hall, Bob Gunton, Ayelet Zurer, Rosario Dawson as Claire Temple, Vincent D'Onofrio as Wilson Fisk",
    "Drew Goddard (Creator), Steven S. DeKnight",
    [
      "The Episode 2 single-take hallway fight sequence set a new benchmark for TV martial arts choreography.",
      "Vincent D'Onofrio's complex, terrifying portrayal of Wilson Fisk received universal critical acclaim.",
      "Officially re-integrated into Marvel Studios MCU canon with Daredevil: Born Again."
    ]
  ],
  [
    86,
    "Jessica Jones — Season 1",
    2015,
    "Series",
    "Marvel / Netflix",
    "07",
    "Recommended",
    false,
    "Private investigator Jessica Jones is forced to confront her psychological abuser, the mind-controlling Kilgrave.",
    "tt2357547",
    "Krysten Ritter as Jessica Jones, Mike Colter as Luke Cage, Rachael Taylor as Trish Walker, Wil Traval, Eka Darville as Malcolm, Carrie-Anne Moss as Jeri Hogarth, David Tennant as Kilgrave",
    "Melissa Rosenberg (Creator)",
    [
      "David Tennant's chilling performance as Kilgrave (Purple Man) won a Peabody Award for psychological drama.",
      "Introduced Mike Colter as the unbreakable Luke Cage before his own spin-off series."
    ]
  ],
  [
    87,
    "Agents of S.H.I.E.L.D. — Season 4",
    2016,
    "Series",
    "Marvel Television",
    "07",
    "Recommended",
    false,
    "Features Robbie Reyes' flaming Ghost Rider, Life Model Decoys (LMDs), and the dystopian virtual reality Framework.",
    "",
    "Clark Gregg, Ming-Na Wen, Chloe Bennet, Iain De Caestecker, Elizabeth Henstridge, Henry Simmons, John Hannah as Radcliffe, Gabriel Luna as Robbie Reyes / Ghost Rider, Mallory Jansen as Aida",
    "Jed Whedon, Maurissa Tancharoen",
    [
      "Gabriel Luna starred as the muscle-car-driving Ghost Rider Robbie Reyes with stunning practical/VFX flame effects.",
      "The \"Framework\" pod is widely considered one of the greatest story arcs in Marvel Television history."
    ]
  ],
  [
    88,
    "Daredevil — Season 2",
    2016,
    "Series",
    "Marvel / Netflix",
    "07",
    "Recommended",
    false,
    "Daredevil clashes over morality with vigilante Frank Castle (The Punisher) while Elektra pulls him into war with The Hand.",
    "",
    "Charlie Cox, Deborah Ann Woll, Elden Henson, Jon Bernthal as Frank Castle / Punisher, Elodie Yung as Elektra Natchios, Rosario Dawson, Stephen Rider, Vincent D'Onofrio",
    "Doug Petrie, Marco Ramirez",
    [
      "Jon Bernthal's raw, visceral debut as Frank Castle led directly to Netflix greenlighting The Punisher solo series.",
      "The rooftop debate between Daredevil and Punisher on vigilante justice is an acclaimed philosophical high point."
    ]
  ],
  [
    89,
    "Luke Cage — Season 1",
    2016,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "A bulletproof fugitive works to clear his name and protect Harlem from corrupt politician Mariah Dillard and mob boss Cottonmouth.",
    "tt3322314",
    "Mike Colter as Luke Cage, Mahershala Ali as Cornell \"Cottonmouth\" Stokes, Simone Missick as Misty Knight, Theo Rossi as Shades, Erik LaRay Harvey as Diamondback, Rosario Dawson, Alfre Woodard as Mariah Dillard",
    "Cheo Hodari Coker (Creator)",
    [
      "Featured live musical performances at \"Harlem's Paradise\" from legendary hip-hop and neo-soul artists every episode.",
      "Mahershala Ali delivered an electrifying performance as Cottonmouth before winning his first Oscar."
    ]
  ],
  [
    90,
    "Iron Fist — Season 1",
    2017,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "Danny Rand returns to New York City after 15 years in mystical K'un-Lun, wielding the glowing martial power of the Iron Fist.",
    "tt3322310",
    "Finn Jones as Danny Rand / Iron Fist, Jessica Henwick as Colleen Wing, Tom Pelphrey as Ward Meachum, Jessica Stroup as Joy Meachum, Ramon Rodriguez as Bakuto, Sacha Dhawan as Davos, Rosario Dawson, David Wenham",
    "Scott Buck (Creator)",
    [
      "Jessica Henwick's breakout performance as katana-wielding dojo owner Colleen Wing earned high praise.",
      "Tom Pelphrey delivered an intense, layered dramatic performance as the conflicted Ward Meachum."
    ]
  ],
  [
    91,
    "The Defenders — Season 1",
    2017,
    "Series",
    "Marvel / Netflix",
    "07",
    "Recommended",
    false,
    "Daredevil, Jessica Jones, Luke Cage, and Iron Fist unite their street-level skills to stop Alexandra and the ancient Hand from destroying NYC.",
    "tt4230076",
    "Charlie Cox, Krysten Ritter, Mike Colter, Finn Jones, Sigourney Weaver as Alexandra Reid, Elodie Yung as Elektra, Jessica Henwick, Simone Missick, Rosario Dawson",
    "Douglas Petrie, Marco Ramirez",
    [
      "Sci-fi icon Sigourney Weaver starred as the centuries-old leader of the five fingers of The Hand.",
      "Brought the four interconnected Netflix superhero series together in an 8-episode mini-series event."
    ]
  ],
  [
    92,
    "The Punisher — Season 1",
    2017,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "Frank Castle uncovers a covert military conspiracy that goes far beyond the street gang murders of his family.",
    "tt5675620",
    "Jon Bernthal as Frank Castle, Ebon Moss-Bachrach as Micro / David Lieberman, Ben Barnes as Billy Russo, Amber Rose Revah as Dinah Madani, Daniel Webber, Paul Schulze, Jason R. Moore",
    "Steve Lightfoot (Creator)",
    [
      "Ebon Moss-Bachrach played Micro years before being cast as Ben Grimm / The Thing in The Fantastic Four: First Steps (2025).",
      "Explored profound themes of veteran PTSD, military ethics, and grief through intense physical action."
    ]
  ],
  [
    93,
    "Jessica Jones — Season 2",
    2018,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "Jessica investigates IGH, the shady medical biotech company that gave her super-strength, uncovering shock family ties.",
    "",
    "Krysten Ritter, Rachael Taylor, Eka Darville, J.R. Ramirez, Terry Chen, Leah Gibson, Carrie-Anne Moss, Janet McTeer as Alisa Jones",
    "Melissa Rosenberg",
    [
      "Every episode in Season 2 was directed exclusively by female directors."
    ]
  ],
  [
    94,
    "Luke Cage — Season 2",
    2018,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "Luke Cage battles Jamaican gangster Bushmaster for the soul of Harlem, ending with Luke taking over Harlem's Paradise as a mob boss.",
    "",
    "Mike Colter, Simone Missick, Theo Rossi, Mustafa Shakir as John McIver / Bushmaster, Gabrielle Dennis as Nightshade, Alfre Woodard",
    "Cheo Hodari Coker",
    [
      "Mustafa Shakir brought charismatic Capoeira fighting and Jamaican folk medicine to the formidable Bushmaster."
    ]
  ],
  [
    95,
    "Cloak & Dagger — Season 1",
    2018,
    "Series",
    "Marvel Television",
    "07",
    "Completionist",
    false,
    "Two New Orleans teenagers from vastly different backgrounds discover their interconnected light and darkness superpowers.",
    "tt5617622",
    "Olivia Holt as Tandy Bowen / Dagger, Aubrey Joseph as Tyrone Johnson / Cloak, Gloria Reuben, Andrea Roth, J.D. Evermore, Miles Mussenden",
    "Joe Pokaski (Creator)",
    [
      "Tackled heavy social themes of racial profiling, trauma, addiction, and divine connection in New Orleans."
    ]
  ],
  [
    96,
    "Agents of S.H.I.E.L.D. — Season 5",
    2017,
    "Series",
    "Marvel Television",
    "07",
    "Recommended",
    false,
    "The team is abducted to a dystopian future space station where Earth has been shattered into floating asteroids by Graviton.",
    "",
    "Clark Gregg, Ming-Na Wen, Chloe Bennet, Iain De Caestecker, Elizabeth Henstridge, Henry Simmons, Natalia Cordova-Buckley, Jeff Ward as Deke Shaw",
    "Jed Whedon, Maurissa Tancharoen",
    [
      "Celebrated the milestone 100th episode of the series (\"The Real Deal\") resolving Coulson's mortality deal with Ghost Rider."
    ]
  ],
  [
    97,
    "Iron Fist — Season 2",
    2018,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "Danny Rand protects Chinatown from his vengeful brother Davos while Typhoid Mary causes chaos, leading Colleen to wield the Iron Fist.",
    "",
    "Finn Jones, Jessica Henwick, Sacha Dhawan as Davos / Steel Serpent, Alice Eve as Mary Walker / Typhoid Mary, Tom Pelphrey, Jessica Stroup",
    "Raven Metzner",
    [
      "Featured drastically upgraded fight choreography and saw Colleen Wing inherit the glowing white Iron Fist."
    ]
  ],
  [
    98,
    "Daredevil — Season 3",
    2018,
    "Series",
    "Marvel / Netflix",
    "07",
    "Recommended",
    false,
    "A physically broken Matt Murdock renounces his faith to take down Wilson Fisk and unhinged FBI sniper Dex (Bullseye).",
    "",
    "Charlie Cox, Gwendoline Christie, Deborah Ann Woll, Elden Henson, Joanne Whalley as Sister Maggie, Jay Ali as Ray Nadeem, Wilson Bethel as Benjamin Poindexter / Bullseye, Vincent D'Onofrio",
    "Erik Oleson (Showrunner)",
    [
      "Featured an astonishing 11-minute continuous single-take prison riot fight sequence with zero hidden cuts.",
      "Widely regarded by critics and fans as the pinnacle of Marvel Television storytelling."
    ]
  ],
  [
    99,
    "The Punisher — Season 2",
    2019,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "Frank Castle protects a young runaway grifter from a fundamentalist assassin while settling scores with a scarred Billy Russo (Jigsaw).",
    "",
    "Jon Bernthal, Ben Barnes, Amber Rose Revah, Jason R. Moore, Floriana Lima, Giorgia Whigham as Amy Bendix, Josh Stewart as John Pilgrim",
    "Steve Lightfoot",
    [
      "Explored Frank Castle fully embracing his destiny as the permanent skull-wearing Punisher."
    ]
  ],
  [
    100,
    "Runaways — Season 1",
    2017,
    "Series",
    "Marvel Television",
    "07",
    "Completionist",
    false,
    "Six Los Angeles teenagers discover their wealthy parents belong to a sinister occult human-sacrifice society called PRIDE.",
    "tt1085516",
    "Rhenzy Feliz as Alex Wilder, Lyrica Okano as Nico Minoru, Virginia Gardner as Karolina Dean, Ariela Barer as Gert, Gregg Sulkin as Chase, Allegra Acosta as Molly",
    "Josh Schwartz, Stephanie Savage",
    [
      "Adapted Brian K. Vaughan's award-winning comic series, featuring Old Lace the genetically engineered velociraptor."
    ]
  ],
  [
    101,
    "Runaways — Season 2",
    2018,
    "Series",
    "Marvel Television",
    "07",
    "Completionist",
    false,
    "The Runaways hide out in an underground mansion, honing their magic and tech to stop their parents' alien master Jonah.",
    "",
    "Rhenzy Feliz, Lyrica Okano, Virginia Gardner, Ariela Barer, Gregg Sulkin, Allegra Acosta, Julian McMahon as Jonah",
    "Josh Schwartz, Stephanie Savage",
    [
      "Expanded Nico Minoru's Staff of One blood magic, connecting to the mystical lore of Doctor Strange."
    ]
  ],
  [
    102,
    "Agents of S.H.I.E.L.D. — Season 6",
    2019,
    "Series",
    "Marvel Television",
    "07",
    "Side Quest",
    false,
    "Following Coulson's passing, the team investigates alien Shrike parasites and encounters Sarge, a man with Coulson's exact DNA.",
    "",
    "Clark Gregg as Sarge, Ming-Na Wen, Chloe Bennet, Iain De Caestecker, Elizabeth Henstridge, Henry Simmons, Natalia Cordova-Buckley, Jeff Ward",
    "Jed Whedon, Maurissa Tancharoen",
    [
      "Clark Gregg showcased his acting range playing the cold-blooded immortal sword-wielding alien Sarge."
    ]
  ],
  [
    103,
    "Agents of S.H.I.E.L.D. — Season 7",
    2020,
    "Series",
    "Marvel Television",
    "07",
    "Side Quest",
    false,
    "An epic time-traveling mission across 1930s to 1980s history to prevent synthetic Chronicoms from erasing S.H.I.E.L.D.",
    "",
    "Clark Gregg as LMD Coulson, Ming-Na Wen, Chloe Bennet, Elizabeth Henstridge, Henry Simmons, Natalia Cordova-Buckley, Jeff Ward, Iain De Caestecker",
    "Jed Whedon, Maurissa Tancharoen",
    [
      "Concluded the 136-episode series with an emotional send-off, establishing quantum multiverse timelines."
    ]
  ],
  [
    104,
    "Runaways — Season 3",
    2019,
    "Series",
    "Marvel Television",
    "07",
    "Completionist",
    false,
    "The teen heroes rescue their friends from the Dark Dimension and battle sorceress Morgan le Fay alongside Cloak & Dagger.",
    "",
    "Rhenzy Feliz, Lyrica Okano, Virginia Gardner, Ariela Barer, Gregg Sulkin, Allegra Acosta, Elizabeth Hurley as Morgan le Fay, Olivia Holt, Aubrey Joseph",
    "Josh Schwartz, Stephanie Savage",
    [
      "Featured the official crossover episode with Tandy (Dagger) and Tyrone (Cloak) traveling to Los Angeles."
    ]
  ],
  [
    105,
    "Helstrom — Season 1",
    2020,
    "Series",
    "Marvel Television",
    "07",
    "Completionist",
    false,
    "Daimon and Ana Helstrom, the children of an infamous serial killer demon, hunt the worst of human and demonic evil.",
    "tt10232590",
    "Tom Austen as Daimon Helstrom, Sydney Lemmon as Ana Helstrom, Elizabeth Marvel as Victoria, Robert Wisdom as Caretaker, June Carryl",
    "Paul Zbyszewski (Creator)",
    [
      "The final production released under the original Marvel Television banner before consolidation into Marvel Studios."
    ]
  ],
  [
    106,
    "Cloak & Dagger — Season 2",
    2019,
    "Series",
    "Marvel Television",
    "07",
    "Completionist",
    false,
    "Tandy and Tyrone hone their mastery of light and shadow to dismantle human trafficking rings and face vigilante Mayhem.",
    "",
    "Olivia Holt, Aubrey Joseph, Emma Lahana as Brigid O'Reilly / Mayhem, Jaime Zevallos, Gloria Reuben, Andrea Roth",
    "Joe Pokaski",
    [
      "Explored ancient Loa spirits and New Orleans voodoo mythology connected to Marvel's mystical dimensions."
    ]
  ],
  [
    107,
    "Jessica Jones — Season 3",
    2019,
    "Series",
    "Marvel / Netflix",
    "07",
    "Side Quest",
    false,
    "Jessica and Trish Walker clash over vigilante ethics and lethality while hunting sadistic psychopath Gregory Sallinger.",
    "",
    "Krysten Ritter, Rachael Taylor as Trish Walker / Hellcat, Eka Darville, Benjamin Walker as Erik Gelden, Sarita Choudhury, Jeremy Bobb as Sallinger",
    "Melissa Rosenberg",
    [
      "Krysten Ritter made her directorial debut helming the second episode of the season."
    ]
  ],
  [
    108,
    "Inhumans — Season 1",
    2017,
    "Series",
    "Marvel Television",
    "07",
    "Completionist",
    false,
    "King Black Bolt and the Royal Family of Inhumans flee a military coup in Attilan to the island of Oahu, Hawaii.",
    "tt4122068",
    "Anson Mount as Black Bolt, Serinda Swan as Medusa, Iwan Rheon as Maximus, Ken Leung as Karnak, Eme Ikwuakor as Gorgon, Isabelle Cornish as Crystal",
    "Scott Buck",
    [
      "Anson Mount created his own sign language dictionary for Black Bolt, later reprising the role in Multiverse of Madness (2022)."
    ]
  ],
  [
    109,
    "Fantastic Four",
    1994,
    "Movie",
    "Legacy / Fantastic Four",
    "08",
    "Completionist",
    false,
    "Roger Corman's legendary unreleased cult 1994 film following Reed, Sue, Johnny, and Ben against Doctor Doom.",
    "tt0109770",
    "Alex Hyde-White as Reed Richards, Rebecca Staab as Sue Storm, Jay Underwood as Johnny Storm, Michael Bailey Smith as Ben Grimm, Joseph Culp as Victor Von Doom",
    "Oley Sassone",
    [
      "Made purely so German producer Bernd Eichinger wouldn't lose the film rights to the Fantastic Four franchise.",
      "Became a beloved underground bootleg classic among Marvel collectors worldwide."
    ]
  ],
  [
    110,
    "Fantastic Four",
    2005,
    "Movie",
    "Fox / Fantastic Four",
    "08",
    "Side Quest",
    false,
    "Four astronauts are altered by cosmic radiation on a space station, uniting as superhero celebrities against billionaire Victor Von Doom.",
    "tt0120667",
    "Ioan Gruffudd as Reed Richards / Mr. Fantastic, Jessica Alba as Sue Storm / Invisible Woman, Chris Evans as Johnny Storm / Human Torch, Michael Chiklis as Ben Grimm / The Thing, Julian McMahon as Victor Von Doom",
    "Tim Story",
    [
      "Chris Evans starred as Johnny Storm (Human Torch) 6 years before playing Captain America in the MCU.",
      "Michael Chiklis wore a 60-pound practical foam-latex Thing suit in 100-degree Vancouver heat."
    ]
  ],
  [
    111,
    "Fantastic Four: Rise of the Silver Surfer",
    2007,
    "Movie",
    "Fox / Fantastic Four",
    "08",
    "Side Quest",
    false,
    "The team confronts the enigmatic Silver Surfer across the globe while planet-eater Galactus approaches Earth.",
    "tt0486576",
    "Ioan Gruffudd, Jessica Alba, Chris Evans, Michael Chiklis, Julian McMahon, Doug Jones as Silver Surfer (physical), Laurence Fishburne (voice)",
    "Tim Story",
    [
      "Legendary creature actor Doug Jones provided the physical movement while Laurence Fishburne voiced the Silver Surfer.",
      "Chris Evans reprised his Johnny Storm role in Deadpool & Wolverine (2024)."
    ]
  ],
  [
    112,
    "Fantastic Four",
    2015,
    "Movie",
    "Fox / Fantastic Four",
    "08",
    "Side Quest",
    false,
    "A dark, body-horror reimagining of four young scientists transported to Planet Zero, facing the mutated wrath of Victor Von Doom.",
    "tt1502712",
    "Miles Teller as Reed Richards, Kate Mara as Sue Storm, Michael B. Jordan as Johnny Storm, Jamie Bell as Ben Grimm, Toby Kebbell as Victor Von Doom",
    "Josh Trank",
    [
      "Michael B. Jordan played Johnny Storm before his universally acclaimed performance as Erik Killmonger in Black Panther (2018)."
    ]
  ],
  [
    113,
    "WandaVision — Season 1",
    2021,
    "Series",
    "MCU / Disney+",
    "09",
    "Doomsday Critical",
    false,
    "Grieving the death of Vision, Wanda Maximoff enchants Westview into classic TV sitcoms, unlocking her destiny as the Scarlet Witch.",
    "tt9140560",
    "Elizabeth Olsen as Wanda Maximoff / Scarlet Witch, Paul Bettany as Vision, Kathryn Hahn as Agatha Harkness, Teyonah Parris as Monica Rambeau, Randall Park as Jimmy Woo, Kat Dennings as Darcy Lewis",
    "Matt Shakman (Director), Jac Schaeffer (Creator)",
    [
      "First TV series produced directly by Marvel Studios for Disney+; won 3 Primetime Emmy Awards.",
      "Episode 1 was filmed in front of a live studio audience with period-accurate 1950s camera equipment and costumes.",
      "Kathryn Hahn's \"Agatha All Along\" song went viral, hitting #1 on iTunes Soundtrack charts."
    ]
  ],
  [
    114,
    "Loki — Season 1",
    2021,
    "Series",
    "MCU / Multiverse",
    "09",
    "Doomsday Critical",
    true,
    "The variant God of Mischief is captured by the Time Variance Authority, breaks the Sacred Timeline, and uncovers He Who Remains.",
    "tt9140554",
    "Tom Hiddleston as Loki, Owen Wilson as Mobius M. Mobius, Sophia Di Martino as Sylvie, Gugu Mbatha-Raw as Ravonna Renslayer, Wunmi Mosaku as Hunter B-15, Jonathan Majors as He Who Remains",
    "Kate Herron (Director), Michael Waldron (Creator)",
    [
      "The finale unleashed the Multiverse, serving as the narrative foundation for Spider-Man: No Way Home and Secret Wars.",
      "Owen Wilson and Tom Hiddleston developed an immediate, iconic buddy-cop chemistry on screen.",
      "Introduced the TVA and the concept of timeline pruning."
    ]
  ],
  [
    115,
    "What If...? — Season 1",
    2021,
    "Series",
    "MCU / Animation",
    "09",
    "Essential",
    false,
    "The cosmic Watcher observes divergent alternate timelines across the Multiverse (Captain Carter, Infinity Ultron, Doctor Strange Supreme).",
    "tt10168312",
    "Jeffrey Wright as The Watcher, Hayley Atwell as Captain Carter, Chadwick Boseman as Star-Lord T'Challa, Benedict Cumberbatch as Strange Supreme, Lake Bell, Mick Wingert",
    "Bryan Andrews (Director), A.C. Bradley (Creator)",
    [
      "Featured Chadwick Boseman's final MCU voice performance as T'Challa Star-Lord before his passing.",
      "Captain Carter made the jump from this animated series to live-action in Multiverse of Madness (2022)."
    ]
  ],
  [
    116,
    "Spider-Man: No Way Home",
    2021,
    "Movie",
    "MCU / Multiverse",
    "09",
    "Doomsday Critical",
    true,
    "Doctor Strange's memory spell ruptures the multiverse, bringing Tobey Maguire & Andrew Garfield's Spider-Men and legacy villains into the MCU.",
    "tt10872600",
    "Tom Holland, Zendaya, Benedict Cumberbatch, Jacob Batalon, Jon Favreau, Jamie Foxx, Willem Dafoe, Alfred Molina, Benedict Wong, Marisa Tomei, Andrew Garfield, Tobey Maguire, Charlie Cox as Matt Murdock",
    "Jon Watts",
    [
      "Grossed over $1.92 billion worldwide during the post-pandemic era, becoming one of the biggest box office events in history.",
      "United three generations of live-action Spider-Men (Tobey Maguire, Andrew Garfield, Tom Holland) on screen together.",
      "Willem Dafoe and Alfred Molina reprised Green Goblin and Doc Ock nearly 20 years after their original debuts."
    ]
  ],
  [
    117,
    "Doctor Strange in the Multiverse of Madness",
    2022,
    "Movie",
    "MCU / Multiverse",
    "09",
    "Doomsday Critical",
    true,
    "Doctor Strange travels alternate dimensions with America Chavez to stop the Darkhold-corrupted Scarlet Witch, confronting the Illuminati.",
    "tt9419884",
    "Benedict Cumberbatch as Doctor Strange, Elizabeth Olsen as Wanda Maximoff / Scarlet Witch, Chiwetel Ejiofor, Benedict Wong, Xochitl Gomez as America Chavez, Rachel McAdams, Patrick Stewart as Charles Xavier, John Krasinski as Reed Richards",
    "Sam Raimi",
    [
      "Marked Sam Raimi's celebrated return to Marvel superhero directing after 15 years.",
      "Featured the Earth-838 Illuminati: Patrick Stewart (Xavier), John Krasinski (Mr. Fantastic), Hayley Atwell (Captain Carter), and Anson Mount (Black Bolt).",
      "Directly established the concept of \"Incursions\" that sets up Avengers: Secret Wars."
    ]
  ],
  [
    118,
    "Black Widow",
    2021,
    "Movie",
    "MCU",
    "10",
    "Recommended",
    false,
    "Natasha Romanoff confronts her dark past in the Russian Red Room alongside her estranged assassin family.",
    "tt3480822",
    "Scarlett Johansson as Natasha Romanoff, Florence Pugh as Yelena Belova, David Harbour as Alexei Shostakov / Red Guardian, O-T Fagbenle, Olga Kurylenko as Taskmaster, Rachel Weisz as Melina Vostokoff",
    "Cate Shortland",
    [
      "Florence Pugh's electrifying MCU debut as Yelena Belova earned massive fan acclaim.",
      "David Harbour provided hilarious comic relief as the out-of-shape Soviet super-soldier Red Guardian.",
      "Set between the events of Captain America: Civil War and Avengers: Infinity War."
    ]
  ],
  [
    119,
    "Shang-Chi and the Legend of the Ten Rings",
    2021,
    "Movie",
    "MCU",
    "10",
    "Recommended",
    false,
    "Shang-Chi confronts his immortal warlord father Wenwu and claims the ancient, mystical Ten Rings to protect the hidden realm of Ta Lo.",
    "tt9376612",
    "Simu Liu as Shang-Chi, Awkwafina as Katy, Meng'er Zhang as Xialing, Fala Chen, Florian Munteanu, Benedict Wong, Michelle Yeoh as Ying Nan, Tony Leung as Xu Wenwu",
    "Destin Daniel Cretton",
    [
      "Legendary Hong Kong cinema icon Tony Leung made his Hollywood debut as the complex, tragic Wenwu (The real Mandarin).",
      "The bus fight sequence in San Francisco took over a year to design, choreograph, and execute.",
      "Simu Liu was cast after famously tweeting at Marvel Studios asking for a role in 2018."
    ]
  ],
  [
    120,
    "Eternals",
    2021,
    "Movie",
    "MCU",
    "10",
    "Completionist",
    false,
    "Ten immortal cosmic beings who secretly guided human civilization for 7,000 years emerge to prevent the catastrophic emergence of a Celestial.",
    "tt9032400",
    "Gemma Chan as Sersi, Richard Madden as Ikaris, Kumail Nanjiani as Kingo, Lia McHugh, Brian Tyree Henry as Phastos, Lauren Ridloff as Makkari, Barry Keoghan as Druig, Don Lee as Gilgamesh, Salma Hayek as Ajak, Angelina Jolie as Thena",
    "Chloé Zhao",
    [
      "Directed by Academy Award-winner Chloé Zhao, using extensive natural lighting and practical landscape photography.",
      "Introduced the giant frozen Celestial Tiamut rising from the Indian Ocean, a plot point in Captain America: Brave New World."
    ]
  ],
  [
    121,
    "The Falcon and the Winter Soldier — Season 1",
    2021,
    "Series",
    "MCU / Disney+",
    "10",
    "Recommended",
    false,
    "Sam Wilson and Bucky Barnes team up against the Flag Smashers while Sam grapples with taking up the mantle of Captain America.",
    "tt9284494",
    "Anthony Mackie as Sam Wilson / Captain America, Sebastian Stan as Bucky Barnes, Emily VanCamp as Sharon Carter, Wyatt Russell as John Walker / U.S. Agent, Erin Kellyman as Karli Morgenthau, Daniel Brühl as Baron Zemo",
    "Kari Skogland (Director), Malcolm Spellman (Creator)",
    [
      "Daniel Brühl's improvisational dancing scene in a Madripoor nightclub became an instant global internet sensation.",
      "Officially crowned Sam Wilson as the MCU's new Captain America in the emotional finale."
    ]
  ],
  [
    122,
    "Hawkeye — Season 1",
    2021,
    "Series",
    "MCU / Disney+",
    "10",
    "Recommended",
    false,
    "Clint Barton mentors young archer Kate Bishop during Christmas week in NYC while confronting his violent Ronin past and Kingpin.",
    "tt10160804",
    "Jeremy Renner as Clint Barton / Hawkeye, Hailee Steinfeld as Kate Bishop, Tony Dalton as Jack Duquesne, Fra Fee, Brian d'Arcy James, Aleks Paunovic, Piotr Adamczyk, Linda Cardellini, Simon Callow, Vera Farmiga as Eleanor Bishop, Alaqua Cox as Maya Lopez, Florence Pugh as Yelena Belova, Vincent D'Onofrio as Wilson Fisk",
    "Rhys Thomas, Bert & Bertie",
    [
      "Marked Vincent D'Onofrio's landmark return as Wilson Fisk / Kingpin directly into Marvel Studios productions.",
      "Hailee Steinfeld received widespread praise as the witty, skilled archer Kate Bishop."
    ]
  ],
  [
    123,
    "Ms. Marvel — Season 1",
    2022,
    "Series",
    "MCU / Disney+",
    "10",
    "Recommended",
    false,
    "Jersey City teenager Kamala Khan discovers a family heirloom bangle that unlocks hard-light cosmic powers and mutant heritage.",
    "tt10857164",
    "Iman Vellani as Kamala Khan / Ms. Marvel, Matt Lintz as Bruno, Yasmeen Fletcher, Zenobia Shroff, Mohan Kapur, Saagar Shaikh, Rish Shah, Mehwish Hayat",
    "Adil & Bilall, Bisha K. Ali (Creator)",
    [
      "Iman Vellani was an authentic teenage Marvel superfan discovered through an open casting call in Canada.",
      "The finale dropped the iconic 1990s X-Men animated theme music, revealing Kamala is a mutant."
    ]
  ],
  [
    124,
    "Moon Knight — Season 1",
    2022,
    "Series",
    "MCU / Disney+",
    "10",
    "Side Quest",
    false,
    "Gift-shop employee Steven Grant discovers he has dissociative identity disorder, sharing a body with mercenary Marc Spector and moon god Khonshu.",
    "tt10234724",
    "Oscar Isaac as Marc Spector / Steven Grant / Jake Lockley / Moon Knight, May Calamawy as Layla El-Faouly, Khalid Abdalla, Ann Akinjirin, David Ganly, Antonia Salib, F. Murray Abraham (voice of Khonshu), Ethan Hawke as Arthur Harrow",
    "Mohamed Diab, Jeremy Slater (Creator)",
    [
      "Oscar Isaac gave a masterclass dual acting performance, switching between English and American accents on set using his brother Michael as a stand-in.",
      "Featured authentic Egyptian cultural history and modern Cairo music curated by director Mohamed Diab."
    ]
  ],
  [
    125,
    "She-Hulk: Attorney at Law — Season 1",
    2022,
    "Series",
    "MCU / Disney+",
    "10",
    "Recommended",
    false,
    "Lawyer Jennifer Walters navigates super-powered legal cases while mastering her 6-foot-7 green She-Hulk persona.",
    "tt10857160",
    "Tatiana Maslany as Jennifer Walters / She-Hulk, Jameela Jamil as Titania, Ginger Gonzaga as Nikki, Mark Ruffalo as Bruce Banner / Smart Hulk, Josh Segarra, Tim Roth as Emil Blonsky / Abomination, Benedict Wong as Wong, Charlie Cox as Matt Murdock / Daredevil",
    "Kat Coiro, Jessica Gao (Creator)",
    [
      "Tatiana Maslany broke the fourth wall directly into the real Disney+ production offices in the wild meta finale.",
      "Charlie Cox made his yellow-suit Daredevil return, forming a fan-favorite romantic dynamic with Jen Walters."
    ]
  ],
  [
    126,
    "Thor: Love and Thunder",
    2022,
    "Movie",
    "MCU",
    "10",
    "Recommended",
    false,
    "Thor enlists the Mighty Thor (Jane Foster wielding repaired Mjolnir) and Valkyrie to stop Gorr the God Butcher from erasing the divine pantheon.",
    "tt10648342",
    "Chris Hemsworth as Thor, Christian Bale as Gorr the God Butcher, Tessa Thompson as King Valkyrie, Jaimie Alexander, Taika Waititi as Korg, Russell Crowe as Zeus, Natalie Portman as Jane Foster / Mighty Thor",
    "Taika Waititi",
    [
      "Christian Bale joined the MCU as the terrifying Gorr after previously playing Batman in Christopher Nolan's Dark Knight trilogy.",
      "Natalie Portman underwent 10 months of heavy weight training to physically portray the Mighty Thor.",
      "Russell Crowe delivered a hilarious, over-the-top performance as Zeus with a theatrical Greek accent."
    ]
  ],
  [
    127,
    "Black Panther: Wakanda Forever",
    2022,
    "Movie",
    "MCU",
    "10",
    "Recommended",
    false,
    "Mourning King T'Challa, Queen Ramonda and Shuri protect Wakanda from world powers and Namor's underwater kingdom of Talokan.",
    "tt9114286",
    "Letitia Wright as Shuri / Black Panther, Lupita Nyong'o as Nakia, Danai Gurira as Okoye, Winston Duke as M'Baku, Florence Kasumba, Dominique Thorne as Riri Williams / Ironheart, Michaela Coel, Mabel Cadena, Tenoch Huerta Mejia as Namor, Martin Freeman, Angela Bassett as Queen Ramonda",
    "Ryan Coogler",
    [
      "Angela Bassett won the Golden Globe and earned an Academy Award nomination for Best Supporting Actress (first for Marvel).",
      "The film paid emotional tribute to the late Chadwick Boseman with an un-scored silent Marvel Studios logo opening.",
      "Introduced Tenoch Huerta as Namor the Sub-Mariner reimagined with authentic Mayan mythology."
    ]
  ],
  [
    128,
    "Ant-Man and the Wasp: Quantumania",
    2023,
    "Movie",
    "MCU / Multiverse",
    "10",
    "Recommended",
    false,
    "The Ant-Family is sucked into the microscopic Quantum Realm, confronting the exiled time-traveling conqueror Kang.",
    "tt10954600",
    "Paul Rudd as Scott Lang, Evangeline Lilly as Hope van Dyne, Jonathan Majors as Kang the Conqueror, Kathryn Newton as Cassie Lang, David Dastmalchian, Katy O'Brian, William Jackson Harper, Bill Murray as Krylar, Michelle Pfeiffer as Janet van Dyne, Michael Douglas as Hank Pym",
    "Peyton Reed",
    [
      "Explored the surreal inner world of the Quantum Realm with subatomic civilizations.",
      "The post-credits scene showed the Council of Kangs convening across the Multiverse."
    ]
  ],
  [
    129,
    "Guardians of the Galaxy Vol. 3",
    2023,
    "Movie",
    "MCU",
    "10",
    "Recommended",
    false,
    "The Guardians embark on a desperate mission to save Rocket's life, confronting his cruel creator, the High Evolutionary.",
    "tt6791350",
    "Chris Pratt, Zoe Saldana, Dave Bautista, Karen Gillan, Pom Klementieff as Mantis, Vin Diesel, Bradley Cooper as Rocket, Sean Gunn, Chukwudi Iwuji as High Evolutionary, Will Poulter as Adam Warlock, Maria Bakalova as Cosmo",
    "James Gunn",
    [
      "Chukwudi Iwuji delivered a universally acclaimed, menacing theatrical performance as the ruthless High Evolutionary.",
      "Bradley Cooper and James Gunn delivered a heart-wrenching backstory for Rocket Raccoon.",
      "Concluded James Gunn's beloved 9-year Guardians of the Galaxy trilogy."
    ]
  ],
  [
    130,
    "The Marvels",
    2023,
    "Movie",
    "MCU",
    "10",
    "Recommended",
    false,
    "Carol Danvers, Kamala Khan, and Monica Rambeau become quantum entangled, swapping physical places whenever they use light powers.",
    "tt10676048",
    "Brie Larson as Carol Danvers / Captain Marvel, Teyonah Parris as Monica Rambeau, Iman Vellani as Kamala Khan / Ms. Marvel, Zawe Ashton as Dar-Benn, Gary Lewis, Park Seo-joon, Zenobia Shroff, Mohan Kapur, Saagar Shaikh, Samuel L. Jackson as Nick Fury",
    "Nia DaCosta",
    [
      "The mid-credits scene featured Kelsey Grammer returning as Beast (Hank McCoy) in a parallel X-Men universe.",
      "At 105 minutes, it is the shortest theatrical release in MCU history, packed with kinetic team combat."
    ]
  ],
  [
    131,
    "Secret Invasion — Season 1",
    2023,
    "Series",
    "MCU / Disney+",
    "10",
    "Recommended",
    false,
    "Nick Fury uncovers a clandestine rogue Skrull faction that has infiltrated the highest echelons of world government power.",
    "tt13157618",
    "Samuel L. Jackson as Nick Fury, Ben Mendelsohn as Talos, Kingsley Ben-Adir as Gravik, Killian Scott, Samuel Adewunmi, Dermot Mulroney, Richard Dormer, Emilia Clarke as G'iah, Olivia Colman as Sonya Falsworth, Don Cheadle as James Rhodes",
    "Ali Selim (Director), Kyle Bradstreet (Creator)",
    [
      "Academy Award winner Olivia Colman made her MCU debut as the eccentric, ruthless MI6 agent Sonya Falsworth.",
      "Revealed that Rhodey had been replaced by a Skrull imposter after Civil War."
    ]
  ],
  [
    132,
    "Loki — Season 2",
    2023,
    "Series",
    "MCU / Multiverse",
    "10",
    "Doomsday Critical",
    true,
    "Loki masters time-slipping and makes the ultimate heroic sacrifice, taking his throne at the center of time as the God of Stories holding the Multiverse together.",
    "tt9140554",
    "Tom Hiddleston as Loki, Sophia Di Martino as Sylvie, Gugu Mbatha-Raw, Wunmi Mosaku, Eugene Cordero, Rafael Casal, Tara Strong, Liz Carr, Neil Ellice, Jonathan Majors as Victor Timely, Ke Huy Quan as O.B., Owen Wilson as Mobius",
    "Justin Benson, Aaron Moorhead (Directors), Eric Martin (Showrunner)",
    [
      "Oscar-winner Ke Huy Quan (Everything Everywhere All at Once) joined the cast as the beloved TVA repairs guru O.B.",
      "The finale saw Loki weave the dying timelines into the glowing cosmic branches of Yggdrasil, fulfilling his \"glorious purpose.\"",
      "Considered by fans and critics as the highest-rated Marvel Disney+ finale to date."
    ]
  ],
  [
    133,
    "What If...? — Season 2",
    2023,
    "Series",
    "MCU / Animation",
    "10",
    "Recommended",
    false,
    "The Watcher returns to chronicle multiversal tales: 1602 Avengers, Nebula in the Nova Corps, and Native American hero Kahhori.",
    "",
    "Jeffrey Wright, Hayley Atwell, Devery Jacobs as Kahhori, Cate Blanchett, Laurence Fishburne, Sam Rockwell, Michael Douglas, Kurt Russell, Jon Favreau, Karen Gillan, Taika Waititi",
    "Bryan Andrews, A.C. Bradley",
    [
      "Episode 6 introduced Kahhori, the first completely original Native American superhero created specifically for the MCU.",
      "The Mohawk language episode was developed in deep collaboration with the Mohawk Nation."
    ]
  ],
  [
    134,
    "What If...? — Season 3",
    2024,
    "Series",
    "MCU / Animation",
    "10",
    "Recommended",
    false,
    "The final season of multiversal stories featuring giant mech Avengers, cowboy Shang-Chi, and Storm wielding Mjolnir.",
    "",
    "Jeffrey Wright as The Watcher, Anthony Mackie, David Harbour, Sebastian Stan, Simu Liu, Teyonah Parris",
    "Bryan Andrews",
    [
      "Concluded the animated What If...? anthology series exploring the infinite branches of the multiverse."
    ]
  ],
  [
    135,
    "Echo — Season 1",
    2024,
    "Series",
    "MCU / Disney+",
    "10",
    "Recommended",
    false,
    "Maya Lopez returns to her Oklahoma hometown to reconnect with her Native Choctaw roots while hunted by Wilson Fisk.",
    "tt13966962",
    "Alaqua Cox as Maya Lopez / Echo, Chaske Spencer, Tantoo Cardinal, Devery Jacobs, Zahn McClarnon, Cody Lightning, Graham Greene, Charlie Cox as Matt Murdock / Daredevil, Vincent D'Onofrio as Wilson Fisk / Kingpin",
    "Sydney Freeland, Catriona McKenzie",
    [
      "First project under Marvel Studios' \"Marvel Spotlight\" banner, focusing on grounded character-driven street stories.",
      "First TV-MA rated live-action series developed directly by Marvel Studios."
    ]
  ],
  [
    136,
    "Agatha All Along — Season 1",
    2024,
    "Series",
    "MCU / Disney+",
    "10",
    "Recommended",
    false,
    "Agatha Harkness forms a coven of desperate witches to walk the perilous Witches' Road alongside Billy Maximoff (Wiccan).",
    "tt15571732",
    "Kathryn Hahn as Agatha Harkness, Joe Locke as Billy Maximoff / Wiccan, Sasheer Zamata as Jennifer Kale, Ali Ahn as Alice Wu-Gulliver, Maria Dizzia, Paul Adelstein, Miles Gutierrez-Riley, Okwui Okpokwasili, Debra Jo Rupp, Patti LuPone as Lilia Calderu, Aubrey Plaza as Death / Rio Vidal",
    "Jac Schaeffer (Creator)",
    [
      "Joe Locke's secret identity as Wanda's reincarnated magical son Billy Maximoff (Wiccan) was a major fan reveal.",
      "Broadway legend Patti LuPone gave a standout performance as the 450-year-old Sicilian diviner Lilia Calderu.",
      "Aubrey Plaza joined the MCU as the literal physical manifestation of Death (Rio Vidal)."
    ]
  ],
  [
    137,
    "Werewolf by Night",
    2022,
    "Special",
    "MCU",
    "10",
    "Recommended",
    false,
    "A secret cabal of monster hunters gathers at Bloodstone Manor for a deadly competition, filmed in classic black-and-white gothic style.",
    "tt15318872",
    "Gael García Bernal as Jack Russell / Werewolf by Night, Laura Donnelly as Elsa Bloodstone, Harriet Sansom Harris as Verussa, Kirk R. Thatcher, Eugenie Bondurant, Leonardo Nam",
    "Michael Giacchino",
    [
      "Celebrated Oscar-winning composer Michael Giacchino made his feature directorial debut, also composing the musical score.",
      "Introduced Man-Thing (Ted) into live-action MCU canon using stunning practical puppetry and VFX."
    ]
  ],
  [
    138,
    "The Guardians of the Galaxy Holiday Special",
    2022,
    "Special",
    "MCU",
    "10",
    "Recommended",
    false,
    "Mantis and Drax travel to Hollywood on Earth to kidnap Kevin Bacon as a Christmas present to cheer up Peter Quill.",
    "tt13623136",
    "Chris Pratt, Dave Bautista, Karen Gillan, Pom Klementieff, Vin Diesel, Bradley Cooper, Sean Gunn, Michael Rooker, Kevin Bacon as Himself",
    "James Gunn",
    [
      "Filmed simultaneously alongside Guardians of the Galaxy Vol. 3 in Atlanta.",
      "Revealed the canonical secret that Mantis is Peter Quill's biological half-sister (both children of Ego)."
    ]
  ],
  [
    139,
    "I Am Groot — Seasons 1–2",
    2022,
    "Series",
    "MCU / Animation",
    "10",
    "Completionist",
    false,
    "A delightful collection of animated shorts following Baby Groot's misadventures between the first two Guardians films.",
    "tt13623148",
    "Vin Diesel as Baby Groot, Bradley Cooper as Rocket, Jeffrey Wright as The Watcher",
    "Kirsten Lepore",
    [
      "Vin Diesel returned to record high-pitched vocalizations for Baby Groot.",
      "Features a surprise comedic cameo from Jeffrey Wright as The Watcher observing Groot."
    ]
  ],
  [
    140,
    "Hit-Monkey — Season 1",
    2021,
    "Series",
    "Marvel / Animation",
    "10",
    "Completionist",
    false,
    "A wronged Japanese snow monkey guided by the ghost of an American assassin goes on a violent revenge spree in Tokyo.",
    "tt9829910",
    "Fred Tatasciore as Hit-Monkey, Jason Sudeikis as Bryce Fowler, Olivia Munn as Akiko Yokohama, George Takei as Shinji Yokohama, Ally Maki, Nobi Nakanishi",
    "Josh Gordon, Will Speck (Creators)",
    [
      "Jason Sudeikis provided the voice for the sarcastic, wise-cracking ghost assassin Bryce.",
      "Premiered on Hulu as an adult R-rated animated noir crime action series."
    ]
  ],
  [
    141,
    "Hit-Monkey — Season 2",
    2023,
    "Series",
    "Marvel / Animation",
    "10",
    "Completionist",
    false,
    "Hit-Monkey and the ghost of Bryce relocate to New York City, taking down ruthless supernatural crime syndicates.",
    "",
    "Fred Tatasciore, Jason Sudeikis, Olivia Munn, Leslie Jones, Cristin Milioti as Iris, Keith David",
    "Josh Gordon, Will Speck",
    [
      "Leslie Jones and Keith David joined the voice cast for the New York underworld arc."
    ]
  ],
  [
    142,
    "M.O.D.O.K. — Season 1",
    2021,
    "Series",
    "Marvel / Animation",
    "10",
    "Completionist",
    false,
    "The megalomaniacal supervillain M.O.D.O.K. balances running evil tech company A.I.M. and managing suburban family life in stop-motion.",
    "tt9829880",
    "Patton Oswalt as M.O.D.O.K., Aimee Garcia as Jodie Ramirez-Tarleton, Ben Schwartz as Lou Tarleton, Melissa Fumero as Melissa Tarleton, Wendi McLendon-Covey, Beck Bennett, Jon Daly, Sam Richardson",
    "Jordan Blum, Patton Oswalt (Creators)",
    [
      "Animated using intricate physical stop-motion puppetry by Robot Chicken's Stoopid Buddy Stoodios.",
      "Patton Oswalt co-created and voiced the giant-headed supervillain."
    ]
  ],
  [
    143,
    "Deadpool & Wolverine",
    2024,
    "Movie",
    "MCU / Fox / Multiverse",
    "11",
    "Doomsday Critical",
    true,
    "Wade Wilson is pulled by the TVA into the Void, teaming up with a depressed Logan variant to save his universe from Cassandra Nova.",
    "tt6263850",
    "Ryan Reynolds as Wade Wilson / Deadpool, Hugh Jackman as Logan / Wolverine, Emma Corrin as Cassandra Nova, Morena Baccarin, Rob Delaney, Leslie Uggams, Matthew Macfadyen as Mr. Paradox, Dafne Keen as Laura / X-23, Jon Favreau as Happy Hogan, Chris Evans as Johnny Storm, Wesley Snipes as Blade, Jennifer Garner as Elektra, Channing Tatum as Gambit",
    "Shawn Levy",
    [
      "Became the highest-grossing R-rated film of all time ($1.338 billion), surpassing Joker.",
      "Wesley Snipes set a Guinness World Record for the longest career as a live-action Marvel character (25 years, 340 days).",
      "Channing Tatum finally realized his 18-year dream of portraying Gambit on the big screen."
    ]
  ],
  [
    144,
    "Captain America: Brave New World",
    2025,
    "Movie",
    "MCU",
    "12",
    "Doomsday Critical",
    false,
    "Sam Wilson navigates an international diplomatic crisis and confronts President Thaddeus Ross, who transforms into the Red Hulk.",
    "tt14513804",
    "Anthony Mackie as Sam Wilson / Captain America, Danny Ramirez as Joaquin Torres / Falcon, Shira Haas as Ruth Bat-Seraph, Carl Lumbly as Isaiah Bradley, Giancarlo Esposito as Sidewinder, Liv Tyler as Betty Ross, Tim Blake Nelson as Samuel Sterns / The Leader, Harrison Ford as President Thaddeus \"Thunderbolt\" Ross / Red Hulk",
    "Julius Onah",
    [
      "Legendary actor Harrison Ford stepped into the role of Thaddeus Ross following the passing of William Hurt.",
      "Tim Blake Nelson returned as Samuel Sterns (The Leader) 17 years after his setup in The Incredible Hulk (2008).",
      "Introduced the Red Hulk and explored Adamantium mining on the frozen Celestial Tiamut."
    ]
  ],
  [
    145,
    "Thunderbolts*",
    2025,
    "Movie",
    "MCU",
    "12",
    "Doomsday Critical",
    false,
    "A dysfunctional squad of MCU antiheroes (Yelena Belova, Bucky Barnes, Red Guardian, US Agent, Ghost, Taskmaster) are deployed on covert ops.",
    "tt20969586",
    "Florence Pugh as Yelena Belova, Sebastian Stan as Bucky Barnes, David Harbour as Alexei Shostakov / Red Guardian, Wyatt Russell as John Walker / U.S. Agent, Olga Kurylenko as Antonia Dreykov / Taskmaster, Hannah John-Kamen as Ava Starr / Ghost, Julia Louis-Dreyfus as Valentina Allegra de Fontaine, Lewis Pullman as Bob / Sentry",
    "Jake Schreier",
    [
      "Lewis Pullman was cast as Bob / Sentry, one of the most powerful and psychologically unstable entities in Marvel lore.",
      "The asterisk (*) in the title is confirmed by Kevin Feige to represent an official story reveal in the film."
    ]
  ],
  [
    146,
    "Daredevil: Born Again — Season 1",
    2025,
    "Series",
    "MCU / Marvel Television",
    "12",
    "Doomsday Critical",
    false,
    "Matt Murdock and Mayor Wilson Fisk clash for the soul of NYC in a gritty, high-stakes street-level battle.",
    "tt20230536",
    "Charlie Cox as Matt Murdock / Daredevil, Vincent D'Onofrio as Wilson Fisk / Kingpin, Margarita Levieva, Michael Gandolfini, Genneya Walton, Arty Froushan, Deborah Ann Woll as Karen Page, Elden Henson as Foggy Nelson, Jon Bernthal as Frank Castle / The Punisher",
    "Dario Scardapane (Showrunner)",
    [
      "Brought the entire core Netflix cast (Cox, D'Onofrio, Bernthal, Woll, Henson) directly into mainline MCU continuity.",
      "Explores Wilson Fisk's political reign as the Mayor of New York City cracking down on masked vigilantes."
    ]
  ],
  [
    147,
    "Ironheart — Season 1",
    2025,
    "Series",
    "MCU / Disney+",
    "12",
    "Completionist",
    false,
    "Genius MIT inventor Riri Williams pits high-tech engineering against Parker Robbins (The Hood) wielding dark occult magic in Chicago.",
    "tt13623126",
    "Dominique Thorne as Riri Williams / Ironheart, Anthony Ramos as Parker Robbins / The Hood, Alden Ehrenreich, Lyric Ross, Matthew Elam, Anji White, Manny Montana, Shea Couleé, Sacha Baron Cohen",
    "Sam Bailey, Angela Barnes (Directors), Chinaka Hodge (Creator)",
    [
      "Pits cutting-edge science against dark occult magic in urban Chicago.",
      "Sacha Baron Cohen joins the MCU in a high-profile mysterious demonic role."
    ]
  ],
  [
    148,
    "Eyes of Wakanda — Season 1",
    2025,
    "Series",
    "MCU / Animation",
    "12",
    "Completionist",
    false,
    "An animated anthology series following brave Wakandan War Dogs retrieving dangerous Vibranium artifacts throughout world history.",
    "tt30416972",
    "Winnie Harlow, Cress Williams, Patricia Belcher, Larry Herron, Adam Gold",
    "Todd Harris (Creator), Ryan Coogler (Exec Producer)",
    [
      "Produced in direct collaboration with Black Panther director Ryan Coogler's Proximity Media.",
      "Explores historical Iron Fist and Panther lore intersecting across centuries."
    ]
  ],
  [
    149,
    "Marvel Zombies — Season 1",
    2025,
    "Series",
    "MCU / Animation",
    "12",
    "Recommended",
    false,
    "A TV-MA animated spin-off following surviving heroes (Ms. Marvel, Shang-Chi, Yelena, Jimmy Woo) fighting undead Avenger hordes.",
    "tt16026750",
    "Iman Vellani as Kamala Khan, Simu Liu as Shang-Chi, Florence Pugh as Yelena Belova, Hailee Steinfeld as Kate Bishop, Randall Park as Jimmy Woo, Awkwafina as Katy, David Harbour as Red Guardian",
    "Bryan Andrews (Director), Zeb Wells (Creator)",
    [
      "Marvel Studios' first TV-MA animated series, delivering visceral comic-accurate zombie survival horror."
    ]
  ],
  [
    150,
    "Your Friendly Neighborhood Spider-Man — Season 1",
    2025,
    "Series",
    "Marvel / Animation",
    "12",
    "Recommended",
    false,
    "An alternate timeline animated prequel where Norman Osborn becomes Peter Parker's high school mentor instead of Tony Stark.",
    "tt16026742",
    "Hudson Thames as Peter Parker / Spider-Man, Colman Domingo as Norman Osborn, Charlie Cox as Matt Murdock / Daredevil, Eugene Byrd as Lonnie Lincoln, Grace Song as Nico Minoru",
    "Jeff Trammell (Showrunner)",
    [
      "Oscar nominee Colman Domingo voices Norman Osborn in this 1960s comic book pop-art style series.",
      "Charlie Cox voices Matt Murdock / Daredevil in animated form."
    ]
  ],
  [
    151,
    "Wonder Man — Season 1",
    2025,
    "Series",
    "MCU / Disney+",
    "12",
    "Completionist",
    false,
    "Hollywood actor Simon Williams auditions for superhero roles and discovers superhuman abilities in a Hollywood satire.",
    "tt21066370",
    "Yahya Abdul-Mateen II as Simon Williams / Wonder Man, Ben Kingsley as Trevor Slattery, Demetrius Grosse as Eric Williams / Grim Reaper, Ed Harris, Lauren Glazier",
    "Destin Daniel Cretton, Andrew Guest (Creators)",
    [
      "Yahya Abdul-Mateen II leads this Hollywood-industry superhero satire alongside Ben Kingsley's Trevor Slattery.",
      "Released under the grounded \"Marvel Spotlight\" banner."
    ]
  ],
  [
    152,
    "Daredevil: Born Again — Season 2",
    2026,
    "Series",
    "MCU / Marvel Television",
    "12",
    "Essential",
    false,
    "The continuing street war in New York City as Matt Murdock and his allies push back against Fisk's authoritarian mayoral regime.",
    "",
    "Charlie Cox, Vincent D'Onofrio, Deborah Ann Woll, Elden Henson, Jon Bernthal",
    "Dario Scardapane",
    [
      "Expands the gritty Marvel street-level ecosystem leading directly into Spider-Man and Avengers event storylines."
    ]
  ],
  [
    153,
    "The Punisher: One Last Kill",
    2026,
    "Special",
    "MCU / Marvel Television",
    "12",
    "Recommended",
    false,
    "A special presentation starring Jon Bernthal as Frank Castle tracking down high-level international weapons syndicates.",
    "",
    "Jon Bernthal as Frank Castle / The Punisher",
    "Marvel Studios",
    [
      "A standalone, high-octane R-rated Special Presentation continuing Frank Castle's tactical crusade."
    ]
  ],
  [
    154,
    "Your Friendly Neighborhood Spider-Man — Season 2",
    2026,
    "Series",
    "Marvel / Animation",
    "12",
    "Recommended",
    false,
    "Peter Parker balances sophomore year, Osborn Academy experiments, and emerging rogues gallery villains in NYC.",
    "",
    "Hudson Thames, Colman Domingo, Charlie Cox",
    "Jeff Trammell",
    [
      "Expands the alternate animated universe with classic villains like Scorpion, Chameleon, and Rhino."
    ]
  ],
  [
    155,
    "VisionQuest",
    2026,
    "Series",
    "MCU / Disney+",
    "12",
    "Doomsday Critical",
    false,
    "The reconstructed White Vision embarks on a philosophical quest across humanity to recover his soul, memories, and identity.",
    "",
    "Paul Bettany as White Vision, James Spader as Ultron, Todd Stashwick",
    "Terry Matalas (Showrunner)",
    [
      "Showrun by Terry Matalas, the acclaimed creator behind Star Trek: Picard Season 3.",
      "James Spader officially reprises his legendary voice and performance as Ultron."
    ]
  ],
  [
    156,
    "The Fantastic Four: First Steps",
    2025,
    "Movie",
    "MCU / Fantastic Four",
    "12",
    "Doomsday Critical",
    true,
    "Set in a vibrant retro-futuristic 1960s alternate Earth, Marvel's First Family faces Galactus, the Silver Surfer, and Doctor Doom.",
    "tt10676052",
    "Pedro Pascal as Reed Richards / Mr. Fantastic, Vanessa Kirby as Sue Storm / Invisible Woman, Joseph Quinn as Johnny Storm / Human Torch, Ebon Moss-Bachrach as Ben Grimm / The Thing, Julia Garner as Shalla-Bal / Silver Surfer, Ralph Ineson as Galactus, Robert Downey Jr. as Victor Von Doom",
    "Matt Shakman",
    [
      "Pedro Pascal, Vanessa Kirby, Joseph Quinn, and Ebon Moss-Bachrach introduce Marvel's First Family to the MCU.",
      "Features a distinct 1960s atomic retro-futuristic aesthetic created by WandaVision director Matt Shakman.",
      "Direct prequel and narrative catalyst leading straight into Avengers: Doomsday."
    ]
  ],
  [
    157,
    "Spider-Man: Brand New Day",
    2026,
    "Movie",
    "MCU / Spider-Man",
    "12",
    "Doomsday Critical",
    false,
    "Peter Parker navigates college and street-level crime fighting in NYC, forgotten by the world, leading directly into Doomsday.",
    "",
    "Tom Holland as Peter Parker / Spider-Man, Zendaya as MJ, Mark Ruffalo as Bruce Banner, Jon Bernthal as Frank Castle",
    "Destin Daniel Cretton",
    [
      "Directed by Destin Daniel Cretton (Shang-Chi) as the first installment of Tom Holland's new Spider-Man trilogy.",
      "Connects ground-level NYC superhero conflicts directly to the multiversal incursions in Doomsday."
    ]
  ],
  [
    158,
    "Armor Wars",
    0,
    "Movie",
    "MCU",
    "13",
    "Completionist",
    false,
    "James Rhodes (War Machine) protects Tony Stark's legacy and advanced armor technology from falling into corrupt hands.",
    "",
    "Don Cheadle as James Rhodes / War Machine, Walton Goggins as Sonny Burch",
    "Yassir Lester (Writer)",
    [
      "Explores the geopolitical consequences of Stark armor technology proliferating after Tony Stark's death."
    ]
  ],
  [
    159,
    "Blade",
    0,
    "Movie",
    "MCU",
    "13",
    "Completionist",
    false,
    "Two-time Oscar winner Mahershala Ali stars as the legendary half-vampire Daywalker hunting the supernatural underworld.",
    "",
    "Mahershala Ali as Eric Brooks / Blade, Mia Goth as Lilith",
    "Marvel Studios",
    [
      "Mahershala Ali first teased his Blade role with a voice cameo in the post-credits scene of Eternals (2021)."
    ]
  ],
  [
    160,
    "Avengers: Doomsday",
    2026,
    "Movie",
    "MCU / Multiverse",
    "14",
    "Finale",
    true,
    "Robert Downey Jr. returns to the MCU as the supreme multiversal conqueror Victor Von Doom (Doctor Doom), clashing with Earth's heroes.",
    "tt21358232",
    "Robert Downey Jr. as Victor Von Doom / Doctor Doom, Pedro Pascal as Reed Richards, Vanessa Kirby as Sue Storm, Anthony Mackie as Captain America, Florence Pugh as Yelena Belova, Sebastian Stan as Bucky Barnes, Benedict Cumberbatch as Doctor Strange, Tom Holland as Spider-Man",
    "Anthony Russo, Joe Russo",
    [
      "Marked the historic return of directors Anthony and Joe Russo to helm the next Avengers duology.",
      "Robert Downey Jr. shocked the world at San Diego Comic-Con 2024 unmasking as Victor Von Doom.",
      "The direct culmination of the Multiverse Saga leading into Secret Wars."
    ]
  ],
  [
    161,
    "Avengers: Secret Wars",
    2027,
    "Movie",
    "MCU / Multiverse",
    "14",
    "Finale",
    false,
    "The grand finale of the Multiverse Saga bringing together heroes from the MCU, Fox X-Men, Sony Spider-Verse, and beyond on Battleworld.",
    "tt21358440",
    "Robert Downey Jr. as Doctor Doom, Hugh Jackman as Wolverine, Tobey Maguire as Spider-Man, Ryan Reynolds as Deadpool, Pedro Pascal, Benedict Cumberbatch, Tom Holland, Chris Evans, Anthony Mackie",
    "Anthony Russo, Joe Russo",
    [
      "Adapted from Jonathan Hickman's legendary 2015 Secret Wars comic masterpiece.",
      "Unites all eras of Marvel cinematic history spanning 1998 to 2027 on Battleworld for the ultimate multiversal climax."
    ]
  ]
];

const projects = rawProjects.map(r => {
  const cleanId = r[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    n: r[0],
    title: r[1],
    year: r[2],
    type: r[3],
    universe: r[4],
    section: r[5],
    level: r[6],
    doomsdayRun: r[7],
    desc: r[8],
    imdb: r[9],
    cast: r[10] || '',
    director: r[11] || '',
    trivia: r[12] || [],
    id: cleanId,
    posterClass: getPosterClass(r[4]),
    runtime: getEstimatedRuntime(r[3], r[1]),
    chronoOrder: chronoRankMap[cleanId] || 999
  };
});

const sectionKeysOrdered = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14'];

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[m]));
}

// ══════════════════════════════════════════════════════════
// 3. TAB SWITCHING ENGINE
// ══════════════════════════════════════════════════════════
function switchTab(tabId) {
  settings.activeTab = tabId;
  saveSettings();

  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.remove('active');
  });

  const targetView = document.getElementById('view-' + tabId);
  if (targetView) targetView.classList.add('active');

  // Bottom nav button sync
  document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Desktop sidebar button sync
  document.querySelectorAll('.desktop-sidebar .sidebar-nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
  });

  // Render specific tab content
  if (tabId === 'tracker') render();
  else if (tabId === 'upnext') renderUpNext();
  else if (tabId === 'phases') renderPhases();
  else if (tabId === 'stats') renderStats();
  else if (tabId === 'profile') renderProfile();

  renderSidebar();
}

function updateHeroGreeting() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;
  if (profile.heroName && profile.heroName.trim()) {
    heroTitle.innerHTML = `Welcome, <span class="accent">${escapeHtml(profile.heroName)}!</span> ${profile.avatar}`;
  } else {
    heroTitle.innerHTML = `Welcome, <span class="accent">Hero.</span> 🤜🏻`;
  }
}

// ══════════════════════════════════════════════════════════
// 4. MAIN CHECKLIST RENDER ENGINE (TAB 1)
// ══════════════════════════════════════════════════════════
function render() {
  updateHeroGreeting();
  const searchInput = document.getElementById('searchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterRank = document.getElementById('filterRank');
  const selectedRank = filterRank ? filterRank.value : 'all';
  const filterFormat = document.getElementById('filterFormat');
  const selectedFormat = filterFormat ? filterFormat.value : 'all';
  const activeChip = settings.activeChip || 'all';

  // Sync main sort selector
  const sortSelect = document.getElementById('sortOrderMainSelect');
  if (sortSelect && settings.orderMode) {
    sortSelect.value = settings.orderMode;
  }

  // Toggle clear search button visibility
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  if (clearSearchBtn) {
    clearSearchBtn.style.display = query ? 'block' : 'none';
  }

  // Filter projects
  let filtered = projects.filter(p => {
    const isDone = !!state[p.id];

    // Quick Chip Filters
    if (activeChip === 'unwatched' && isDone) return false;
    if (activeChip === 'doomsday' && !p.doomsdayRun) return false;
    if (activeChip === 'movies' && p.type !== 'Movie') return false;
    if (activeChip === 'series' && p.type !== 'Series') return false;
    if (activeChip === 'critical' && p.level !== 'Doomsday Critical') return false;

    // Advanced Filters
    if (selectedRank !== 'all' && p.level !== selectedRank) return false;
    if (selectedFormat !== 'all' && p.type !== selectedFormat) return false;

    // Search query match (title, universe, character in cast, section name)
    if (query) {
      const secName = (sections[p.section]?.name || '').toLowerCase();
      const matchTarget = (p.title + ' ' + p.universe + ' ' + p.type + ' ' + p.cast + ' ' + secName).toLowerCase();
      if (!matchTarget.includes(query)) return false;
    }

    return true;
  });

  // Sorting
  const mode = settings.orderMode || 'release';
  if (mode === 'chronological') {
    filtered = [...filtered].sort((a, b) => a.chronoOrder - b.chronoOrder);
  } else if (mode === 'doomsday') {
    filtered = [...filtered].sort((a, b) => {
      if (a.doomsdayRun && !b.doomsdayRun) return -1;
      if (!a.doomsdayRun && b.doomsdayRun) return 1;
      return a.n - b.n;
    });
  } else if (mode === 'year-asc') {
    filtered = [...filtered].sort((a, b) => (a.year || 9999) - (b.year || 9999));
  } else if (mode === 'year-desc') {
    filtered = [...filtered].sort((a, b) => (b.year || 0) - (a.year || 0));
  } else if (mode === 'alpha') {
    filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Release Order (by sequential number n)
    filtered = [...filtered].sort((a, b) => a.n - b.n);
  }

  // Render into DOM
  const projectList = document.getElementById('projectList');
  if (!projectList) return;
  projectList.innerHTML = '';

  if (filtered.length === 0) {
    projectList.innerHTML = '<div class="empty-state">No matching Marvel projects found. Try changing your filters.</div>';
    updateProgressSummary();
    renderSidebar();
    return;
  }

  // Group by Section in release mode or Single Unified List for other sort modes
  if (mode === 'release') {
    const grouped = {};
    filtered.forEach(p => {
      if (!grouped[p.section]) grouped[p.section] = [];
      grouped[p.section].push(p);
    });

    // Iterate through EXPLICIT ordered section keys 01 -> 14
    sectionKeysOrdered.forEach(secKey => {
      const list = grouped[secKey];
      if (!list || list.length === 0) return;

      const secInfo = sections[secKey];
      const allSecProjects = projects.filter(p => p.section === secKey);
      const secDoneCount = allSecProjects.filter(p => !!state[p.id]).length;
      const secTotalCount = allSecProjects.length;
      const secPct = secTotalCount > 0 ? Math.round((secDoneCount / secTotalCount) * 100) : 0;

      const sectionEl = document.createElement('section');
      sectionEl.className = 'phase-section';
      sectionEl.id = 'phase-section-' + secKey;

      sectionEl.innerHTML = `
        <div class="phase-header" onclick="this.parentElement.classList.toggle('collapsed')">
          <div class="phase-title-wrap">
            <div class="phase-number">${secKey}</div>
            <div>
              <h2 class="phase-title">${escapeHtml(secInfo.name)}</h2>
              <div class="phase-desc">${escapeHtml(secInfo.desc)}</div>
            </div>
          </div>
          <div class="phase-meta">
            <svg class="phase-ring" viewBox="0 0 36 36">
              <path class="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
              <path class="ring-fill" stroke-dasharray="${secPct}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
            </svg>
            <span class="phase-count">${secDoneCount}/${secTotalCount}</span>
          </div>
        </div>
        <div class="phase-body"></div>
      `;

      const bodyEl = sectionEl.querySelector('.phase-body');
      list.forEach(p => bodyEl.appendChild(createProjectCard(p)));
      projectList.appendChild(sectionEl);
    });
  } else {
    // Flat list for Chronological, Doomsday, Year, or Alpha Order
    const listContainer = document.createElement('div');
    listContainer.className = 'unified-project-list';
    filtered.forEach(p => listContainer.appendChild(createProjectCard(p)));
    projectList.appendChild(listContainer);
  }

  updateProgressSummary();
  renderSidebar();
}

function createProjectCard(p) {
  const isDone = !!state[p.id];
  const icon = typeIcons[p.type] || '🎬';
  const rankClass = rankClasses[p.level] || 'rank-completionist';
  const isDoom = p.id === 'avengers-doomsday';
  const isFinal = p.level === 'Finale';

  const card = document.createElement('div');
  card.className = `project-card${isDone ? ' done' : ''}${isDoom ? ' doomsday-card' : ''}${isFinal ? ' final-card' : ''}`;
  card.setAttribute('data-rank', p.level);

  card.innerHTML = `
    <div class="project-poster ${p.posterClass}">
      <span class="poster-type-icon">${icon}</span>
    </div>
    <div class="project-info">
      <div class="project-name">${String(p.n).padStart(3, '0')} — ${escapeHtml(p.title)}</div>
      <div class="meta">
        ${escapeHtml(p.type)} · ${escapeHtml(p.universe)} ${p.year ? `(${p.year})` : '(TBA)'} · ${p.runtime}m
        <br>
        <span class="rank-badge ${rankClass}">${escapeHtml(p.level)}</span>
        ${p.doomsdayRun ? '<span class="doomsday-badge">🔥 FAST TRACK</span>' : ''}
      </div>
    </div>
    <div class="action-zone">
      <input class="check" type="checkbox" ${isDone ? 'checked' : ''} aria-label="Toggle ${escapeHtml(p.title)}">
      <span class="project-arrow">›</span>
    </div>
  `;

  card.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT') {
      showDetail(p);
    }
  });

  const checkInput = card.querySelector('input');
  checkInput.addEventListener('change', (e) => {
    e.stopPropagation();
    toggleProject(p.id);
  });

  return card;
}

function toggleProject(id) {
  const wasDone = !!state[id];
  state[id] = !wasDone;
  saveState();
  render();

  if (!wasDone) {
    checkAchievements(id);
  }
}

function updateProgressSummary() {
  const doneCount = projects.filter(p => !!state[p.id]).length;
  const totalCount = projects.length;
  const pct = Math.round((doneCount / totalCount) * 100);

  const doneEl = document.getElementById('doneCount');
  if (doneEl) doneEl.textContent = doneCount;
  const totalEl = document.getElementById('totalCount');
  if (totalEl) totalEl.textContent = totalCount;
  const pctEl = document.getElementById('progressPct');
  if (pctEl) pctEl.textContent = `${pct}%`;
  const fillEl = document.getElementById('progressFill');
  if (fillEl) fillEl.style.width = `${pct}%`;

  const statProj = document.getElementById('statProjects');
  if (statProj) statProj.textContent = doneCount;
  const statRem = document.getElementById('statRemaining');
  if (statRem) statRem.textContent = totalCount - doneCount;

  // Infinity Saga (01 - 03)
  const infProjects = projects.filter(p => ['01', '02', '03'].includes(p.section));
  const infDone = infProjects.filter(p => !!state[p.id]).length;
  const infPct = Math.round((infDone / infProjects.length) * 100);
  const infPctEl = document.getElementById('infinityPct');
  if (infPctEl) infPctEl.textContent = `${infPct}%`;
  const infArc = document.getElementById('infinityArc');
  if (infArc) infArc.setAttribute('stroke-dasharray', `${infPct}, 100`);

  // Multiverse Saga (09 - 14)
  const multiProjects = projects.filter(p => ['09', '10', '11', '12', '13', '14'].includes(p.section));
  const multiDone = multiProjects.filter(p => !!state[p.id]).length;
  const multiPct = Math.round((multiDone / multiProjects.length) * 100);
  const mulPctEl = document.getElementById('multiversePct');
  if (mulPctEl) mulPctEl.textContent = `${multiPct}%`;
  const mulArc = document.getElementById('multiverseArc');
  if (mulArc) mulArc.setAttribute('stroke-dasharray', `${multiPct}, 100`);
}

function renderSidebar() {
  const avatarEl = document.getElementById('sidebarAvatar');
  const nameEl = document.getElementById('sidebarName');
  const subEl = document.getElementById('sidebarSub');
  if (avatarEl) avatarEl.textContent = profile.avatar;
  if (nameEl) nameEl.textContent = profile.heroName || 'Marvel Fan';

  const doneCount = projects.filter(p => !!state[p.id]).length;
  if (subEl) subEl.textContent = `${doneCount}/161 watched`;

  const infProjects = projects.filter(p => ['01', '02', '03'].includes(p.section));
  const infPct = Math.round((infProjects.filter(p => !!state[p.id]).length / infProjects.length) * 100);
  const mulProjects = projects.filter(p => ['09', '10', '11', '12', '13', '14'].includes(p.section));
  const mulPct = Math.round((mulProjects.filter(p => !!state[p.id]).length / mulProjects.length) * 100);

  const infEl = document.getElementById('sidebarInfinityPct');
  const mulEl = document.getElementById('sidebarMultiversePct');
  if (infEl) infEl.textContent = infPct + '%';
  if (mulEl) mulEl.textContent = mulPct + '%';
}

function filterUnwatchedOnly() {
  settings.activeChip = 'unwatched';
  saveSettings();
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.getAttribute('data-chip') === 'unwatched'));
  render();
}

function resetAllFilters() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  const filterRank = document.getElementById('filterRank');
  if (filterRank) filterRank.value = 'all';
  const filterFormat = document.getElementById('filterFormat');
  if (filterFormat) filterFormat.value = 'all';
  settings.activeChip = 'all';
  saveSettings();
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.getAttribute('data-chip') === 'all'));
  render();
  showToast('Filters cleared.');
}

// ══════════════════════════════════════════════════════════
// 5. UP NEXT & WATCH ROULETTE (TAB 2)
// ══════════════════════════════════════════════════════════
function renderUpNext() {
  const unwatched = projects.filter(p => !state[p.id]);
  const heroContainer = document.getElementById('upNextHeroContainer');
  const queueContainer = document.getElementById('queueList');
  const remainingCountEl = document.getElementById('queueRemainingCount');

  if (!heroContainer || !queueContainer) return;

  if (unwatched.length === 0) {
    heroContainer.innerHTML = `
      <div class="upnext-hero-card glass" style="text-align:center; padding: 40px 20px;">
        <span style="font-size:48px;">🏆</span>
        <h2 style="margin: 12px 0;">You've watched everything!</h2>
        <p style="color:var(--text-secondary);">You are completely ready for Avengers: Doomsday & Secret Wars.</p>
      </div>
    `;
    queueContainer.innerHTML = '';
    if (remainingCountEl) remainingCountEl.textContent = '0 remaining';
    return;
  }

  // Next in line project
  const nextUp = unwatched[0];
  const icon = typeIcons[nextUp.type] || '🎬';
  const rankClass = rankClasses[nextUp.level] || 'rank-completionist';

  heroContainer.innerHTML = `
    <div class="upnext-hero-card glass">
      <div class="upnext-banner">
        <span class="upnext-tag">⚡ NEXT RECOMMENDED TO WATCH</span>
        <span class="rank-badge ${rankClass}">${escapeHtml(nextUp.level)}</span>
      </div>
      <div class="upnext-body">
        <div class="upnext-poster-row">
          <div class="upnext-large-poster ${nextUp.posterClass}">${icon}</div>
          <div class="upnext-main-info">
            <h2>${String(nextUp.n).padStart(3, '0')} — ${escapeHtml(nextUp.title)}</h2>
            <div class="upnext-meta">${escapeHtml(nextUp.type)} · ${escapeHtml(nextUp.universe)} ${nextUp.year ? `(${nextUp.year})` : '(TBA)'} · ${nextUp.runtime} mins</div>
            <p class="upnext-desc">${escapeHtml(nextUp.desc)}</p>
          </div>
        </div>
        <div class="upnext-actions">
          <button class="upnext-watch-btn" onclick="toggleProject('${nextUp.id}'); renderUpNext();">
            ✓ Mark Watched &amp; Advance
          </button>
          <button class="upnext-info-btn" onclick="showDetailById('${nextUp.id}')">
            ℹ️ Details &amp; Cast
          </button>
        </div>
      </div>
    </div>
  `;

  // Next 5 in Queue
  const queue = unwatched.slice(1, 6);
  if (remainingCountEl) remainingCountEl.textContent = `${unwatched.length} Projects Left`;

  queueContainer.innerHTML = queue.map(p => `
    <div class="queue-item" onclick="showDetailById('${p.id}')">
      <div class="queue-item-poster ${p.posterClass}">${typeIcons[p.type] || '🎬'}</div>
      <div class="queue-item-info">
        <h4>${String(p.n).padStart(3, '0')} — ${escapeHtml(p.title)}</h4>
        <p>${escapeHtml(p.type)} · ${escapeHtml(p.universe)} · ${p.year ? p.year : 'TBA'}</p>
      </div>
      <span class="rank-badge ${rankClasses[p.level] || ''}">${escapeHtml(p.level)}</span>
    </div>
  `).join('');
}

function spinRoulette() {
  const unwatched = projects.filter(p => !state[p.id]);
  const resultEl = document.getElementById('rouletteResult');
  const spinBtn = document.getElementById('rouletteSpinBtn');
  if (!resultEl) return;

  if (unwatched.length === 0) {
    resultEl.style.display = 'block';
    resultEl.innerHTML = '<p>You have already watched all 161 Marvel projects!</p>';
    return;
  }

  if (spinBtn) {
    spinBtn.disabled = true;
    spinBtn.textContent = '🎲 Rolling Multiverse...';
  }

  let counter = 0;
  const interval = setInterval(() => {
    const randomTemp = unwatched[Math.floor(Math.random() * unwatched.length)];
    resultEl.style.display = 'block';
    resultEl.innerHTML = `<div style="font-weight:800; color:var(--gold);">🎲 ${escapeHtml(randomTemp.title)} (${randomTemp.year || 'TBA'})</div>`;
    counter++;
    if (counter > 14) {
      clearInterval(interval);
      const chosen = unwatched[Math.floor(Math.random() * unwatched.length)];
      resultEl.innerHTML = `
        <div style="font-size:11px; color:var(--gold); font-weight:800; text-transform:uppercase; margin-bottom:4px;">✨ The Multiverse Chose For You:</div>
        <h3 style="font-size:16px; font-weight:900; margin-bottom:4px;">${escapeHtml(chosen.title)} (${chosen.year || 'TBA'})</h3>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">${escapeHtml(chosen.desc)}</p>
        <div style="display:flex; gap:8px;">
          <button class="upnext-watch-btn" style="height:38px; font-size:12px;" onclick="showDetailById('${chosen.id}')">View Details &amp; Cast</button>
          <button class="upnext-info-btn" style="height:38px; font-size:12px;" onclick="toggleProject('${chosen.id}'); renderUpNext(); spinRoulette();">✓ Mark Watched</button>
        </div>
      `;
      if (spinBtn) {
        spinBtn.disabled = false;
        spinBtn.textContent = '⚡ Spin Again';
      }
    }
  }, 80);
}

// ══════════════════════════════════════════════════════════
// 6. PHASES & TIMELINE TELEPORTER (TAB 3)
// ══════════════════════════════════════════════════════════
function renderPhases() {
  const jumpGrid = document.getElementById('phasesJumpGrid');
  if (!jumpGrid) return;

  jumpGrid.innerHTML = Object.keys(sections).map(secKey => {
    const secInfo = sections[secKey];
    const secProjects = projects.filter(p => p.section === secKey);
    const secDone = secProjects.filter(p => !!state[p.id]).length;
    const secTotal = secProjects.length;
    const secPct = secTotal > 0 ? Math.round((secDone / secTotal) * 100) : 0;

    return `
      <div class="phase-jump-card glass" onclick="switchTab('tracker'); setTimeout(() => { const el = document.getElementById('phase-section-${secKey}'); if (el) el.scrollIntoView({behavior:'smooth'}); }, 100);">
        <div class="phase-jump-top">
          <span class="phase-jump-number">${secKey}</span>
          <span class="phase-jump-pct">${secPct}%</span>
        </div>
        <h4 class="phase-jump-name">${escapeHtml(secInfo.name)}</h4>
        <p class="phase-jump-sub">${secDone}/${secTotal} Completed · ${escapeHtml(secInfo.saga.toUpperCase())} SAGA</p>
        <div class="phase-jump-bar">
          <div class="phase-jump-fill" style="width:${secPct}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

// ══════════════════════════════════════════════════════════
// 7. STATS & TROPHIES (TAB 4)
// ══════════════════════════════════════════════════════════
const trophiesList = [
  { id: 'first_step', title: 'First Steps', icon: '🌱', desc: 'Watched your first Marvel project' },
  { id: 'iron_legacy', title: 'I Am Iron Man', icon: '🤖', desc: 'Completed Phase 01 (The MCU Foundation)' },
  { id: 'infinity_master', title: 'Infinity Conqueror', icon: '💎', desc: 'Completed all Phases 1-3 of the Infinity Saga' },
  { id: 'mutant_gene', title: 'X-Gene Activated', icon: '🧬', desc: 'Watched 10 mutant and X-Men titles' },
  { id: 'spider_verse', title: 'Spider-Society Member', icon: '🕷️', desc: 'Watched 8 Spider-Man multiverse films' },
  { id: 'defender', title: 'Devil of Hell\'s Kitchen', icon: '😈', desc: 'Watched 5 Marvel Netflix series' },
  { id: 'multiverse_walker', title: 'Multiverse Nomad', icon: '🌀', desc: 'Completed Phase 09 (The Multiverse Awakens)' },
  { id: 'fast_track', title: 'Doomsday Ready', icon: '🔥', desc: 'Watched all 14 Doomsday Fast Track projects' },
  { id: 'movie_buff', title: 'Cinematic Marathoner', icon: '🎬', desc: 'Watched 30 full-length Marvel movies' },
  { id: 'centurion', title: 'Centurion Hero', icon: '💯', desc: 'Checked off 100 Marvel projects' },
  { id: 'halfway', title: 'Halfway to Doom', icon: '⚡', desc: 'Reached 50% overall checklist completion' },
  { id: 'grandmaster', title: 'Grandmaster of the MCU', icon: '👑', desc: 'Watched all 161 projects on the Road to Doomsday' }
];

function isTrophyUnlocked(tId) {
  const watchedCount = projects.filter(p => !!state[p.id]).length;
  const p1Count = projects.filter(p => p.section === '01' && !!state[p.id]).length;
  const infCount = projects.filter(p => ['01', '02', '03'].includes(p.section) && !!state[p.id]).length;
  const xmenCount = projects.filter(p => p.universe.includes('X-Men') && !!state[p.id]).length;
  const spiderCount = projects.filter(p => p.universe.includes('Spider') && !!state[p.id]).length;
  const netflixCount = projects.filter(p => p.universe.includes('Netflix') && !!state[p.id]).length;
  const p9Count = projects.filter(p => p.section === '09' && !!state[p.id]).length;
  const doomCount = projects.filter(p => p.doomsdayRun && !!state[p.id]).length;
  const movieCount = projects.filter(p => p.type === 'Movie' && !!state[p.id]).length;

  switch (tId) {
    case 'first_step': return watchedCount >= 1;
    case 'iron_legacy': return p1Count === 9;
    case 'infinity_master': return infCount === 31;
    case 'mutant_gene': return xmenCount >= 10;
    case 'spider_verse': return spiderCount >= 8;
    case 'defender': return netflixCount >= 5;
    case 'multiverse_walker': return p9Count === 5;
    case 'fast_track': return doomCount >= 14;
    case 'movie_buff': return movieCount >= 30;
    case 'centurion': return watchedCount >= 100;
    case 'halfway': return watchedCount >= 81;
    case 'grandmaster': return watchedCount === 161;
    default: return false;
  }
}

function renderStats() {
  const watchedProjects = projects.filter(p => !!state[p.id]);
  const totalMinutes = projects.reduce((acc, p) => acc + p.runtime, 0);
  const watchedMinutes = watchedProjects.reduce((acc, p) => acc + p.runtime, 0);
  const remainingMinutes = totalMinutes - watchedMinutes;

  const watchedHours = Math.round(watchedMinutes / 60);
  const remainingHours = Math.round(remainingMinutes / 60);

  const watchedDays = (watchedMinutes / 1440).toFixed(1);
  const remainingDays = (remainingMinutes / 1440).toFixed(1);

  const statsHrsWatched = document.getElementById('statsHoursWatched');
  if (statsHrsWatched) statsHrsWatched.textContent = `${watchedHours} hrs`;
  const statsDaysWatched = document.getElementById('statsWatchedDays');
  if (statsDaysWatched) statsDaysWatched.textContent = `${watchedDays} days of Marvel`;

  const statsHrsRem = document.getElementById('statsHoursRemaining');
  if (statsHrsRem) statsHrsRem.textContent = `${remainingHours} hrs`;
  const statsDaysRem = document.getElementById('statsRemainingDays');
  if (statsDaysRem) statsDaysRem.textContent = `~${remainingDays} days to complete`;

  // Universe Breakdown
  const universeGroups = {
    'MCU (Marvel Studios)': p => p.universe.includes('MCU') || p.universe.includes('Disney+'),
    'X-Men & Mutants (Fox)': p => p.universe.includes('X-Men') || p.universe.includes('Fox'),
    'Spider-Man Universe (Sony)': p => p.universe.includes('Spider') || p.universe.includes('Sony') || p.universe.includes('Venom'),
    'Defenders (Netflix)': p => p.universe.includes('Netflix'),
    'Legacy Marvel (Pre-MCU)': p => p.universe.includes('Legacy') || p.universe.includes('Blade') || p.universe.includes('Ghost')
  };

  const universeBars = document.getElementById('universeBreakdownBars');
  if (universeBars) {
    universeBars.innerHTML = Object.entries(universeGroups).map(([name, filterFn]) => {
      const groupProjects = projects.filter(filterFn);
      const groupDone = groupProjects.filter(p => !!state[p.id]).length;
      const groupPct = groupProjects.length > 0 ? Math.round((groupDone / groupProjects.length) * 100) : 0;

      return `
        <div class="universe-bar-item">
          <div class="universe-bar-header">
            <span>${name}</span>
            <b>${groupDone}/${groupProjects.length} (${groupPct}%)</b>
          </div>
          <div class="universe-bar-track">
            <div class="universe-bar-fill" style="width:${groupPct}%;"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Format Breakdown
  const formatBreakdownGrid = document.getElementById('formatBreakdownGrid');
  if (formatBreakdownGrid) {
    const formats = ['Movie', 'Series', 'Special', 'One-Shot', 'Short'];
    formatBreakdownGrid.innerHTML = formats.map(fmt => {
      const fmtProjects = projects.filter(p => p.type === fmt);
      const fmtDone = fmtProjects.filter(p => !!state[p.id]).length;
      return `
        <div class="format-card glass">
          <span class="format-icon">${typeIcons[fmt] || '🎬'}</span>
          <b class="format-count">${fmtDone}/${fmtProjects.length}</b>
          <span class="format-label">${fmt}s</span>
        </div>
      `;
    }).join('');
  }

  // Trophies
  const trophiesGrid = document.getElementById('trophiesGrid');
  if (trophiesGrid) renderTrophiesInto(trophiesGrid);
}

function renderTrophiesInto(targetEl) {
  let unlockedCount = 0;
  targetEl.innerHTML = trophiesList.map(t => {
    const unlocked = isTrophyUnlocked(t.id);
    if (unlocked) unlockedCount++;
    return `
      <div class="trophy-card glass${unlocked ? ' unlocked' : ' locked'}">
        <span class="trophy-icon">${t.icon}</span>
        <div class="trophy-info">
          <h4>${escapeHtml(t.title)}</h4>
          <p>${escapeHtml(t.desc)}</p>
        </div>
        <span class="trophy-badge">${unlocked ? '✓ UNLOCKED' : '🔒 LOCKED'}</span>
      </div>
    `;
  }).join('');

  const countEl = document.getElementById('trophiesUnlockedCount');
  if (countEl) countEl.textContent = `${unlockedCount} of ${trophiesList.length} Unlocked`;
}

// ══════════════════════════════════════════════════════════
// 8. PROFILE & SETTINGS (TAB 5)
// ══════════════════════════════════════════════════════════
function renderProfile() {
  updateHeroGreeting();

  const avatarDisplay = document.getElementById('profileAvatarDisplay');
  if (avatarDisplay) avatarDisplay.textContent = profile.avatar;

  const nameDisplay = document.getElementById('profileHeroNameDisplay');
  if (nameDisplay) nameDisplay.textContent = profile.heroName || 'Hero (tap Edit Name)';

  const joinDate = document.getElementById('profileJoinDate');
  if (joinDate) joinDate.textContent = `Marvel fan since ${profile.joinedDate}`;

  const doneCount = projects.filter(p => !!state[p.id]).length;
  const watchedMins = projects.filter(p => !!state[p.id]).reduce((acc, p) => acc + p.runtime, 0);
  const watchedHrs = Math.round(watchedMins / 60);

  const universeCounts = {};
  projects.filter(p => !!state[p.id]).forEach(p => {
    const u = p.universe.split('/')[0].trim();
    universeCounts[u] = (universeCounts[u] || 0) + 1;
  });
  const topUniverse = Object.entries(universeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '—';

  const sw = document.getElementById('profileStatWatched');
  if (sw) sw.textContent = doneCount;
  const sh = document.getElementById('profileStatHours');
  if (sh) sh.textContent = watchedHrs + 'h';
  const su = document.getElementById('profileStatUniverse');
  if (su) su.textContent = topUniverse;
  const sr = document.getElementById('profileStatRemaining');
  if (sr) sr.textContent = projects.length - doneCount;

  document.querySelectorAll('.avatar-option').forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.avatar === profile.avatar);
  });

  const trophiesEl = document.getElementById('profileTrophiesGrid');
  if (trophiesEl) renderTrophiesInto(trophiesEl);

  const preview = document.getElementById('sharePreviewText');
  if (preview) preview.textContent = generateShareText();
}

function generateShareText() {
  const doneCount = projects.filter(p => !!state[p.id]).length;
  const totalCount = projects.length;
  const pct = Math.round((doneCount / totalCount) * 100);
  const hero = profile.heroName || 'Marvel Hero';

  return `🛡️ ${hero}'s Marvel Road to Doomsday Progress:
📊 ${doneCount}/${totalCount} Projects Completed (${pct}%)
🔥 Destination: Avengers: Doomsday (2026)
Track your full Marvel journey: ${window.location.href}`;
}

// ══════════════════════════════════════════════════════════
// 9. DETAIL MODAL & CAST/TRIVIA VIEWER
// ══════════════════════════════════════════════════════════
let activeModalProject = null;

function showDetailById(id) {
  const p = projects.find(item => item.id === id);
  if (p) showDetail(p);
}

function showDetail(project) {
  activeModalProject = project;
  const isDone = !!state[project.id];
  const icon = typeIcons[project.type] || '🎬';
  const rankClass = rankClasses[project.level] || 'rank-completionist';

  const modalPoster = document.getElementById('modalPoster');
  if (modalPoster) {
    modalPoster.className = `modal-poster ${project.posterClass}`;
    modalPoster.innerHTML = `
      <div class="modal-poster-gradient">
        <div class="modal-poster-type">${icon}</div>
        <div class="modal-poster-title">${escapeHtml(project.title)}</div>
      </div>
    `;
  }

  const modalBadges = document.getElementById('modalBadges');
  if (modalBadges) {
    modalBadges.innerHTML = `
      <span class="rank-badge ${rankClass}">${escapeHtml(project.level)}</span>
      <span class="rank-badge rank-completionist">${escapeHtml(project.type)}</span>
      <span class="rank-badge rank-sidequest">${escapeHtml(project.universe)}</span>
      <span class="rank-badge rank-recommended">${project.runtime} mins</span>
    `;
  }

  const modalTitle = document.getElementById('modalTitle');
  if (modalTitle) modalTitle.textContent = project.title;

  const modalMeta = document.getElementById('modalMeta');
  if (modalMeta) {
    modalMeta.textContent = `${project.type} · ${project.universe} · ${project.year ? project.year : 'TBA'} · ${project.runtime} minutes`;
  }

  const modalDesc = document.getElementById('modalDesc');
  if (modalDesc) modalDesc.textContent = project.desc;

  const modalRelevance = document.getElementById('modalRelevance');
  if (modalRelevance) {
    if (project.doomsdayRun || project.level === 'Doomsday Critical') {
      modalRelevance.style.display = 'block';
      modalRelevance.innerHTML = `🔥 <b>Doomsday Fast Track:</b> Essential setup directly setting up Doctor Doom, Incursions, or Battleworld in Avengers: Doomsday &amp; Secret Wars.`;
    } else {
      modalRelevance.style.display = 'none';
    }
  }

  // Cast Grid
  const castContainer = document.getElementById('modalCastGrid');
  if (castContainer) {
    if (project.cast) {
      castContainer.innerHTML = project.cast.split(',').map(entry => {
        const parts = entry.trim().split(' as ');
        const actor = parts[0]?.trim() || '';
        const char = parts[1]?.trim() || '';
        return `
          <div class="cast-item">
            <div class="actor-name">${escapeHtml(actor)}</div>
            ${char ? `<div class="char-name">as ${escapeHtml(char)}</div>` : ''}
          </div>
        `;
      }).join('');
    } else {
      castContainer.innerHTML = '<div class="cast-item muted">Cast information not listed</div>';
    }
  }

  // Director
  const directorEl = document.getElementById('modalDirectorName');
  if (directorEl) directorEl.textContent = project.director || 'Marvel Studios Production Team';

  // Trivia
  const triviaEl = document.getElementById('modalTriviaList');
  if (triviaEl) {
    if (project.trivia && project.trivia.length) {
      triviaEl.innerHTML = project.trivia.map(t => `
        <div class="trivia-item">
          <span class="trivia-label">💡 Marvel Trivia</span>
          ${escapeHtml(t)}
        </div>
      `).join('');
    } else {
      triviaEl.innerHTML = '<div class="trivia-item">Trivia currently in preparation.</div>';
    }
  }

  // Doomsday Connections
  const connectionsEl = document.getElementById('modalConnections');
  const doomsdayNote = document.getElementById('modalDoomsdayNote');
  if (connectionsEl) {
    const doomsdayProjects = projects.filter(p => p.doomsdayRun);
    const dIdx = doomsdayProjects.findIndex(p => p.id === project.id);
    let html = '';
    if (dIdx > 0) {
      html += `<div class="connection-item">⬅️ <b>Watch Before:</b> ${escapeHtml(doomsdayProjects[dIdx - 1].title)} (${doomsdayProjects[dIdx - 1].year})</div>`;
    }
    if (dIdx >= 0 && dIdx < doomsdayProjects.length - 1) {
      html += `<div class="connection-item">➡️ <b>Watch Next:</b> ${escapeHtml(doomsdayProjects[dIdx + 1].title)} (${doomsdayProjects[dIdx + 1].year})</div>`;
    }
    if (!html) {
      html = '<div class="connection-item muted">View the complete 14-stage checklist for full multiverse continuity.</div>';
    }
    connectionsEl.innerHTML = html;
  }

  if (doomsdayNote) {
    if (project.doomsdayRun) {
      doomsdayNote.style.display = 'block';
      doomsdayNote.innerHTML = '🔥 <b>Priority Fast Track:</b> This title contains crucial multiversal lore, character debuts, or artifacts necessary for Avengers: Doomsday.';
    } else {
      doomsdayNote.style.display = 'none';
    }
  }

  updateModalWatchBtn(isDone);

  const modalImdb = document.getElementById('modalImdb');
  if (modalImdb) {
    if (project.imdb) {
      modalImdb.href = `https://www.imdb.com/title/${project.imdb}/`;
    } else {
      modalImdb.href = `https://www.imdb.com/find/?q=${encodeURIComponent(project.title)}`;
    }
  }

  // Reset modal tab to Overview
  document.querySelectorAll('.modal-tab-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('.modal-panel').forEach((p, i) => p.classList.toggle('active', i === 0));

  const modalOverlay = document.getElementById('modalOverlay');
  if (modalOverlay) modalOverlay.classList.add('active');
}

function updateModalWatchBtn(isDone) {
  const modalWatchBtn = document.getElementById('modalWatchBtn');
  if (!modalWatchBtn) return;
  if (isDone) {
    modalWatchBtn.textContent = '✓ Watched';
    modalWatchBtn.classList.add('watched');
  } else {
    modalWatchBtn.textContent = 'Mark as Watched';
    modalWatchBtn.classList.remove('watched');
  }
}

// ══════════════════════════════════════════════════════════
// 10. ACHIEVEMENTS, TOASTS & CONFETTI
// ══════════════════════════════════════════════════════════
function checkAchievements(toggledId) {
  const toggledProj = projects.find(p => p.id === toggledId);
  if (!toggledProj) return;

  const secKey = toggledProj.section;
  const secProjects = projects.filter(p => p.section === secKey);
  const secDone = secProjects.filter(p => !!state[p.id]).length;

  if (secDone === secProjects.length) {
    const secName = sections[secKey] ? sections[secKey].name : 'Section';
    showToast(`🎉 Stage ${secKey} Complete! ${secName}`);
  }

  const allDone = projects.filter(p => !!state[p.id]).length;
  if (allDone === projects.length) {
    showToast('🏆 CONGRATULATIONS! YOU HAVE COMPLETED THE ENTIRE MARVEL ROAD TO DOOMSDAY!');
    triggerConfetti();
  }
}

function showToast(text) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastText) return;
  toastText.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#e1121b', '#f4c62f', '#42d982', '#5b9cf5', '#ffffff'];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2
    });
  }

  let animationId;
  const startTime = Date.now();

  function renderFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
    });

    if (Date.now() - startTime < 3500) {
      animationId = requestAnimationFrame(renderFrame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationId);
    }
  }

  renderFrame();
}

// ══════════════════════════════════════════════════════════
// 11. INITIALIZATION & EVENT LISTENERS
// ══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Navigation tabs (Bottom nav)
  document.querySelectorAll('.bottom-nav .nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Navigation tabs (Desktop sidebar)
  document.querySelectorAll('.desktop-sidebar .sidebar-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      if (tab) switchTab(tab);
    });
  });

  // Search & input
  document.getElementById('searchInput')?.addEventListener('input', render);
  document.getElementById('clearSearchBtn')?.addEventListener('click', () => {
    const input = document.getElementById('searchInput');
    if (input) input.value = '';
    render();
  });

  // Filter Panel
  document.getElementById('filterToggle')?.addEventListener('click', () => {
    document.getElementById('filterPanel')?.classList.toggle('open');
  });

  document.getElementById('filterRank')?.addEventListener('change', render);
  document.getElementById('filterFormat')?.addEventListener('change', render);
  document.getElementById('filterResetBtn')?.addEventListener('click', resetAllFilters);

  // Quick Chips
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const chipType = e.currentTarget.getAttribute('data-chip');
      settings.activeChip = chipType;
      saveSettings();
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      e.currentTarget.classList.add('active');
      render();
    });
  });

  // Sort Order Main Selector
  document.getElementById('sortOrderMainSelect')?.addEventListener('change', (e) => {
    const order = e.target.value;
    settings.orderMode = order;
    saveSettings();
    document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-order') === order));
    render();
    showToast(`Sorted by: ${e.target.options[e.target.selectedIndex].text}`);
  });

  // Watch Order selector in Phases tab
  document.querySelectorAll('.order-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const order = e.currentTarget.getAttribute('data-order');
      settings.orderMode = order;
      saveSettings();
      document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      render();
      showToast(`Switched watch order to ${order.toUpperCase()}`);
    });
  });

  // Watch Roulette
  document.getElementById('rouletteSpinBtn')?.addEventListener('click', spinRoulette);

  // Profile: Edit Hero Name
  document.getElementById('profileEditBtn')?.addEventListener('click', () => {
    const display = document.getElementById('profileHeroNameDisplay');
    const input = document.getElementById('profileHeroNameInput');
    const btn = document.getElementById('profileEditBtn');
    if (!input || !display || !btn) return;

    if (input.style.display === 'none' || !input.style.display) {
      input.style.display = 'block';
      input.value = profile.heroName;
      display.style.display = 'none';
      btn.textContent = '✓ Save Name';
      input.focus();
    } else {
      profile.heroName = input.value.trim();
      saveProfile();
      input.style.display = 'none';
      display.style.display = 'block';
      btn.textContent = '✏️ Edit Name';
      renderProfile();
      updateHeroGreeting();
      renderSidebar();
      showToast(`Hero name set to: ${profile.heroName || 'Hero'}`);
    }
  });

  // Profile: Avatar Picker Toggle
  document.getElementById('profileAvatarDisplay')?.addEventListener('click', () => {
    document.getElementById('avatarPicker')?.classList.toggle('open');
  });

  // Profile: Avatar selection
  document.querySelectorAll('.avatar-option').forEach(opt => {
    opt.addEventListener('click', () => {
      profile.avatar = opt.dataset.avatar;
      saveProfile();
      renderProfile();
      updateHeroGreeting();
      renderSidebar();
      document.getElementById('avatarPicker')?.classList.remove('open');
      showToast('Avatar updated!');
    });
  });

  // Modal tab switching
  document.querySelectorAll('.modal-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetPanelId = btn.getAttribute('data-panel');
      document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const targetPanel = document.getElementById(targetPanelId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });

  // Modal Watch Toggle
  document.getElementById('modalWatchBtn')?.addEventListener('click', () => {
    if (!activeModalProject) return;
    toggleProject(activeModalProject.id);
    const isDone = !!state[activeModalProject.id];
    updateModalWatchBtn(isDone);
    if (settings.activeTab === 'upnext') renderUpNext();
  });

  // Modal Close
  document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('modalOverlay')?.classList.remove('active');
    activeModalProject = null;
  });

  document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') {
      document.getElementById('modalOverlay').classList.remove('active');
      activeModalProject = null;
    }
  });

  // Tools: Copy Share
  document.getElementById('copyShareBtn')?.addEventListener('click', () => {
    const text = generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      showToast('📋 Progress badge copied to clipboard!');
    }).catch(() => {
      showToast('Copied to clipboard!');
    });
  });

  // Tools: Export Backup
  document.getElementById('exportDataBtn')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `marvel_doomsday_progress_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchor.click();
    showToast('⬇️ Checklist backup exported!');
  });

  // Tools: Import Backup
  document.getElementById('importDataInput')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (typeof imported === 'object') {
          state = imported;
          saveState();
          render();
          showToast('⬆️ Progress successfully restored!');
        }
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  });

  // Tools: Batch Actions
  document.getElementById('batchInfinityBtn')?.addEventListener('click', () => {
    projects.filter(p => ['01', '02', '03'].includes(p.section)).forEach(p => { state[p.id] = true; });
    saveState();
    render();
    showToast('✓ Marked all Infinity Saga (Phases 1–3) as watched!');
  });

  document.getElementById('batchDoomsdayBtn')?.addEventListener('click', () => {
    projects.filter(p => p.doomsdayRun).forEach(p => { state[p.id] = true; });
    saveState();
    render();
    showToast('✓ Marked all Doomsday Fast Track projects as watched!');
  });

  document.getElementById('batchAllMoviesBtn')?.addEventListener('click', () => {
    projects.filter(p => p.type === 'Movie').forEach(p => { state[p.id] = true; });
    saveState();
    render();
    showToast('✓ Marked all Marvel movies as watched!');
  });

  // Tools: Danger Reset
  document.getElementById('safeResetBtn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all your progress? This cannot be undone unless you have a JSON backup.')) {
      state = {};
      saveState();
      render();
      showToast('Progress reset to 0%.');
    }
  });

  // PWA Install Prompt
  let deferredPrompt = null;
  const installBtn = document.getElementById('installBtn');
  const installTopBtn = document.getElementById('installTopBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.classList.add('show');
  });

  async function triggerPwaInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted' && installBtn) {
      installBtn.classList.remove('show');
    }
    deferredPrompt = null;
  }

  if (installBtn) installBtn.addEventListener('click', triggerPwaInstall);
  if (installTopBtn) installTopBtn.addEventListener('click', triggerPwaInstall);

  // Set initial chip state
  if (settings.activeChip) {
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.getAttribute('data-chip') === settings.activeChip));
  }

  // Set initial order tab state
  if (settings.orderMode) {
    document.querySelectorAll('.order-tab-btn').forEach(b => b.classList.toggle('active', b.getAttribute('data-order') === settings.orderMode));
  }

  // Initial tab and view setup
  switchTab(settings.activeTab || 'tracker');
});

// Service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
