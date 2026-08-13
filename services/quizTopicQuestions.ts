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
      { text: 'What is an API?', a: 'An interface that lets software systems communicate', b: 'A database table', c: 'A programming keyboard', d: 'A graphics card', ans: 'A', exp: 'An API defines how software components communicate.' },
      { text: 'What is an API endpoint?', a: 'A specific address for an API resource or action', b: 'A password', c: 'A compiler', d: 'A storage device', ans: 'A', exp: 'An endpoint is a defined API URL/address for a resource or operation.' },
      { text: 'Which HTTP method commonly retrieves data?', a: 'GET', b: 'POST', c: 'DELETE', d: 'PATCH', ans: 'A', exp: 'GET is commonly used to retrieve resources.' },
      { text: 'Which HTTP method commonly creates/submits data?', a: 'POST', b: 'GET', c: 'HEAD', d: 'OPTIONS', ans: 'A', exp: 'POST is commonly used to submit or create data.' },
      { text: 'What is JSON?', a: 'A structured data format commonly used by web APIs', b: 'A network cable', c: 'A CPU', d: 'A firewall', ans: 'A', exp: 'JSON is a lightweight structured data format.' },
      { text: 'What does an HTTP status code communicate?', a: 'The outcome of a request', b: 'A user’s password', c: 'A database schema', d: 'A screen resolution', ans: 'A', exp: 'Status codes indicate the result of an HTTP request.' },
      { text: 'What is authentication?', a: 'Verifying who a user or system is', b: 'Choosing a UI color', c: 'Compressing images', d: 'Sorting a database', ans: 'A', exp: 'Authentication verifies identity.' },
      { text: 'What is authorization?', a: 'Determining what an authenticated user can access', b: 'Verifying an IP cable', c: 'Creating HTML', d: 'Encrypting a monitor', ans: 'A', exp: 'Authorization controls permissions after identity is established.' },
      { text: 'What is a request?', a: 'A message sent by a client to a server', b: 'A database table', c: 'A programming language', d: 'A hard disk', ans: 'A', exp: 'A request asks a server to perform an operation or return data.' },
      { text: 'What is a response?', a: 'A message returned by a server', b: 'A Git branch', c: 'A password manager', d: 'A circuit', ans: 'A', exp: 'A server sends a response back to the client.' },
      { text: 'What is an API key?', a: 'A credential used by APIs to identify or authorize a caller', b: 'A keyboard key', c: 'A database column', d: 'A router port', ans: 'A', exp: 'Some APIs use API keys as credentials.' },
      { text: 'What is rate limiting?', a: 'Restricting how frequently requests can be made', b: 'Encrypting all files', c: 'Changing a domain name', d: 'Creating a UI button', ans: 'A', exp: 'Rate limiting controls request frequency to protect services.' },
      { text: 'What is an API header?', a: 'Metadata sent with an HTTP request or response', b: 'A database row', c: 'A mobile screen', d: 'A Git tag', ans: 'A', exp: 'Headers carry metadata such as content type or authorization.' },
      { text: 'What is a webhook?', a: 'A mechanism for sending event notifications to another service', b: 'A password hash', c: 'A CSS selector', d: 'A database index', ans: 'A', exp: 'Webhooks notify another service when an event occurs.' },
      { text: 'Why is API documentation important?', a: 'It explains endpoints, inputs, outputs and usage', b: 'It increases CPU speed', c: 'It replaces testing', d: 'It stores photos', ans: 'A', exp: 'Documentation tells developers how to correctly use an API.' }
    ]
  },
  'q-3': {
    id: 'q-3',
    title: 'Cloud Computing Fundamentals Quiz',
    category: 'Cloud',
    questions: [
      { text: 'What is cloud computing?', a: 'On-demand delivery of compute, storage, and DB over internet', b: 'Local hard disk storage', c: 'Physical network cabling', d: 'Computer screen resolution', ans: 'A', exp: 'Cloud delivers computing services over the internet.' },
      { text: 'What does IaaS stand for?', a: 'Infrastructure as a Service', b: 'Internet as a System', c: 'Integrated App Service', d: 'Internal Architecture Storage', ans: 'A', exp: 'IaaS provides raw infrastructure like virtual machines.' },
      { text: 'What does PaaS stand for?', a: 'Platform as a Service', b: 'Public Access System', c: 'Private Application Storage', d: 'Protocol as a Service', ans: 'A', exp: 'PaaS provides execution environments for developers.' },
      { text: 'What does SaaS stand for?', a: 'Software as a Service', b: 'System as a Storage', c: 'Secure Application Server', d: 'Server as a Service', ans: 'A', exp: 'SaaS provides ready-to-use software applications.' },
      { text: 'What is cloud elasticity?', a: 'The ability to dynamically scale resources up or down', b: 'Physical rubber cables', c: 'Fixed server memory', d: 'Network latency', ans: 'A', exp: 'Elasticity allows rapid resource scaling based on demand.' },
      { text: 'What is a Public Cloud?', a: 'Cloud infrastructure shared across multiple organizations', b: 'A personal USB drive', c: 'Private home network', d: 'Offline server room', ans: 'A', exp: 'Public clouds are owned and operated by third-party providers.' },
      { text: 'What is a Private Cloud?', a: 'Cloud infrastructure used exclusively by one single organization', b: 'Public Wi-Fi network', c: 'Hosted blog site', d: 'Open source software', ans: 'A', exp: 'Private clouds offer dedicated infrastructure for one entity.' },
      { text: 'What is a Hybrid Cloud?', a: 'A combination of public and private cloud environments', b: 'A hybrid car engine', c: 'Wireless router', d: 'Dual monitor setup', ans: 'A', exp: 'Hybrid clouds connect private and public environments.' },
      { text: 'What is an Availability Zone?', a: 'Isolated data center locations within a cloud region', b: 'Time zone setting', c: 'Browser cache area', d: 'USB port slot', ans: 'A', exp: 'AZs provide fault isolation within cloud regions.' },
      { text: 'What is Serverless computing?', a: 'Cloud execution where cloud provider manages server infrastructure', b: 'Computing without any hardware', c: 'Offline computer usage', d: 'Bluetooth communication', ans: 'A', exp: 'Serverless abstracts server management away from developers.' },
      { text: 'What is Object Storage in cloud?', a: 'Scalable storage for unstructured data like images and backups', b: 'CPU RAM memory', c: 'Relational SQL table', d: 'Printer spooler', ans: 'A', exp: 'Object storage handles massive unstructured data files.' },
      { text: 'What is Load Balancing?', a: 'Distributing incoming traffic across multiple target servers', b: 'Weighing computer hardware', c: 'Charging laptop battery', d: 'Cleaning cooling fans', ans: 'A', exp: 'Load balancers prevent single server overload.' },
      { text: 'What is Cloud Migration?', a: 'Moving data and applications from local servers to the cloud', b: 'Travelling with a laptop', c: 'Changing internet providers', d: 'Upgrading monitor screens', ans: 'A', exp: 'Migration shifts digital assets to cloud infrastructure.' },
      { text: 'What is a Cloud Region?', a: 'A geographical area containing multiple Availability Zones', b: 'A country code domain', c: 'A local suburb', d: 'A WiFi signal range', ans: 'A', exp: 'Regions group redundant data centers geographically.' },
      { text: 'Why use cloud auto-scaling?', a: 'To automatically adjust server capacity based on real-time load', b: 'To increase font sizes', c: 'To shut down the office', d: 'To format hard drives', ans: 'A', exp: 'Auto-scaling maintains performance during traffic spikes.' }
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
      description: `Test your knowledge with 15 questions on ${spec.title}. Earn Gold Coins!`,
      status: 'published',
      total_questions: spec.questions.length,
      coins_reward: 15,
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

  // Dynamic Generator for any topic title to produce 15 unique, distinct MCQs
  const topicName = title || 'Technical Concepts';
  const questions: QuizQuestion[] = [];
  const ASPECTS = [
    { text: `Which option best defines ${topicName}?`, a: `Core standard definition and architecture of ${topicName}`, b: 'An unrelated legacy protocol', c: 'Hardware display resolution setting', d: 'Deprecated database driver', ans: 'A' as const, exp: `Option A correctly states the core concept of ${topicName}.` },
    { text: `What is a primary advantage of utilizing ${topicName}?`, a: 'Increased system reliability, efficiency, and scalability', b: 'Higher physical power consumption', c: 'Increased manual data entry requirement', d: 'Reduced network compatibility', ans: 'A' as const, exp: `Utilizing ${topicName} improves performance and architectural scalability.` },
    { text: `In ${topicName}, what is the main responsibility of the primary module?`, a: 'Processing and orchestrating core data workflows', b: 'Storing temporary browser cookies only', c: 'Formatting physical printer pages', d: 'Measuring CPU fan speed', ans: 'A' as const, exp: 'The primary module manages workflow execution and data integrity.' },
    { text: `Which protocol or standard is most closely associated with ${topicName}?`, a: 'Industry-standard open communication specs', b: 'Analog dial-up modem signals', c: '8-bit audio waveform encoding', d: 'Legacy serial port pinouts', ans: 'A' as const, exp: 'Modern applications rely on standardized open protocols.' },
    { text: `What occurs when an unhandled error happens in ${topicName}?`, a: 'Exception handlers trigger graceful fallback procedures', b: 'The motherboard physically resets', c: 'The display screen turns off', d: 'All local files are deleted', ans: 'A' as const, exp: 'Exception handling ensures system stability during errors.' },
    { text: `How does ${topicName} maintain data security and integrity?`, a: 'Via strict authentication, authorization, and encryption', b: 'By disabling all firewall rules', c: 'By storing plain-text passwords', d: 'By broadcasting data over open networks', ans: 'A' as const, exp: 'Security measures protect data against unauthorized access.' },
    { text: `What is a common best practice when configuring ${topicName}?`, a: 'Follow principle of least privilege and modular structure', b: 'Hardcode sensitive credentials in source code', c: 'Disable logging and monitoring', d: 'Skip testing environments', ans: 'A' as const, exp: 'Following best practices prevents vulnerabilities and errors.' },
    { text: `Which performance metric is most crucial for evaluating ${topicName}?`, a: 'Response latency and throughput efficiency', b: 'Physical weight of server rack', c: 'Color scheme of user desktop', d: 'Keyboard layout region', ans: 'A' as const, exp: 'Latency and throughput determine operational efficiency.' },
    { text: `How is state managed in a distributed ${topicName} deployment?`, a: 'Through synchronized cache or centralized datastores', b: 'By writing text files to random desktop folders', c: 'By restarting servers every minute', d: 'By ignoring state changes', ans: 'A' as const, exp: 'Centralized datastores ensure state consistency across nodes.' },
    { text: `What is the role of continuous monitoring in ${topicName}?`, a: 'To detect performance bottlenecks and alert anomalies', b: 'To increase internet subscription costs', c: 'To change screen wallpapers automatically', d: 'To block valid user logins', ans: 'A' as const, exp: 'Monitoring provides real-time visibility into system health.' },
    { text: `In ${topicName}, what does horizontal scaling involve?`, a: 'Adding more instance nodes to distribute load', b: 'Replacing RAM chips manually', c: 'Buying a wider computer monitor', d: 'Increasing font size across apps', ans: 'A' as const, exp: 'Horizontal scaling adds nodes to handle higher volume.' },
    { text: `Why is automated testing essential for ${topicName}?`, a: 'To catch regressions early and ensure code quality', b: 'To slow down development speed', c: 'To replace software documentation', d: 'To generate fake user accounts', ans: 'A' as const, exp: 'Automated testing guarantees software stability before release.' },
    { text: `What is the purpose of caching in ${topicName}?`, a: 'To serve frequent requests faster by storing temporary data', b: 'To permanently delete old database records', c: 'To encrypt all outgoing network packets', d: 'To format secondary hard drives', ans: 'A' as const, exp: 'Caching reduces database load and speeds up response time.' },
    { text: `Which tool or command is used to inspect ${topicName} activity logs?`, a: 'Standard CLI log streams or central logging dashboards', b: 'Microsoft Paint', c: 'Calculator app', d: 'Device volume slider', ans: 'A' as const, exp: 'Log streams display operational diagnostics and errors.' },
    { text: `What is the final step when deploying updates to ${topicName}?`, a: 'Verification, health check, and monitoring post-release', b: 'Deleting repository source code', c: 'Unplugging network cables', d: 'Reinstalling operating system', ans: 'A' as const, exp: 'Post-release health checks confirm successful deployment.' },
  ];

  ASPECTS.forEach((asp, idx) => {
    questions.push({
      id: getUuid(quizId, String(idx + 1)),
      quiz_id: cleanQuizId,
      question_number: idx + 1,
      question_text: asp.text,
      option_a: asp.a,
      option_b: asp.b,
      option_c: asp.c,
      option_d: asp.d,
      correct_option: asp.ans,
      explanation: asp.exp,
    });
  });

  return {
    id: cleanQuizId,
    quiz_date: new Date().toISOString().split('T')[0],
    title: topicName,
    description: `Master ${topicName} with 15 distinct, topic-focused practice MCQs.`,
    status: 'published',
    total_questions: 15,
    coins_reward: 15,
    questions,
  };
}
