export const ROADMAPS = {
  'Computer Science': {
    color: '#6366F1',
    steps: [
      { title: 'Programming Basics', duration: '2 months', skills: ['C', 'Python', 'Logic'] },
      { title: 'Frontend Development', duration: '2 months', skills: ['HTML/CSS', 'JavaScript'] },
      { title: 'Backend + DB', duration: '3 months', skills: ['Node.js', 'MySQL', 'REST API'] },
    ],
  },
  'Electronics & Communication': {
    color: '#0D9488',
    steps: [
      { title: 'Electronics Basics', duration: '2 months', skills: ['Circuits', 'Components'] },
      { title: 'Microcontrollers', duration: '3 months', skills: ['Arduino', '8051'] },
      { title: 'PCB + IoT', duration: '2 months', skills: ['KiCad', 'Raspberry Pi'] },
    ],
  },
  Mechanical: {
    color: '#F97316',
    steps: [
      { title: 'Engineering Drawing', duration: '2 months', skills: ['Drawing', 'Isometric'] },
      { title: 'CAD Modeling', duration: '3 months', skills: ['SolidWorks', 'AutoCAD'] },
      { title: 'Manufacturing', duration: '2 months', skills: ['CNC', 'Lathe'] },
    ],
  },
  Civil: {
    color: '#7C3AED',
    steps: [
      { title: 'Materials + Basics', duration: '1 month', skills: ['Concrete', 'Steel'] },
      { title: 'AutoCAD + Revit', duration: '3 months', skills: ['AutoCAD', 'Revit'] },
      { title: 'Survey + Site', duration: '2 months', skills: ['Surveying', 'BOQ'] },
    ],
  },
};

export const COLLEGES = [
  { id: '1', name: 'Government Polytechnic College, Chennai', location: 'Chennai', placements: '85%', fee: '₹2,500/year' },
  { id: '2', name: 'PSG Polytechnic College', location: 'Coimbatore', placements: '95%', fee: '₹15,000/year' },
  { id: '3', name: 'Thiagarajar Polytechnic College', location: 'Salem', placements: '90%', fee: '₹3,000/year' },
];

export const EVENTS = [
  { id: '1', title: 'FEEDX Career Launch', date: 'July 15, 2025', type: 'Career Fair', venue: 'Chennai', registered: 342, capacity: 500 },
  { id: '2', title: 'PCB Design Workshop', date: 'June 28, 2025', type: 'Workshop', venue: 'Online', registered: 186, capacity: 200 },
  { id: '3', title: 'Project Expo', date: 'Aug 2, 2025', type: 'Expo', venue: 'Coimbatore', registered: 128, capacity: 300 },
];

export const COMMUNITY_LINKS = [
  { id: '1', name: 'WhatsApp', members: '2,500+ members', url: 'https://chat.whatsapp.com/feedx' },
  { id: '2', name: 'Instagram', members: '8,200+ followers', url: 'https://instagram.com/feedx_official' },
  { id: '3', name: 'YouTube', members: '4,100+ subscribers', url: 'https://youtube.com/@feedx' },
];

export const TIPS = [
  { id: 't1', title: 'Resume Refresh', desc: 'Add your latest mini-project to improve shortlist chances.', type: 'tip' },
  { id: 't2', title: 'Scholarship Alert', desc: 'State scholarship window closes in 6 days.', type: 'alert' },
  { id: 't3', title: 'Mock Interview', desc: 'Book a campus mock interview slot this week.', type: 'career' },
];

export const UPDATES = [
  { id: 'u1', title: 'DTE exam date sheet published', time: '2h ago' },
  { id: 'u2', title: 'ISRO technician roles open', time: '1d ago' },
  { id: 'u3', title: 'NPTEL AI course enrollment live', time: '2d ago' },
];

export const PROJECTS = [
  { id: 'p1', title: 'Smart Attendance System', by: 'Karthik • CSE', likes: 124 },
  { id: 'p2', title: 'Solar EV Charger', by: 'Priya • ECE', likes: 98 },
  { id: 'p3', title: 'Low Cost Housing Model', by: 'Nithya • Civil', likes: 76 },
];

export const OPPORTUNITY_FEED = [
  {
    id: 'of1',
    type: 'Internship',
    title: 'Web Developer Intern',
    company: 'TechSoft Solutions',
    location: 'Chennai',
    stipend: '₹8,000/month',
    deadline: 'Jun 30',
    featured: true,
  },
  {
    id: 'of2',
    type: 'Job',
    title: 'PCB Design Engineer',
    company: 'CircuitTech Pvt Ltd',
    location: 'Bangalore',
    stipend: '₹18,000/month',
    deadline: 'Jun 28',
    featured: false,
  },
  {
    id: 'of3',
    type: 'Event',
    title: 'Career Fair 2025',
    company: 'FeedX Network',
    location: 'Coimbatore',
    stipend: 'Free Entry',
    deadline: 'Jul 20',
    featured: true,
  },
];
