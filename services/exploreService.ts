import { supabase } from '@/lib/supabase';
import { storage } from '@/store/storage';
import { awardActivity } from '@/services/gamificationService';

export interface QuickLearnCheck {
  id: string;
  lesson_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation: string;
}

export interface QuickLearnLesson {
  id: string;
  title: string;
  slug: string;
  branch: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimated_minutes: number;
  is_recommended: boolean;
  fx_reward: number;
  short_description: string;
  content_markdown?: string;
  knowledge_check?: {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation: string;
  };
  knowledge_checks?: QuickLearnCheck[];
}

export interface ExploreQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  branch: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  question_count: number;
  estimated_minutes: number;
  fx_reward: number;
  is_daily: boolean;
}

export interface ExploreQuizQuestion {
  id: string;
  quiz_id: string;
  question_number: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option?: string;
  explanation?: string;
}

class ExploreService {
  /**
   * Fetch Quick Learn Lessons filtered by Branch and Search query.
   */
  async getQuickLearnLessons(branch: string = 'CSE', searchQuery: string = ''): Promise<QuickLearnLesson[]> {
    try {
      let query = supabase.from('quick_learn_lessons')
        .select('id, title, slug, branch, category, difficulty, estimated_minutes, is_recommended, fx_reward, short_description')
        .eq('is_published', true);
      if (branch !== 'All' && branch !== 'For You') {
        query = query.eq('branch', branch);
      }
      if (searchQuery.trim()) {
        query = query.ilike('title', `%${searchQuery.trim()}%`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return this.getMockQuickLearnLessons(branch);
      }
      return data;
    } catch (e) {
      return this.getMockQuickLearnLessons(branch);
    }
  }

  /**
   * Fetch single Quick Learn Lesson by ID.
   */
  async getLessonById(id: string): Promise<QuickLearnLesson | null> {
    try {
      const { data: lesson, error } = await supabase
        .from('quick_learn_lessons')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error || !lesson) {
        const mockLessons = this.getMockQuickLearnLessons('All');
        return mockLessons.find(l => l.id === id) || mockLessons[0];
      }

      // Fetch knowledge check questions
      const { data: checks } = await supabase
        .from('quick_learn_checks')
        .select('*')
        .eq('lesson_id', id)
        .order('created_at', { ascending: true });

      const check = checks && checks.length > 0 ? checks[0] : undefined;

      return {
        ...lesson,
        knowledge_check: check ? {
          question_text: check.question_text,
          option_a: check.option_a,
          option_b: check.option_b,
          option_c: check.option_c,
          option_d: check.option_d,
          correct_option: check.correct_option,
          explanation: check.explanation,
        } : undefined,
        knowledge_checks: checks || []
      };
    } catch (e) {
      const mockLessons = this.getMockQuickLearnLessons('All');
      return mockLessons.find(l => l.id === id) || mockLessons[0];
    }
  }

  /**
   * Complete Quick Learn Lesson and award FX tokens (Idempotent).
   */
  async completeLesson(userId: string, lessonId: string, fxReward: number = 45): Promise<{ success: boolean; fxAwarded: number }> {
    const key = `lesson_completed_${userId}_${lessonId}`;
    const alreadyCompleted = storage.getBoolean(key);

    if (alreadyCompleted) {
      return { success: true, fxAwarded: 0 };
    }

    storage.set(key, true);

    try {
      if (userId) {
        await supabase.from('student_lesson_progress').insert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          fx_awarded: fxReward,
        });

        await supabase.from('fx_transactions').insert({
          user_id: userId,
          amount: fxReward,
          source_type: 'QUICK_LEARN',
          source_id: lessonId,
          description: 'Completed Quick Learn Lesson',
        });

        // Award Activity using centralized gamification engine for autothreshold checking
        await awardActivity(userId, 'resource_read', 0, fxReward, lessonId);
      }
    } catch (err) {
      console.warn('[ExploreService] Error recording lesson completion:', err);
    }

    return { success: true, fxAwarded: fxReward };
  }

  /**
   * Fetch Explore Quizzes.
   */
  async getQuizzes(branch: string = 'CSE', isDaily: boolean = false): Promise<ExploreQuiz[]> {
    try {
      let query = supabase.from('explore_quizzes').select('*').eq('is_published', true);
      if (isDaily) {
        query = query.eq('is_daily', true);
      } else if (branch !== 'All' && branch !== 'For You') {
        query = query.eq('branch', branch);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return this.getMockQuizzes(branch);
      }
      return data;
    } catch (e) {
      return this.getMockQuizzes(branch);
    }
  }

  private getMockQuickLearnLessons(branch: string): QuickLearnLesson[] {
    const TOPICS = [
      { id: 'ql-1', title: 'GitHub & Git Basics', category: 'DevOps', branch: 'CSE', desc: 'Git tracks changes in files and collaborates on software.' },
      { id: 'ql-2', title: 'APIs & How They Work', category: 'Web Dev', branch: 'CSE', desc: 'An API defines how software systems communicate using HTTP and JSON.' },
      { id: 'ql-3', title: 'Cloud Computing Concepts', category: 'Cloud', branch: 'CSE', desc: 'Cloud computing provides servers, storage, databases and networking over the internet.' },
      { id: 'ql-4', title: 'Cybersecurity Fundamentals', category: 'Security', branch: 'CSE', desc: 'Core goals include confidentiality, integrity, and availability (CIA triad).' },
      { id: 'ql-5', title: 'Linux Operating System', category: 'OS', branch: 'CSE', desc: 'Linux is an open-source kernel used in servers, embedded devices, and systems.' },
      { id: 'ql-6', title: 'Operating Systems Core', category: 'OS', branch: 'CSE', desc: 'Process management, memory management, file systems, and scheduling.' },
      { id: 'ql-7', title: 'Computer Networks', category: 'Networking', branch: 'CSE', desc: 'LAN, WAN, routers, switches, IP addressing, and routing protocols.' },
      { id: 'ql-8', title: 'Internet & Web Technology', category: 'Web Dev', branch: 'CSE', desc: 'Browsers, web servers, HTTP, URLs, and web standards.' },
      { id: 'ql-9', title: 'HTML & CSS Essentials', category: 'Web Dev', branch: 'CSE', desc: 'Structure pages with HTML elements and style layout with CSS.' },
      { id: 'ql-10', title: 'JavaScript Programming', category: 'Programming', branch: 'CSE', desc: 'Variables, functions, objects, async promises, and DOM manipulation.' },
      { id: 'ql-11', title: 'Python Programming', category: 'Programming', branch: 'CSE', desc: 'Lists, tuples, dictionaries, functions, modules, and data analysis.' },
      { id: 'ql-12', title: 'C Language Fundamentals', category: 'Programming', branch: 'CSE', desc: 'Compilers, pointers, memory allocation, arrays, and structs.' },
      { id: 'ql-13', title: 'Java Core Concepts', category: 'Programming', branch: 'CSE', desc: 'JVM, OOP, classes, inheritance, encapsulation, and interfaces.' },
      { id: 'ql-14', title: 'SQL & Database Systems', category: 'Databases', branch: 'CSE', desc: 'SELECT, INSERT, UPDATE, DELETE, primary keys, and foreign keys.' },
      { id: 'ql-15', title: 'Git vs GitHub', category: 'DevOps', branch: 'CSE', desc: 'Local version control vs remote repository hosting platform.' },
      { id: 'ql-16', title: 'HTTP & HTTPS Protocols', category: 'Networking', branch: 'CSE', desc: 'Web communication, TLS encryption, status codes, and request headers.' },
      { id: 'ql-17', title: 'DNS Architecture Explained', category: 'Networking', branch: 'CSE', desc: 'Translates domain names to IP addresses via root and authoritative servers.' },
      { id: 'ql-18', title: 'Responsive Web Layouts', category: 'Web Dev', branch: 'CSE', desc: 'Flexbox, CSS Grid, media queries, and mobile-first design.' },
      { id: 'ql-19', title: 'React Native Mobile Dev', category: 'Mobile Dev', branch: 'CSE', desc: 'Cross-platform native mobile apps using JavaScript and React.' },
      { id: 'ql-20', title: 'Node.js & Backend Servers', category: 'Backend', branch: 'CSE', desc: 'Event loop, asynchronous I/O, Express servers, and REST APIs.' },
      { id: 'ql-21', title: 'RESTful API Design', category: 'Backend', branch: 'CSE', desc: 'Resource endpoints, HTTP verbs, statelessness, and JSON payloads.' },
      { id: 'ql-22', title: 'Docker Containers', category: 'DevOps', branch: 'CSE', desc: 'Containerization, Dockerfiles, images, containers, and isolated runtimes.' },
      { id: 'ql-23', title: 'Kubernetes Orchestration', category: 'DevOps', branch: 'CSE', desc: 'Pods, deployments, services, clusters, and automated scaling.' },
      { id: 'ql-24', title: 'DSA: Arrays & Strings', category: 'DSA', branch: 'CSE', desc: 'Contiguous memory, indexing, sliding window, and two pointers.' },
      { id: 'ql-25', title: 'DSA: Stacks & Queues', category: 'DSA', branch: 'CSE', desc: 'LIFO stack operations vs FIFO queue processing.' },
      { id: 'ql-26', title: 'DSA: Sorting & Searching', category: 'DSA', branch: 'CSE', desc: 'Binary search O(log N), QuickSort, MergeSort, and time complexity.' },
      { id: 'ql-27', title: 'Object-Oriented Design', category: 'Programming', branch: 'CSE', desc: 'Abstraction, encapsulation, inheritance, polymorphism, and SOLID principles.' },
      { id: 'ql-28', title: 'Software Engineering SDLC', category: 'Software Eng', branch: 'CSE', desc: 'Requirements, design, Agile sprints, testing, and maintenance.' },
      { id: 'ql-29', title: 'Microservices Architecture', category: 'Backend', branch: 'CSE', desc: 'Decoupled services, API gateways, independent deployments, and events.' },
      { id: 'ql-30', title: 'GraphQL vs REST', category: 'Backend', branch: 'CSE', desc: 'Flexible single-endpoint queries vs multi-endpoint REST resources.' },
      { id: 'ql-31', title: 'System Design Basics', category: 'Architecture', branch: 'CSE', desc: 'Load balancing, caching, database sharding, and high availability.' },
      { id: 'ql-32', title: 'DevOps CI/CD Pipelines', category: 'DevOps', branch: 'CSE', desc: 'Automated building, testing, and continuous deployment workflows.' },
      { id: 'ql-33', title: 'ESP32 Microcontroller IoT', category: 'IoT', branch: 'ECE', desc: 'Wi-Fi & Bluetooth microcontroller for embedded sensors and automation.' },
      { id: 'ql-34', title: 'Digital Electronics Logic Gates', category: 'Electronics', branch: 'ECE', desc: 'AND, OR, NOT, NAND, NOR gates, Boolean algebra, and flip-flops.' },
      { id: 'ql-35', title: 'Microprocessors & 8085', category: 'Embedded', branch: 'ECE', desc: 'ALU, registers, bus architecture, instruction sets, and interrupts.' },
      { id: 'ql-36', title: 'Signals & Systems', category: 'Signals', branch: 'ECE', desc: 'Continuous and discrete signals, Fourier transform, and sampling theory.' },
      { id: 'ql-37', title: 'Electrical Circuit Theory', category: 'Electrical', branch: 'EEE', desc: 'Ohm’s law, Kirchhoff’s laws (KCL/KVL), resistors, and AC/DC circuits.' },
      { id: 'ql-38', title: 'Transformers & AC Machines', category: 'Electrical', branch: 'EEE', desc: 'Electromagnetic induction, single-phase transformers, and motors.' },
      { id: 'ql-39', title: 'Power Electronics', category: 'Electrical', branch: 'EEE', desc: 'Thyristors, MOSFETs, inverters, converters, and motor control.' },
      { id: 'ql-40', title: 'Control Systems', category: 'Automation', branch: 'EEE', desc: 'Open-loop vs closed-loop, transfer functions, and PID controllers.' },
      { id: 'ql-41', title: 'Civil Engineering Surveying', category: 'Surveying', branch: 'CIVIL', desc: 'Levelling, compass surveying, total station, and distance measurement.' },
      { id: 'ql-42', title: 'Concrete Technology & RCC', category: 'Construction', branch: 'CIVIL', desc: 'Cement grades, aggregate mixing, curing, and reinforced concrete.' },
      { id: 'ql-43', title: 'Fluid Mechanics & Hydraulics', category: 'Mechanics', branch: 'CIVIL', desc: 'Fluid pressure, Bernoulli equation, pipe flow, and open channels.' },
      { id: 'ql-44', title: 'Structural Analysis', category: 'Structures', branch: 'CIVIL', desc: 'Beams, trusses, shear force, bending moment, and deflection.' },
      { id: 'ql-45', title: 'Thermodynamics & Heat Engines', category: 'Thermal', branch: 'MECH', desc: 'Laws of thermodynamics, Carnot cycle, and internal combustion engines.' },
      { id: 'ql-46', title: 'Fluid Machinery & Turbines', category: 'Thermal', branch: 'MECH', desc: 'Pelton wheel, Francis turbine, and centrifugal pumps.' },
      { id: 'ql-47', title: 'CAD/CAM Manufacturing', category: 'Manufacturing', branch: 'MECH', desc: 'Computer-aided design, 3D modeling, and CNC machining.' },
      { id: 'ql-48', title: 'Strength of Materials', category: 'Mechanics', branch: 'MECH', desc: 'Stress, strain, Hooke’s law, torsion, and principal stresses.' },
      { id: 'ql-49', title: 'Mining Geology & Safety', category: 'Mining', branch: 'MINING', desc: 'Rock mechanics, ventilation, blasting techniques, and mine safety.' },
      { id: 'ql-50', title: 'Engineering Mathematics Core', category: 'Math', branch: 'General', desc: 'Matrices, calculus, differential equations, and probability.' },
    ];

    return TOPICS.map((item) => ({
      id: item.id,
      title: item.title,
      slug: item.id,
      branch: item.branch,
      category: item.category,
      difficulty: 'Beginner',
      estimated_minutes: 3,
      is_recommended: true,
      fx_reward: 10,
      short_description: item.desc,
      content_markdown: `### ${item.title}\n${item.desc}\n\nKey Concepts:\n- Core fundamentals and applications\n- Standard industry best practices\n- Problem-solving techniques`,
      knowledge_check: {
        question_text: `What is the core purpose of ${item.title}?`,
        option_a: item.desc,
        option_b: 'An unrelated operating system command',
        option_c: 'A hardware display resolution metric',
        option_d: 'A legacy network cable specification',
        correct_option: 'A',
        explanation: `${item.title} focuses on: ${item.desc}`,
      },
      knowledge_checks: [{
        id: `mock-check-${item.id}`,
        lesson_id: item.id,
        question_text: `What is the core purpose of ${item.title}?`,
        option_a: item.desc,
        option_b: 'An unrelated operating system command',
        option_c: 'A hardware display resolution metric',
        option_d: 'A legacy network cable specification',
        correct_option: 'A',
        explanation: `${item.title} focuses on: ${item.desc}`,
      }],
    }));
  }

  private getMockQuizzes(branch: string): ExploreQuiz[] {
    const QUIZ_TOPICS = [
      { id: 'q-1', title: 'GitHub & Git Basics Quiz', category: 'DevOps', branch: 'CSE' },
      { id: 'q-2', title: 'APIs & Web Services Quiz', category: 'Web Dev', branch: 'CSE' },
      { id: 'q-3', title: 'Cloud Computing Fundamentals Quiz', category: 'Cloud', branch: 'CSE' },
      { id: 'q-4', title: 'Cybersecurity & CIA Triad Quiz', category: 'Security', branch: 'CSE' },
      { id: 'q-5', title: 'Linux System Administration Quiz', category: 'OS', branch: 'CSE' },
      { id: 'q-6', title: 'Operating Systems Architecture Quiz', category: 'OS', branch: 'CSE' },
      { id: 'q-7', title: 'Computer Networks & Routing Quiz', category: 'Networking', branch: 'CSE' },
      { id: 'q-8', title: 'Internet & Web Protocols Quiz', category: 'Web Dev', branch: 'CSE' },
      { id: 'q-9', title: 'HTML5 & CSS3 Essentials Quiz', category: 'Web Dev', branch: 'CSE' },
      { id: 'q-10', title: 'JavaScript ES6+ Master Quiz', category: 'Programming', branch: 'CSE' },
      { id: 'q-11', title: 'Python Programming Master Quiz', category: 'Programming', branch: 'CSE' },
      { id: 'q-12', title: 'C Programming & Pointers Quiz', category: 'Programming', branch: 'CSE' },
      { id: 'q-13', title: 'Java OOP & JVM Core Quiz', category: 'Programming', branch: 'CSE' },
      { id: 'q-14', title: 'SQL Queries & Joins Quiz', category: 'Databases', branch: 'CSE' },
      { id: 'q-15', title: 'Git Workflows vs GitHub Quiz', category: 'DevOps', branch: 'CSE' },
      { id: 'q-16', title: 'HTTP & HTTPS Security Quiz', category: 'Networking', branch: 'CSE' },
      { id: 'q-17', title: 'DNS Resolution & Nameservers Quiz', category: 'Networking', branch: 'CSE' },
      { id: 'q-18', title: 'Responsive Design & Flexbox Quiz', category: 'Web Dev', branch: 'CSE' },
      { id: 'q-19', title: 'React Native & Mobile Development Quiz', category: 'Mobile Dev', branch: 'CSE' },
      { id: 'q-20', title: 'Node.js & Express Server Quiz', category: 'Backend', branch: 'CSE' },
      { id: 'q-21', title: 'RESTful API Architecture Quiz', category: 'Backend', branch: 'CSE' },
      { id: 'q-22', title: 'Docker Containers & Images Quiz', category: 'DevOps', branch: 'CSE' },
      { id: 'q-23', title: 'Kubernetes Pods & Clusters Quiz', category: 'DevOps', branch: 'CSE' },
      { id: 'q-24', title: 'Data Structures - Arrays & Strings Quiz', category: 'DSA', branch: 'CSE' },
      { id: 'q-25', title: 'Data Structures - Stacks & Queues Quiz', category: 'DSA', branch: 'CSE' },
      { id: 'q-26', title: 'Algorithms - Searching & Sorting Quiz', category: 'DSA', branch: 'CSE' },
      { id: 'q-27', title: 'Object-Oriented Programming (OOP) Quiz', category: 'Programming', branch: 'CSE' },
      { id: 'q-28', title: 'Software Engineering SDLC Quiz', category: 'Software Eng', branch: 'CSE' },
      { id: 'q-29', title: 'Microservices Architecture Quiz', category: 'Backend', branch: 'CSE' },
      { id: 'q-30', title: 'GraphQL vs REST API Quiz', category: 'Backend', branch: 'CSE' },
      { id: 'q-31', title: 'System Design & Scalability Quiz', category: 'Architecture', branch: 'CSE' },
      { id: 'q-32', title: 'DevOps CI/CD Pipelines Quiz', category: 'DevOps', branch: 'CSE' },
      { id: 'q-33', title: 'ESP32 & Microcontroller IoT Quiz', category: 'IoT', branch: 'ECE' },
      { id: 'q-34', title: 'Digital Logic Gates & Circuits Quiz', category: 'Electronics', branch: 'ECE' },
      { id: 'q-35', title: 'Microprocessors & 8085 Quiz', category: 'Embedded', branch: 'ECE' },
      { id: 'q-36', title: 'Signals & Systems Analysis Quiz', category: 'Signals', branch: 'ECE' },
      { id: 'q-37', title: 'Electrical Circuit Theory (AC/DC) Quiz', category: 'Electrical', branch: 'EEE' },
      { id: 'q-38', title: 'Transformers & Motors Quiz', category: 'Electrical', branch: 'EEE' },
      { id: 'q-39', title: 'Power Electronics & Inverters Quiz', category: 'Electrical', branch: 'EEE' },
      { id: 'q-40', title: 'Control Systems & PID Quiz', category: 'Automation', branch: 'EEE' },
      { id: 'q-41', title: 'Civil Engineering Surveying Quiz', category: 'Surveying', branch: 'CIVIL' },
      { id: 'q-42', title: 'Concrete Technology & RCC Design Quiz', category: 'Construction', branch: 'CIVIL' },
      { id: 'q-43', title: 'Fluid Mechanics & Hydraulics Quiz', category: 'Mechanics', branch: 'CIVIL' },
      { id: 'q-44', title: 'Structural Analysis & Trusses Quiz', category: 'Structures', branch: 'CIVIL' },
      { id: 'q-45', title: 'Thermodynamics & IC Engines Quiz', category: 'Thermal', branch: 'MECH' },
      { id: 'q-46', title: 'Fluid Machinery & Turbines Quiz', category: 'Thermal', branch: 'MECH' },
      { id: 'q-47', title: 'CAD/CAM & CNC Machining Quiz', category: 'Manufacturing', branch: 'MECH' },
      { id: 'q-48', title: 'Strength of Materials & Stress Quiz', category: 'Mechanics', branch: 'MECH' },
      { id: 'q-49', title: 'Mining Geology & Safety Quiz', category: 'Mining', branch: 'MINING' },
      { id: 'q-50', title: 'Engineering Mathematics Master Quiz', category: 'Math', branch: 'General' },
    ];

    return QUIZ_TOPICS.map((item, idx) => ({
      id: item.id,
      title: item.title,
      description: `Test your knowledge with 15 questions on ${item.title.replace(' Quiz', '')}. Earn Gold Coins!`,
      category: item.category,
      branch: item.branch,
      difficulty: idx % 3 === 0 ? 'Beginner' : idx % 3 === 1 ? 'Intermediate' : 'Advanced',
      question_count: 15,
      estimated_minutes: 5,
      fx_reward: 15,
      is_daily: idx === 0,
    }));
  }
}

export const exploreService = new ExploreService();
