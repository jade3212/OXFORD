/* =========================================================
   OXFORD PUBLIC SCHOOL — CONTENT LAYER
   All site content lives here. Replace values with real
   school data without touching layout or animation code.
   Values marked (demo) are placeholders for the proposal.
   ========================================================= */
window.OPS = {
  school: {
    name: "Oxford Public School",
    short: "Oxford",
    tagline: ["Every child has a spark.", "We help it shine."],
    address: ["NSK Nagar, Kosavanpalayam", "Ponniammanmedu, Thiruninravur", "Tamil Nadu 602024"],
    phone: "+91 00000 00000",          // (demo)
    email: "info@oxfordpublicschool.in", // (demo)
    mapQuery: "NSK Nagar Kosavanpalayam Thiruninravur Tamil Nadu 602024",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "Facebook", href: "#" },
      { label: "YouTube", href: "#" },
      { label: "LinkedIn", href: "#" }
    ]
  },

  nav: {
    primary: [
      { id: "home", label: "Home" },
      { id: "campus", label: "Campus" },
      { id: "academics", label: "Academics" },
      { id: "events", label: "Events" },
      { id: "sports", label: "Sports" },
      { id: "activities", label: "Activities" },
      { id: "achievements", label: "Achievements" }
    ],
    secondary: [
      { id: "gallery", label: "Gallery" },
      { id: "admissions", label: "Admissions" },
      { id: "contact", label: "Contact" }
    ]
  },

  /* Image library — every photo the site uses. Swap files in /img */
  img: {
    campus: "img/campus.jpg",
    classroom: "img/classroom.jpg",
    lab: "img/lab.jpg",
    library: "img/library.jpg",
    auditorium: "img/auditorium.jpg",
    smartclass: "img/smartclass.jpg",
    math: "img/math.jpg",
    languages: "img/languages.jpg",
    technology: "img/technology.jpg",
    arts: "img/arts.jpg",
    music: "img/music.jpg",
    dance: "img/dance.jpg",
    cricket: "img/cricket.jpg",
    football: "img/football.jpg",
    basketball: "img/basketball.jpg",
    athletics: "img/athletics.jpg",
    indoor: "img/indoor.jpg",
    annualday: "img/annualday.jpg",
    cultural: "img/cultural.jpg",
    awards: "img/awards.jpg",
    contact: "img/contact.jpg",
    faculty1: "img/faculty1.jpg",
    faculty2: "img/faculty2.jpg",
    faculty3: "img/faculty3.jpg",
    student1: "img/student1.jpg"
  },

  loaderPhotos: ["classroom", "campus", "math", "cricket", "annualday", "awards"],

  floating: ["classroom", "cricket", "library", "dance", "lab", "annualday", "music",
             "basketball", "arts", "awards", "technology", "athletics", "cultural", "languages"],

  facilities: [
    { id: "classrooms", name: "Classrooms", img: "classroom", x: 28, y: 62,
      text: "Bright, ventilated rooms arranged for discussion as much as instruction.",
      facts: ["Natural daylight design", "Ergonomic seating", "Class size focused on attention"] },
    { id: "labs", name: "Laboratories", img: "lab", x: 44, y: 54,
      text: "Physics, chemistry and biology laboratories where theory is tested by hand.",
      facts: ["Separate science labs", "Supervised practical sessions", "Safety-first layout"] },
    { id: "library", name: "Library", img: "library", x: 58, y: 48,
      text: "A quiet room of open shelves, reading corners and reference collections.",
      facts: ["Curated age-wise collections", "Reading hour in timetable", "Reference & periodicals"] },
    { id: "auditorium", name: "Auditorium", img: "auditorium", x: 72, y: 58,
      text: "The stage for assemblies, performances, debates and the annual day.",
      facts: ["Raked seating", "Stage lighting & sound", "Hosts inter-school events"] },
    { id: "sports", name: "Sports", img: "cricket", x: 86, y: 78,
      text: "Open grounds and courts where discipline and teamwork are practised daily.",
      facts: ["Cricket & football ground", "Basketball court", "Athletics track"] },
    { id: "activity", name: "Activity Rooms", img: "music", x: 14, y: 76,
      text: "Dedicated rooms for music, dance and art, each with its own instruments and tools.",
      facts: ["Music room", "Dance studio", "Art & craft room"] },
    { id: "smart", name: "Smart Classrooms", img: "smartclass", x: 50, y: 70,
      text: "Interactive panels and digital content that make abstract ideas visible.",
      facts: ["Interactive displays", "Digital lesson library", "Computer lab access"] }
  ],

  subjects: [
    { name: "Mathematics", img: "math", mark: "∑",
      text: "From number sense to algebraic reasoning — patterns, proof and the confidence to solve." },
    { name: "Science", img: "lab", mark: "⚗",
      text: "Observation, hypothesis, experiment. Students learn to ask why, then find out." },
    { name: "Languages", img: "languages", mark: "Aa",
      text: "English, Tamil and Hindi taught for expression — reading deeply, writing clearly, speaking with poise." },
    { name: "Technology", img: "technology", mark: "</>",
      text: "Computer science, coding and digital literacy for a world that runs on software." },
    { name: "Arts", img: "arts", mark: "✦",
      text: "Drawing, painting and design that train the eye and give imagination a discipline." },
    { name: "Innovation", img: "smartclass", mark: "◎",
      text: "Projects that join subjects together — where curiosity becomes something you can build." }
  ],

  activities: [
    { name: "Music", img: "music", note: "Vocal & instrumental", size: "xl" },
    { name: "Dance", img: "dance", note: "Classical & contemporary", size: "md" },
    { name: "Art", img: "arts", note: "Studio practice", size: "sm" },
    { name: "Science Club", img: "lab", note: "Experiments after hours", size: "md" },
    { name: "Technology", img: "technology", note: "Robotics & coding", size: "lg" },
    { name: "Literary Activities", img: "library", note: "Debate, elocution, writing", size: "sm" },
    { name: "Competitions", img: "awards", note: "Inter-school & olympiads", size: "md" },
    { name: "Student Leadership", img: "annualday", note: "Prefects & student council", size: "lg" }
  ],

  sports: [
    { name: "Cricket", img: "cricket", text: "Nets, coaching and inter-school fixtures." },
    { name: "Football", img: "football", text: "Fitness, tactics and team play on the main ground." },
    { name: "Basketball", img: "basketball", text: "Court sessions building speed and coordination." },
    { name: "Athletics", img: "athletics", text: "Track and field — sprints, relays, jumps and throws." },
    { name: "Indoor Sports", img: "indoor", text: "Chess, table tennis, carrom and badminton." }
  ],

  events: [
    { name: "Annual Day", date: "December (demo)", img: "annualday", photos: ["annualday", "dance", "music"],
      text: "The year's finest evening — performances, prize distribution and a celebration of every student on stage." },
    { name: "Cultural Events", date: "Throughout the year", img: "cultural", photos: ["cultural", "dance", "arts"],
      text: "Festivals and heritage days that keep students rooted in the culture of Tamil Nadu and India." },
    { name: "School Functions", date: "Independence & Republic Day", img: "auditorium", photos: ["auditorium", "annualday", "campus"],
      text: "Assemblies and national days observed with ceremony, speeches and student-led programmes." },
    { name: "Competitions", date: "Term 2 (demo)", img: "technology", photos: ["technology", "awards", "library"],
      text: "Quiz, debate, science exhibitions and olympiads — where preparation meets the moment." },
    { name: "Celebrations", date: "Seasonal", img: "dance", photos: ["dance", "cultural", "music"],
      text: "Children's Day, Teachers' Day and festival celebrations that bring the whole school together." },
    { name: "Educational Events", date: "Monthly (demo)", img: "lab", photos: ["lab", "math", "smartclass"],
      text: "Workshops, guest lectures and field visits that carry learning beyond the textbook." }
  ],

  /* (demo) statistics — replace with real figures */
  achievements: {
    stats: [
      { value: 100, suffix: "+", label: "Achievements" },
      { value: 50, suffix: "+", label: "Competitions" },
      { value: 25, suffix: "+", label: "Years of Excellence" }
    ],
    categories: [
      { name: "Academic Excellence", text: "Consistent board results (demo)" },
      { name: "Sports Achievements", text: "District & zonal titles (demo)" },
      { name: "Competition Winners", text: "Olympiads, quiz, debate (demo)" },
      { name: "Awards", text: "School recognitions (demo)" },
      { name: "Student Achievements", text: "Individual honours (demo)" }
    ]
  },

  gallery: [
    { img: "annualday", cat: "Events", caption: "Annual Day finale" },
    { img: "classroom", cat: "Classrooms", caption: "Morning lesson" },
    { img: "cricket", cat: "Sports", caption: "Practice at the nets" },
    { img: "lab", cat: "Academics", caption: "Chemistry practical" },
    { img: "awards", cat: "Achievements", caption: "Prize distribution" },
    { img: "dance", cat: "Events", caption: "Classical dance recital" },
    { img: "smartclass", cat: "Classrooms", caption: "Smart classroom" },
    { img: "basketball", cat: "Sports", caption: "Inter-house basketball" },
    { img: "library", cat: "Academics", caption: "Reading hour" },
    { img: "athletics", cat: "Sports", caption: "Sports day relay" },
    { img: "cultural", cat: "Events", caption: "Heritage festival" },
    { img: "math", cat: "Academics", caption: "Problem solving" },
    { img: "technology", cat: "Achievements", caption: "Robotics showcase" },
    { img: "music", cat: "Events", caption: "School orchestra" },
    { img: "football", cat: "Sports", caption: "Football final" }
  ],

  faculty: [ /* (demo) */
    { name: "Dr. Meera Raghavan", subject: "Science", role: "Principal", img: "faculty1",
      text: "Twenty years in education, with a belief that discipline and curiosity grow best together." },
    { name: "Mr. Arjun Krishnan", subject: "Mathematics", role: "Head of Department", img: "faculty2",
      text: "Teaches mathematics as a language of reasoning, not a list of formulas." },
    { name: "Ms. Lakshmi Sundar", subject: "English", role: "Senior Teacher", img: "faculty3",
      text: "Leads the literary club and coaches students for debate and elocution." }
  ],

  students: [ /* (demo) — never real personal data */
    { name: "Aditi R.", cls: "VIII", section: "A", father: "Mr. R. Kumar", mother: "Mrs. S. Priya", phone: "+91 00000 00001", id: "OPS-2026-0812", img: "student1" },
    { name: "Karthik S.", cls: "X", section: "B", father: "Mr. S. Ravi", mother: "Mrs. M. Devi", phone: "+91 00000 00002", id: "OPS-2026-1024", img: "classroom" },
    { name: "Nila V.", cls: "VI", section: "C", father: "Mr. V. Anand", mother: "Mrs. K. Rani", phone: "+91 00000 00003", id: "OPS-2026-0603", img: "library" }
  ],

  quote: {
    text: "Education is not the filling of a pail, but the lighting of a fire.",
    by: "After Plutarch"
  },

  admissions: {
    steps: [
      { t: "Enquire", d: "Visit the school office or submit the enquiry form below." },
      { t: "Campus Visit", d: "Meet our team and walk through the campus with your child." },
      { t: "Application", d: "Complete the application form with the required documents." },
      { t: "Interaction", d: "A short, friendly interaction with the child and parents." },
      { t: "Confirmation", d: "Receive the admission offer and complete enrolment." }
    ],
    eligibility: [
      "Pre-KG: 2½+ years as on June 1 (demo)",
      "LKG: 3½+ years as on June 1 (demo)",
      "Grade I onwards: based on previous class & transfer certificate"
    ],
    documents: [
      "Birth certificate", "Transfer certificate (Grade II onwards)", "Previous year report card",
      "Aadhaar copy — student & parents", "Four passport-size photographs", "Address proof"
    ],
    dates: [ /* (demo) */
      { label: "Applications open", value: "January" },
      { label: "Campus visits", value: "Jan – Mar" },
      { label: "Interactions", value: "March" },
      { label: "Academic year begins", value: "June" }
    ]
  }
};
