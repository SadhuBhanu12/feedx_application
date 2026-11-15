import { DailyQuiz, QuizQuestion } from './quizService';

interface TopicSpec {
  id: string;
  title: string;
  category: string;
  questions: Array<{
    text: string;
    a: string;
    b: string;
    c: string;
    d: string;
    ans: 'A' | 'B' | 'C' | 'D';
    exp: string;
  }>;
}

const TOPIC_SPECS: Record<string, TopicSpec> = {
  'q-2': {
    id: 'q-2',
    title: 'APIs & Web Services Quiz',
    category: 'Web Dev',
    questions: [
      { text: 'What is an API?', a: 'A database table', b: 'An interface that lets software systems communicate', c: 'A programming keyboard', d: 'A graphics card', ans: 'B', exp: 'Option B is correct. An API (Application Programming Interface) defines rules and protocols for software components to communicate.' },
      { text: 'What is an API endpoint?', a: 'A specific URL/address where an API resource is accessed', b: 'A user login password', c: 'A code compiler', d: 'A hardware storage drive', ans: 'A', exp: 'Option A is correct. An endpoint is a unique digital location/URL where an API receives requests for specific resources.' },
      { text: 'Which HTTP method is specifically designed to retrieve data without side effects?', a: 'POST', b: 'DELETE', c: 'GET', d: 'PATCH', ans: 'C', exp: 'Option C is correct. GET is an idempotent HTTP method used to fetch or retrieve resources from a server.' },
      { text: 'Which HTTP method commonly creates or submits new data to a server?', a: 'GET', b: 'HEAD', c: 'OPTIONS', d: 'POST', ans: 'D', exp: 'Option D is correct. POST is used to send data to a server to create/update a resource.' },
      { text: 'What does JSON stand for in web APIs?', a: 'Java Source Open Network', b: 'JavaScript Object Notation', c: 'Joint System Operation Node', d: 'Java Standard Output Name', ans: 'B', exp: 'Option B is correct. JSON stands for JavaScript Object Notation, a lightweight, text-based data interchange format.' },
      { text: 'What does an HTTP 404 status code indicate?', a: 'Resource Not Found on the server', b: 'Internal Server Error', c: 'Request Succeeded OK', d: 'Unauthorized Access', ans: 'A', exp: 'Option A is correct. HTTP 404 indicates the origin server did not find a current representation for the target resource.' },
      { text: 'What is the primary difference between Authentication and Authorization?', a: 'Both mean encrypting databases', b: 'Authentication verifies identity; Authorization determines access permissions', c: 'Authorization happens before Authentication', d: 'Authentication is for CSS styling only', ans: 'B', exp: 'Option B is correct. Authentication confirms WHO you are, while Authorization specifies WHAT you are permitted to do.' },
      { text: 'What is an API key used for?', a: 'Formatting screen resolutions', b: 'Compressing images', c: 'Identifying and authorizing the calling application', d: 'Cooling server processors', ans: 'C', exp: 'Option C is correct. API keys act as unique identifiers to authenticate and rate-limit API clients.' },
      { text: 'What is rate limiting in API design?', a: 'Restricting the frequency of client requests to protect the server', b: 'Reducing bandwidth speed permanently', c: 'Deleting old databases automatically', d: 'Increasing font sizes on web pages', ans: 'A', exp: 'Option A is correct. Rate limiting prevents API abuse and denial-of-service by capping requests per time window.' },
      { text: 'What is a webhook?', a: 'A hardware cable connecting routers', b: 'An automated HTTP callback triggered by an event in a service', c: 'A password hashing algorithm', d: 'A frontend styling library', ans: 'B', exp: 'Option B is correct. Webhooks deliver real-time data to other applications as soon as specific events occur.' },
      { text: 'Which HTTP status code signifies a successful request?', a: '500', b: '403', c: '200', d: '301', ans: 'C', exp: 'Option C is correct. HTTP 200 OK indicates that the request has succeeded.' },
      { text: 'What is REST in API architecture?', a: 'Representational State Transfer architectural style', b: 'Random Execution Server Table', c: 'Real-time Encrypted Storage Tool', d: 'Remote Error Solution Terminal', ans: 'A', exp: 'Option A is correct. REST (Representational State Transfer) is a software architectural style for distributed hypermedia systems.' },
      { text: 'Why is comprehensive API documentation essential?', a: 'It allows developers to understand endpoints, request schemas, and response formats', b: 'It eliminates the need for unit testing', c: 'It speeds up physical CPU clock cycles', d: 'It converts SQL databases into HTML', ans: 'A', exp: 'Option A is correct. Clear documentation enables engineers to correctly integrate and consume API services.' },
      { text: 'Which header tells the server what media type the client expects in response?', a: 'Host', b: 'User-Agent', c: 'Accept', d: 'Connection', ans: 'C', exp: 'Option C is correct. The Accept HTTP request header indicates which content types the client is able to understand.' },
      { text: 'What is CORS in web services?', a: 'Central Output Resource System', b: 'Cross-Origin Resource Sharing security mechanism', c: 'Cascading Object Rendering Server', d: 'Computer Operation Reset Standard', ans: 'B', exp: 'Option B is correct. CORS is an HTTP-header based mechanism that allows a server to indicate any origins other than its own from which a browser should permit loading resources.' }
    ]
  },
  'q-3': {
    id: 'q-3',
    title: 'Cloud Computing Fundamentals Quiz',
    category: 'Cloud',
    questions: [
      { text: 'What is cloud computing?', a: 'Local hard disk storage only', b: 'On-demand delivery of compute, storage, and database services over the internet', c: 'Physical network cabling', d: 'Offline computer usage', ans: 'B', exp: 'Option B is correct. Cloud computing delivers on-demand IT resources over the Internet with pay-as-you-go pricing.' },
      { text: 'What does IaaS stand for in cloud architecture?', a: 'Infrastructure as a Service', b: 'Internet as a System', c: 'Integrated App Service', d: 'Internal Architecture Storage', ans: 'A', exp: 'Option A is correct. IaaS (Infrastructure as a Service) provides virtualized computing resources over the internet.' },
      { text: 'What does PaaS stand for?', a: 'Public Access System', b: 'Private Application Storage', c: 'Platform as a Service', d: 'Protocol as a Service', ans: 'C', exp: 'Option C is correct. PaaS provides a hardware and software framework for developers to build and run custom applications.' },
      { text: 'What does SaaS stand for?', a: 'System as a Storage', b: 'Secure Application Server', c: 'Server as a Service', d: 'Software as a Service', ans: 'D', exp: 'Option D is correct. SaaS delivers complete software applications over the internet on a subscription basis.' },
      { text: 'What is cloud elasticity?', a: 'The ability to dynamically scale computing resources up or down on demand', b: 'Physical rubber server cables', c: 'Fixed memory that cannot change', d: 'Network latency delays', ans: 'A', exp: 'Option A is correct. Elasticity allows cloud systems to match resource allocation to current workload demands automatically.' },
      { text: 'What is a Public Cloud?', a: 'A personal USB flash drive', b: 'Third-party cloud infrastructure shared across multiple tenant organizations', c: 'A local offline home network', d: 'A private single-company datacenter', ans: 'B', exp: 'Option B is correct. Public clouds are owned and operated by third-party cloud service providers delivering compute resources over the web.' },
      { text: 'What is a Private Cloud?', a: 'Cloud infrastructure provisioned for exclusive use by a single organization', b: 'Public airport Wi-Fi network', c: 'Open-source code repository', d: 'A commercial shared web host', ans: 'A', exp: 'Option A is correct. Private cloud consists of cloud computing resources used exclusively by one business or organization.' },
      { text: 'What is a Hybrid Cloud?', a: 'A combination of public and private cloud environments sharing data and applications', b: 'An electric vehicle charging network', c: 'A dual-monitor workstation', d: 'A hybrid programming language', ans: 'A', exp: 'Option A is correct. Hybrid cloud connects private infrastructure with public cloud services.' },
      { text: 'What is an Availability Zone (AZ)?', a: 'A global time zone setting', b: 'Browser cache memory', c: 'Isolated, redundant data center facilities within a cloud geographic region', d: 'A USB port interface', ans: 'C', exp: 'Option C is correct. Availability Zones provide fault isolation and high availability within a cloud region.' },
      { text: 'What is Serverless computing?', a: 'Computing without any hardware existing', b: 'Execution model where the cloud provider manages infrastructure provisioning and scaling', c: 'Running software completely offline', d: 'Bluetooth wireless pairing', ans: 'B', exp: 'Option B is correct. Serverless abstracts server management, automatically executing code in response to events.' },
      { text: 'What is Object Storage primarily used for in the cloud?', a: 'Storing massive unstructured data like images, videos, and backups with high durability', b: 'CPU L1 cache registers', c: 'Relational database indexing only', d: 'Displaying desktop wallpapers', ans: 'A', exp: 'Option A is correct. Object storage (e.g. AWS S3, Google Cloud Storage) stores unstructured data objects at massive scale.' },
      { text: 'What is the primary function of a Cloud Load Balancer?', a: 'Measuring physical hardware weight', b: 'Distributing incoming application traffic across multiple healthy target servers', c: 'Charging device batteries', d: 'Speeding up keyboard typing', ans: 'B', exp: 'Option B is correct. Load balancers distribute traffic across multiple servers to ensure high availability and reliability.' },
      { text: 'What is Cloud Auto-Scaling?', a: 'Automatically adjusting active compute instances based on real-time traffic demand', b: 'Increasing screen font size during presentations', c: 'Formatting hard drives periodically', d: 'Upgrading monitor brightness', ans: 'A', exp: 'Option A is correct. Auto-scaling adds or removes compute instances automatically to maintain performance.' },
      { text: 'Which cloud deployment model provides the highest level of regulatory control and isolation?', a: 'Public Multi-tenant Cloud', b: 'Anonymous Proxy Network', c: 'Dedicated Private Cloud / On-Premise', d: 'Public Community Forum', ans: 'C', exp: 'Option C is correct. Dedicated private clouds provide complete control and compliance isolation for sensitive enterprise workloads.' },
      { text: 'What is a Cloud Region?', a: 'A separate geographical location in the world containing multiple Availability Zones', b: 'A country top-level domain name', c: 'A local neighborhood Wi-Fi hotspot', d: 'A regional keyboard layout', ans: 'A', exp: 'Option A is correct. A cloud region is a separate geographic area containing multiple isolated data center locations.' }
    ]
  }
};

function getUuid(id: string, suffix?: string): string {
  if (id.includes('-') && id.length === 36) {
    return suffix ? id.substring(0, 36 - suffix.length) + suffix : id;
  }
  
  let cleanNum = '0002';
  if (id.startsWith('q-')) {
    const num = id.split('-')[1];
    if (num) {
      cleanNum = num.padStart(4, '0');
    }
  }
  
  const qNumStr = suffix ? suffix.padStart(12, '0') : '000000000000';
  return `00000000-0000-0000-${cleanNum}-${qNumStr}`;
}

export function getTopicQuiz(quizId: string, title?: string): DailyQuiz {
  const spec = TOPIC_SPECS[quizId];
  const cleanQuizId = getUuid(quizId);

  if (spec) {
    return {
      id: cleanQuizId,
      quiz_date: new Date().toISOString().split('T')[0],
      title: spec.title,
      description: `Test your mastery with 15 focused questions on ${spec.title}. Earn Task Tokens!`,
      status: 'published',
      total_questions: spec.questions.length,
      coins_reward: 50,
      questions: spec.questions.map((q, idx) => ({
        id: getUuid(quizId, String(idx + 1)),
        quiz_id: cleanQuizId,
        question_number: idx + 1,
        question_text: q.text,
        option_a: q.a,
        option_b: q.b,
        option_c: q.c,
        option_d: q.d,
        correct_option: q.ans,
        explanation: q.exp,
      })),
    };
  }

  // Dynamic Generator for any topic title to produce 15 unique, distinct MCQs with balanced A, B, C, D distribution
  const topicName = title || 'Technical Engineering';
  const questions: QuizQuestion[] = [];
  
  const TEMPLATES = [
    {
      q: `Which statement best defines ${topicName}?`,
      correct: `Core architectural principles, standards, and lifecycle management of ${topicName}.`,
      d1: `A deprecated 8-bit legacy communication standard.`,
      d2: `An operating system desktop display configuration.`,
      d3: `A hardware power cord specification.`,
      exp: `Understanding the core architecture and operational principles of ${topicName} is fundamental for scalable engineering.`
    },
    {
      q: `What is a primary engineering benefit of properly implementing ${topicName}?`,
      correct: `Increased system reliability, fault tolerance, and computational efficiency.`,
      d1: `Higher manual data entry and hardware power consumption.`,
      d2: `Reduced cross-platform compatibility and stability.`,
      d3: `Complete elimination of software unit tests.`,
      exp: `Proper implementation enhances reliability and computational throughput while minimizing downtime.`
    },
    {
      q: `In ${topicName}, what is the primary role of the orchestration engine?`,
      correct: `Coordinating workflow execution, resource scheduling, and data consistency.`,
      d1: `Storing temporary browser cookies exclusively.`,
      d2: `Measuring physical cooling fan rotation speeds.`,
      d3: `Formatting printed physical documents.`,
      exp: `The orchestration engine manages workflow state transitions, execution tasks, and resource allocation.`
    },
    {
      q: `How does ${topicName} maintain data security and end-to-end integrity?`,
      correct: `Through standardized authentication, role-based authorization, and TLS encryption.`,
      d1: `By broadcasting unencrypted data packets across public networks.`,
      d2: `By storing unhashed credentials in public directories.`,
      d3: `By disabling firewall rules and access tokens.`,
      exp: `Robust access controls, encryption at rest and in transit ensure system security and compliance.`
    },
    {
      q: `What is the standard procedure when an unexpected runtime exception occurs in ${topicName}?`,
      correct: `Catching the exception and executing graceful fallback mechanisms with diagnostic logging.`,
      d1: `Immediately turning off the host device display.`,
      d2: `Deleting all local application configurations.`,
      d3: `Restarting physical power supplies unconditionally.`,
      exp: `Graceful exception handling preserves system uptime and generates actionable error logs.`
    },
    {
      q: `Which metric is most critical for evaluating the performance of ${topicName}?`,
      correct: `Request latency, throughput, and system resource utilization efficiency.`,
      d1: `Physical weight of server rack mounting brackets.`,
      d2: `The background wallpaper color of client workstations.`,
      d3: `Keyboard language layout selection.`,
      exp: `Response latency and throughput measure actual computational efficiency and user satisfaction.`
    },
    {
      q: `What is a recognized best practice when deploying ${topicName} in production?`,
      correct: `Adhering to the principle of least privilege, automated CI/CD, and continuous monitoring.`,
      d1: `Hardcoding sensitive credentials directly in public source repositories.`,
      d2: `Disabling all monitoring alerts and health probes.`,
      d3: `Skipping staging environment testing before deployment.`,
      exp: `Automated pipelines and least privilege access prevent configuration drift and security vulnerabilities.`
    },
    {
      q: `How is state persistence managed in a modern ${topicName} distributed system?`,
      correct: `Using resilient, synchronized datastores and distributed caching layers.`,
      d1: `By writing plain text notes to volatile memory without backups.`,
      d2: `By resetting system clocks every 60 seconds.`,
      d3: `By ignoring database transactions and locks.`,
      exp: `Distributed caching and reliable datastores maintain state consistency across multiple nodes.`
    },
    {
      q: `What does horizontal scaling achieve in ${topicName}?`,
      correct: `Distributing higher user traffic across multiple parallel compute instances.`,
      d1: `Purchasing a physically wider monitor screen.`,
      d2: `Increasing operating system font size across applications.`,
      d3: `Manually replacing CPU thermal paste.`,
      exp: `Horizontal scaling adds compute nodes to handle increased workload demands smoothly.`
    },
    {
      q: `Why is automated testing indispensable for ${topicName}?`,
      correct: `It prevents regressions, verifies contract compliance, and accelerates release velocity.`,
      d1: `It artificially slows down developer delivery timelines.`,
      d2: `It eliminates the need for technical documentation.`,
      d3: `It creates dummy user accounts in production.`,
      exp: `Automated test suites catch breaking changes early and guarantee software correctness.`
    },
    {
      q: `What is the role of caching in optimizing ${topicName}?`,
      correct: `Serving frequently accessed data with sub-millisecond latency to decrease database load.`,
      d1: `Permanently deleting archival database records.`,
      d2: `Encrypting outgoing monitor video signals.`,
      d3: `Formatting secondary storage devices.`,
      exp: `In-memory caching accelerates data retrieval and shields backend databases from high query volumes.`
    },
    {
      q: `Which tool or mechanism is typically used to inspect operational logs in ${topicName}?`,
      correct: `Centralized logging dashboards and streaming telemetry aggregators.`,
      d1: `Standard desktop image editors.`,
      d2: `Physical audio volume controls.`,
      d3: `Basic desktop calculator programs.`,
      exp: `Centralized logging aggregates real-time event logs for debugging and operational visibility.`
    },
    {
      q: `What is the crucial final phase in a successful ${topicName} release pipeline?`,
      correct: `Automated health check verification, canary analysis, and active metric monitoring.`,
      d1: `Deleting all source code branches immediately.`,
      d2: `Disconnecting physical ethernet cables.`,
      d3: `Reinstalling the host operating system.`,
      exp: `Post-release verification ensures that deployed updates function properly in live production.`
    },
    {
      q: `How does rate limiting protect a ${topicName} infrastructure?`,
      correct: `It prevents denial-of-service abuse by throttling anomalous request spikes per client.`,
      d1: `It restricts network bandwidth to 10 kbps permanently.`,
      d2: `It limits the number of code lines engineers can write.`,
      d3: `It forces user passwords to expire every 5 minutes.`,
      exp: `Rate limiting protects server capacity from malicious spikes and abusive traffic patterns.`
    },
    {
      q: `What is the primary purpose of version control in ${topicName}?`,
      correct: `Tracking historical modifications, facilitating team collaboration, and enabling rollbacks.`,
      d1: `Increasing local hard drive temperature.`,
      d2: `Replacing database backups with screenshots.`,
      d3: `Converting application code into plain HTML.`,
      exp: `Version control provides an audit trail of changes and enables safe collaboration among engineering teams.`
    }
  ];

  const TARGET_OPTIONS: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D', 'B', 'A', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C'];

  TEMPLATES.forEach((tmpl, idx) => {
    const targetOpt = TARGET_OPTIONS[idx % TARGET_OPTIONS.length];
    const dists = [tmpl.d1, tmpl.d2, tmpl.d3];
    
    let a = '', b = '', c = '', d = '';
    if (targetOpt === 'A') {
      a = tmpl.correct; b = dists[0]; c = dists[1]; d = dists[2];
    } else if (targetOpt === 'B') {
      a = dists[0]; b = tmpl.correct; c = dists[1]; d = dists[2];
    } else if (targetOpt === 'C') {
      a = dists[0]; b = dists[1]; c = tmpl.correct; d = dists[2];
    } else {
      a = dists[0]; b = dists[1]; c = dists[2]; d = tmpl.correct;
    }

    questions.push({
      id: getUuid(quizId, String(idx + 1)),
      quiz_id: cleanQuizId,
      question_number: idx + 1,
      question_text: `Q${idx + 1}. ${tmpl.q}`,
      option_a: a,
      option_b: b,
      option_c: c,
      option_d: d,
      correct_option: targetOpt,
      explanation: `Option ${targetOpt} is correct. ${tmpl.exp}`,
    });
  });

  return {
    id: cleanQuizId,
    quiz_date: new Date().toISOString().split('T')[0],
    title: topicName,
    description: `Master ${topicName} with 15 distinct, topic-focused practice MCQs. Earn Task Tokens!`,
    status: 'published',
    total_questions: 15,
    coins_reward: 50,
    questions,
  };
}
