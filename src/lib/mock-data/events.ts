import { MicoEvent } from "@/types/event";

export const mockEvents: MicoEvent[] = [
  {
    id: "evt-001",
    title: "Detroit AI Innovators Meetup",
    description:
      "Join Detroit's top AI engineers for an evening of talks, demos, and networking focused on RAG architectures and autonomous agents.",
    location: "TechTown Detroit, 440 Burroughs St, Detroit, MI",
    locationType: "detroit-metro",
    eventType: "networking",
    eventDate: "2026-05-24T18:00:00-04:00",
    aiSummary: {
      whyAttend: "Deep dive into RAG architectures and agentic AI workflows.",
      whosThere: "Engineers from GM, Ford, and local AI startups.",
      vibe: "Casual networking with pizza and craft beer from Atwater Brewery.",
    },
    source: "ibm_rpa",
    matchScore: 95,
    rsvpCount: 48,
    createdAt: "2026-05-10T12:00:00Z",
  },
  {
    id: "evt-002",
    title: "Ann Arbor React & Next.js Workshop",
    description:
      "Hands-on workshop covering Next.js 15 App Router, Server Components, and modern frontend patterns. Bring your laptop!",
    location: "Cahoots Coworking, 206 S Main St, Ann Arbor, MI",
    locationType: "ann-arbor",
    eventType: "workshop",
    eventDate: "2026-06-01T10:00:00-04:00",
    aiSummary: {
      whyAttend: "Hands-on Next.js 15 workshop for frontend devs.",
      whosThere: "U of M CS students and Ann Arbor startup engineers.",
      vibe: "Collaborative coding session with mentors. Coffee provided.",
    },
    source: "ibm_rpa",
    matchScore: 88,
    rsvpCount: 32,
    createdAt: "2026-05-12T09:00:00Z",
  },
  {
    id: "evt-003",
    title: "Grand Rapids Startup Weekend",
    description:
      "54-hour event where developers, designers, and business minds come together to pitch ideas, form teams, and launch startups.",
    location: "The Factory, 1345 Monroe Ave NW, Grand Rapids, MI",
    locationType: "grand-rapids",
    eventType: "hackathon",
    eventDate: "2026-06-13T17:00:00-04:00",
    aiSummary: {
      whyAttend:
        "Build a real startup prototype in 54 hours. Prizes from local VCs.",
      whosThere:
        "Developers, designers, and founders from West Michigan's growing tech scene.",
      vibe: "High-energy, competitive but friendly. Meals and snacks included.",
    },
    source: "api",
    matchScore: 76,
    rsvpCount: 120,
    createdAt: "2026-05-08T15:00:00Z",
  },
  {
    id: "evt-004",
    title: "Women in Michigan Tech Panel",
    description:
      "Hear from women leaders across Michigan's tech industry about career paths, challenges, and the future of inclusive tech communities.",
    location: "Virtual (Zoom)",
    locationType: "virtual",
    eventType: "panel",
    eventDate: "2026-06-05T12:00:00-04:00",
    aiSummary: {
      whyAttend:
        "Inspiring stories from women shaping Michigan's tech landscape.",
      whosThere:
        "CTOs and VPs from Duo Security, Rocket Companies, and Waymo Detroit.",
      vibe: "Professional and empowering. Q&A with audience participation.",
    },
    source: "ibm_rpa",
    matchScore: 82,
    rsvpCount: 95,
    createdAt: "2026-05-14T10:00:00Z",
  },
  {
    id: "evt-005",
    title: "Michigan Data Science Summit",
    description:
      "Full-day summit featuring keynotes on ML in manufacturing, healthcare AI, and responsible AI practices in the Great Lakes region.",
    location: "Cobo Center, 1 Washington Blvd, Detroit, MI",
    locationType: "detroit-metro",
    eventType: "panel",
    eventDate: "2026-06-20T09:00:00-04:00",
    aiSummary: {
      whyAttend:
        "Keynotes on ML applications in Michigan's core industries.",
      whosThere:
        "Data scientists from Blue Cross, Beaumont Health, and Michigan State research labs.",
      vibe: "Conference-style with breakout sessions. Lunch included.",
    },
    source: "ibm_rpa",
    matchScore: 91,
    rsvpCount: 250,
    createdAt: "2026-05-06T08:00:00Z",
  },
  {
    id: "evt-006",
    title: "UP Maker Fair & IoT Showcase",
    description:
      "Showcasing IoT projects, robotics, and maker culture from Michigan's Upper Peninsula tech community.",
    location: "NMU University Center, Marquette, MI",
    locationType: "upper-peninsula",
    eventType: "networking",
    eventDate: "2026-07-10T11:00:00-04:00",
    aiSummary: {
      whyAttend:
        "See cutting-edge IoT and robotics projects from the UP maker community.",
      whosThere:
        "NMU engineering students, UP entrepreneurs, and remote tech workers.",
      vibe: "Relaxed, outdoorsy crowd. Demos and live builds. Pasties for lunch.",
    },
    source: "user_submitted",
    matchScore: 65,
    rsvpCount: 40,
    createdAt: "2026-05-15T14:00:00Z",
  },
];
