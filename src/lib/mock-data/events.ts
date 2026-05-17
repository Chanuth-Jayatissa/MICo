import { MicoEvent } from "@/types/event";

export const mockEvents: MicoEvent[] = [
  {
    id: "evt-001",
    title: "Hack Michigan (HackMI) 2026",
    description:
      "Produced by Compass Detroit in partnership with GDG Detroit and IBM, Hack Michigan challenges participants to use AI and open-source technologies to build proof-of-concept solutions that modernize Michigan industries — manufacturing, mobility, agriculture, small business, sustainability, education, and urban planning. A multi-day hackathon at TechTown Detroit.",
    location: "TechTown Detroit, 440 Burroughs St, Detroit, MI 48202",
    locationType: "detroit-metro",
<<<<<<< HEAD
    eventType: "hackathon",
    eventDate: "2026-05-15T09:00:00-04:00",
=======
    eventType: "networking",
    industry: "Technology",
    eventDate: "2026-05-24T18:00:00-04:00",
>>>>>>> 0cbd9301b1e3685ee4df9cbbe876f7a94d274f95
    aiSummary: {
      whyAttend: "Build AI-powered solutions for Michigan industries in a 3-day hackathon produced by Compass Detroit.",
      whosThere: "Developers, designers, and data scientists from across Michigan. Sponsors include IBM and Google.",
      vibe: "High-energy collaborative hacking with meals, mentors, and prizes. Access code: HACKMI.",
    },
    source: "ibm_rpa",
    matchScore: 96,
    rsvpCount: 150,
    createdAt: "2026-04-20T12:00:00Z",
  },
  {
    id: "evt-002",
<<<<<<< HEAD
    title: "Michigan Tech Week 2026 — Future State",
    description:
      "Michigan's premier convening for tech and high-growth entrepreneurship, presented by the Michigan Founders Fund. Three days of programming at Michigan Central featuring corporate matchmaking with 50+ global corporations, the Venture Together Competition ($100K grand prize), immersive workshops, panels, and networking.",
    location: "Michigan Central, 2001 15th St, Detroit, MI 48216",
    locationType: "detroit-metro",
    eventType: "networking",
    eventDate: "2026-05-19T09:00:00-04:00",
    aiSummary: {
      whyAttend: "Michigan's biggest startup and tech conference — 500+ corporate matchmaking meetings and a $100K pitch competition.",
      whosThere: "Founders, investors, corporate innovation leaders, and the broader Michigan startup ecosystem.",
      vibe: "Professional but energizing. Held at the newly renovated Michigan Central, Ford's iconic train station.",
=======
    title: "Michigan Nursing Career Fair",
    description:
      "Connect with top Michigan health systems including Beaumont, Henry Ford Health, and Corewell Health. On-site interviews, resume reviews, and sign-on bonus info sessions.",
    location: "TCF Center, 1 Washington Blvd, Detroit, MI",
    locationType: "detroit-metro",
    eventType: "career-fair",
    industry: "Healthcare",
    eventDate: "2026-06-01T09:00:00-04:00",
    aiSummary: {
      whyAttend: "Direct access to hiring managers from Michigan's largest health systems. Many roles offering sign-on bonuses.",
      whosThere: "Recruiters from Beaumont, Henry Ford Health, Corewell Health, and Michigan Medicine.",
      vibe: "Professional but welcoming. Wear scrubs or business casual. Free lunch provided.",
>>>>>>> 0cbd9301b1e3685ee4df9cbbe876f7a94d274f95
    },
    source: "api",
    matchScore: 88,
<<<<<<< HEAD
    rsvpCount: 800,
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "evt-003",
    title: "IWD Innovation Summit 2026 — Break the Pattern",
    description:
      "Organized by Compass Detroit in partnership with GDG Detroit and Google Women Techmakers, the International Women's Day Innovation Summit focused on empowering women in tech. Features keynotes, hands-on workshops, career panels, and community sessions across tracks like 'Level Up,' 'Build with AI,' 'AI Foundations,' and 'Leadership.'",
    location: "Little Caesars Global Resource Center, Downtown Detroit, MI",
    locationType: "detroit-metro",
    eventType: "panel",
    eventDate: "2026-03-28T09:00:00-04:00",
    aiSummary: {
      whyAttend: "Full-day summit exploring how to disrupt traditional pathways and challenge systemic barriers in tech, guided by the 'Break the Pattern' theme.",
      whosThere: "Women technologists, creators, leaders, and allies from across Michigan's tech ecosystem. Organized by Compass Detroit & Women Techmakers.",
      vibe: "Empowering and community-driven. Multiple hands-on tracks from AI foundations to leadership development.",
=======
    rsvpCount: 320,
    createdAt: "2026-05-12T09:00:00Z",
  },
  {
    id: "evt-003",
    title: "Grand Rapids Manufacturing Innovation Summit",
    description:
      "Explore advanced manufacturing techniques, CNC automation, and supply chain optimization. Featuring demos from Steelcase, Haworth, and Gentex.",
    location: "DeVos Place, 303 Monroe Ave NW, Grand Rapids, MI",
    locationType: "grand-rapids",
    eventType: "conference",
    industry: "Manufacturing",
    eventDate: "2026-06-13T08:00:00-04:00",
    aiSummary: {
      whyAttend: "Hands-on demos of Industry 4.0 tech from West Michigan's manufacturing leaders.",
      whosThere: "Production managers, CNC operators, and supply chain pros from Steelcase, Haworth, and Gentex.",
      vibe: "High-energy conference with live machinery demos. Safety glasses provided.",
    },
    source: "api",
    matchScore: 76,
    rsvpCount: 180,
    createdAt: "2026-05-08T15:00:00Z",
  },
  {
    id: "evt-004",
    title: "Women in Michigan Leadership Panel",
    description:
      "Hear from women leaders across Michigan's diverse industries about career paths, mentorship, and building inclusive workplaces.",
    location: "Virtual (Zoom)",
    locationType: "virtual",
    eventType: "community",
    industry: "Cross-Industry",
    eventDate: "2026-06-05T12:00:00-04:00",
    aiSummary: {
      whyAttend: "Inspiring stories from women shaping Michigan's economy across tech, healthcare, and manufacturing.",
      whosThere: "Leaders from Duo Security, Beaumont Health, Steelcase, and Michigan State University.",
      vibe: "Professional and empowering. Q&A with audience participation.",
>>>>>>> 0cbd9301b1e3685ee4df9cbbe876f7a94d274f95
    },
    source: "ibm_rpa",
    matchScore: 82,
    rsvpCount: 200,
    createdAt: "2026-02-15T09:00:00Z",
  },
  {
    id: "evt-004",
    title: "Detroit Pride Innovation Summit — Break the Pattern in Tech",
    description:
      "Hosted in partnership with Compass Detroit and GDG Detroit, this summit spotlights how LGBTQ+ voices are transforming technology — particularly in AI and emerging fields — through leadership, bold thinking, and creativity. Features panel discussions, technical sessions, workshops, and networking.",
    location: "TechTown Detroit, 440 Burroughs St, Detroit, MI 48202",
    locationType: "detroit-metro",
    eventType: "panel",
    eventDate: "2026-06-14T10:00:00-04:00",
    aiSummary: {
      whyAttend: "Amplifying LGBTQ+ technologists and fostering inclusive innovation in Michigan's tech ecosystem.",
      whosThere: "LGBTQ+ tech professionals, allies, and community leaders. Co-organized by Compass Detroit and GDG Detroit.",
      vibe: "Inclusive, inspiring, and action-oriented. Focused on career advancement and inclusive leadership in AI.",
    },
    source: "ibm_rpa",
    matchScore: 78,
    rsvpCount: 120,
    createdAt: "2026-05-01T10:00:00Z",
  },
  {
    id: "evt-005",
<<<<<<< HEAD
    title: "D-NewTech Detroit — Monthly Startup Meetup",
    description:
      "D-NewTech (DNT) is Detroit's longest-running monthly tech meetup, hosted at TechTown Detroit on the 2nd Wednesday of each month. Features 7-minute pitch presentations from startups, guest speakers, community announcements, and dedicated networking time with drinks.",
    location: "TechTown Detroit, 440 Burroughs St, Detroit, MI 48202",
    locationType: "detroit-metro",
    eventType: "networking",
    eventDate: "2026-06-10T18:30:00-04:00",
    aiSummary: {
      whyAttend: "Detroit's longest-running monthly tech meetup — hear startup pitches and network with the local ecosystem.",
      whosThere: "Startup founders, developers, investors, and tech enthusiasts from Metro Detroit.",
      vibe: "Casual and welcoming. Networking from 6:30 PM, pitches at 7:00 PM. Drinks included.",
    },
    source: "api",
    matchScore: 85,
    rsvpCount: 60,
    createdAt: "2026-05-15T14:00:00Z",
  },
  {
    id: "evt-006",
    title: "Michigan DevFest 2026",
    description:
      "The 12th annual Michigan DevFest, organized by GDG Detroit, GDG Ann Arbor, GDG Toledo, GDG UofM Dearborn, GDG Windsor, and Compass Detroit. Expect an Agentic AI Hackathon, technical sessions, and workshops covering AI/ML, cloud platforms, web development, and leadership. Previously held at Wayne State and MotorCity Casino Hotel.",
    location: "Detroit, MI (Venue TBA)",
    locationType: "detroit-metro",
    eventType: "workshop",
    eventDate: "2026-11-20T09:00:00-05:00",
    aiSummary: {
      whyAttend: "Michigan's premier developer conference — AI hackathon, technical sessions, and workshops across multiple tracks.",
      whosThere: "Developers from 5+ GDG chapters across Michigan, Ohio, and Ontario. Organized with Compass Detroit.",
      vibe: "Two-day format: Day 1 hackathon, Day 2 conference sessions. Community-driven and highly technical.",
    },
    source: "ibm_rpa",
    matchScore: 93,
    rsvpCount: 300,
    createdAt: "2026-05-10T08:00:00Z",
=======
    title: "Ann Arbor Educators Professional Development Workshop",
    description:
      "A hands-on workshop for K-12 educators covering project-based learning, SEL integration, and AI-assisted lesson planning tools.",
    location: "University of Michigan School of Education, Ann Arbor, MI",
    locationType: "ann-arbor",
    eventType: "training",
    industry: "Education",
    eventDate: "2026-06-20T09:00:00-04:00",
    aiSummary: {
      whyAttend: "Learn cutting-edge teaching strategies with hands-on practice sessions.",
      whosThere: "K-12 teachers from Washtenaw County, U of M education faculty, and ed-tech startups.",
      vibe: "Collaborative workshop atmosphere. Coffee and materials provided.",
    },
    source: "ibm_rpa",
    matchScore: 70,
    rsvpCount: 65,
    createdAt: "2026-05-06T08:00:00Z",
  },
  {
    id: "evt-006",
    title: "Michigan Skilled Trades Hiring Event",
    description:
      "Electricians, plumbers, HVAC techs, and welders — Michigan contractors are hiring. Walk-in interviews, apprenticeship info, and certification guidance.",
    location: "Macomb Community College, Warren, MI",
    locationType: "detroit-metro",
    eventType: "career-fair",
    industry: "Trades",
    eventDate: "2026-07-10T10:00:00-04:00",
    aiSummary: {
      whyAttend: "Walk-in interviews with Michigan's top contractors. Apprenticeship pathways available for career changers.",
      whosThere: "Union reps, general contractors, and skilled trades employers from Southeast Michigan.",
      vibe: "Casual and practical. Bring your certifications. Lunch provided.",
    },
    source: "user_submitted",
    matchScore: 65,
    rsvpCount: 140,
    createdAt: "2026-05-15T14:00:00Z",
>>>>>>> 0cbd9301b1e3685ee4df9cbbe876f7a94d274f95
  },
  {
    id: "evt-007",
    title: "Detroit FinTech & Banking Mixer",
    description:
      "Network with professionals from Ally Financial, Rocket Companies, and Flagstar Bank. Discuss digital banking, compliance, and fintech innovation in Michigan.",
    location: "The Apparatus Room, Detroit Foundation Hotel, Detroit, MI",
    locationType: "detroit-metro",
    eventType: "networking",
    industry: "Finance",
    eventDate: "2026-06-25T17:30:00-04:00",
    aiSummary: {
      whyAttend: "Connect with decision-makers from Michigan's growing fintech corridor.",
      whosThere: "Finance professionals, compliance officers, and software engineers from Detroit's banking sector.",
      vibe: "Upscale networking with cocktails and appetizers. Business casual.",
    },
    source: "api",
    matchScore: 78,
    rsvpCount: 55,
    createdAt: "2026-05-16T08:00:00Z",
  },
];
