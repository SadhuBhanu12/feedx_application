const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '../scripts/seed_content_library.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Replace the fallback template generator in scripts/seed_content_library.js
const oldGeneratorRegex = /\/\/ Domain tailored generator for other topics[\s\S]*?return questions;\n\s*\}/;

const newGeneratorCode = `// Domain tailored generator for other topics
    const templates = [
      { q: \`What is the primary definition of \${cleanTitle}?\`, c: \`A core technology or architectural framework designed for managing and executing \${cleanTitle} processes.\` },
      { q: \`Which key benefit is provided by \${cleanTitle}?\`, c: \`Improved operational efficiency, system scalability, modularity, and resource reliability.\` },
      { q: \`What is a fundamental requirement when implementing \${cleanTitle}?\`, c: \`Proper environment configuration, robust security protocols, and standardized interfaces.\` },
      { q: \`How does \${cleanTitle} handle execution and data states?\`, c: \`By utilizing structured schemas, optimized execution pipelines, and state synchronization.\` },
      { q: \`What is a recommended best practice when deploying \${cleanTitle}?\`, c: \`Conducting automated testing, continuous integration checks, and real-time monitoring.\` },
      { q: \`Which layer or component plays a vital role in \${cleanTitle}?\`, c: \`The core execution engine and central protocol controller.\` },
      { q: \`What is a common challenge or bottleneck in \${cleanTitle}?\`, c: \`Managing system state synchronization, resource contention, and network latency under heavy load.\` },
      { q: \`How is security typically enforced within \${cleanTitle}?\`, c: \`Through identity authentication, role-based access control, and end-to-end data encryption.\` },
      { q: \`Which metric is critical for measuring the performance of \${cleanTitle}?\`, c: \`Response latency, throughput rate, CPU/memory utilization, and error rates.\` },
      { q: \`What is the role of versioning in \${cleanTitle}?\`, c: \`To support safe software updates, maintain backward compatibility, and enable quick rollbacks.\` },
      { q: \`In what scenario is \${cleanTitle} most effectively applied?\`, c: \`In modern scalable enterprise systems requiring structured workflows and high availability.\` },
      { q: \`Which interface or tool is standard for interacting with \${cleanTitle}?\`, c: \`Dedicated command-line tools, SDK APIs, and administration dashboards.\` },
      { q: \`What is the initial phase when developing with \${cleanTitle}?\`, c: \`Defining system requirements, environment setup, and dependency configuration.\` },
      { q: \`Which debugging technique is recommended for \${cleanTitle}?\`, c: \`Inspecting diagnostic trace logs, using debugger tools, and analyzing stack traces.\` },
      { q: \`What is the overall goal of mastering \${cleanTitle}?\`, c: \`To design, build, and maintain production-grade, fault-tolerant technology solutions.\` }
    ];

    // Domain-specific realistic distractors bank
    const categoryDistractors = {
      'DevOps': [
        ['Executing unindexed raw SQL join queries on legacy tables', 'Manually editing physical DNS host files on every client node', 'Disabling network firewalls and SSL certificates globally'],
        ['Compiling C source code to assembly without version control', 'Storing unencrypted database passwords in client HTML attributes', 'Hardcoding static IP addresses into client-side CSS files'],
        ['Formatting physical hard disk partitions using fdisk', 'Bypassing HTTP CORS policy settings globally', 'Directly manipulating CPU register pointers in kernel space']
      ],
      'Web Dev': [
        ['Formatting physical hard drive partitions using fdisk', 'Executing kernel interrupt service routines in assembly', 'Bypassing SSL certificates and CORS origin controls'],
        ['Calculating mechanical gear ratios and shaft torque', 'Compiling Java bytecode to Android DEX format', 'Soldering copper trace lines on multi-layer PCBs'],
        ['Directly editing raw database binary block files', 'Increasing CPU fan speed to fix JavaScript memory leaks', 'Running unmonitored background tasks without process supervision']
      ],
      'Mobile Dev': [
        ['Mounting physical EXT4 Linux hard drive partitions', 'Executing SQL DDL schema migration queries', 'Calculating thermodynamic enthalpy changes'],
        ['Compiling C++ code to bare-metal microcontroller hex files', 'Configuring BGP router peering connections', 'Bypassing mobile OS permission prompts by disabling sandbox controls'],
        ['Soldering surface-mount resistors on circuit boards', 'Writing raw CSS flexbox grid layouts', 'Storing private API secrets in unencrypted public assets']
      ],
      'Cloud': [
        ['Executing raw SQL DDL queries on local sqlite files', 'Soldering copper wires on breadboards', 'Writing inline CSS styling in HTML documents'],
        ['Bypassing cloud IAM access policies using hardcoded root keys', 'Manually rebooting physical server racks during peaks', 'Formatting client hard drives automatically during deployments'],
        ['Compiling C source code into assembly binaries', 'Disabling network security groups globally', 'Storing unencrypted keys in public version control']
      ],
      'Security': [
        ['Converting vector SVG graphics to JPEG files', 'Executing Python list comprehensions on local arrays', 'Hardcoding static credentials in open-source client code'],
        ['Writing CSS flexbox alignment rules', 'Creating React component state hooks', 'Disabling multi-factor authentication across all admin accounts'],
        ['Formatting PostgreSQL database tables', 'Calculating AC motor torque values', 'Disabling SSL/TLS encryption for faster packet transmission']
      ],
      'OS': [
        ['Declaring React useState hooks inside functional components', 'Writing CSS Flexbox grid layout rules', 'Publishing NPM package modules to public registries'],
        ['Bypassing file system read/write permissions for all root users', 'Running unmonitored background tasks without process supervision', 'Creating SQL INNER JOIN queries on unindexed tables'],
        ['Soldering microcontrollers on breadboards', 'Configuring Webpack loader configurations', 'Storing plaintext credentials in public environment files']
      ],
      'Networking': [
        ['Exporting SVG graphics to PNG format', 'Executing Python list comprehensions', 'Disabling network firewalls to accelerate socket speed'],
        ['Writing CSS grid layout rules', 'Soldering surface-mount capacitors on PCBs', 'Bypassing packet validation headers during transmission'],
        ['Formatting local hard drives using fdisk', 'Calculating fluid flow velocity in pipes', 'Hardcoding static gateway routes without failover protection']
      ],
      'Programming': [
        ['Configuring Kubernetes Ingress controller YAML manifests', 'Allocating AWS S3 bucket storage instances', 'Setting up BGP router peering connections'],
        ['Broadcasting wireless 5GHz WiFi SSID signals', 'Storing plain-text passwords in unencrypted global variables', 'Hardcoding static binary files without backup'],
        ['Bypassing compiler type-checking rules', 'Soldering microcontrollers on breadboards', 'Executing raw disk sector wipes during runtime']
      ],
      'Databases': [
        ['Increasing physical RAM voltage during query execution', 'Rendering 3D WebGL graphics inside database tables', 'Sending HTTP 404 response codes to connected clients'],
        ['Converting binary executable files into CSV spreadsheets', 'Executing unvalidated user input via raw string concatenation', 'Disabling database transaction logs during write spikes'],
        ['Compiling C++ code to assembly', 'Writing CSS grid layouts for web pages', 'Configuring Webpack bundler plugins']
      ],
      'Backend': [
        ['Rendering HTML canvas animations', 'Calculating mechanical shaft torque', 'Storing database secrets in client browser localStorage'],
        ['Bypassing authentication middleware on public routes', 'Disabling API rate limiting during high traffic load', 'Running unmonitored background workers without retry queues'],
        ['Soldering PCB components', 'Writing CSS media queries', 'Compiling Java code to C binaries']
      ],
      'DSA': [
        ['Configuring Kubernetes cluster Ingress controllers', 'Setting up BGP router peering connections', 'Broadcasting WiFi SSID signals across access points'],
        ['Allocating cloud S3 storage buckets', 'Using linear search on unsorted arrays without indexing', 'Bypassing algorithm complexity bounds'],
        ['Writing inline CSS styles', 'Soldering resistors on breadboards', 'Disabling memory garbage collection']
      ],
      'AI': [
        ['Soldering multi-layer PCB copper circuit boards', 'Configuring FTP file transfer servers on port 21', 'Drawing 2D vector shapes on HTML5 canvas elements'],
        ['Overfitting models by training on unvalidated random noise', 'Using unnormalized raw datasets without feature scaling', 'Bypassing model evaluation validation metrics'],
        ['Writing CSS flexbox rules', 'Formatting PostgreSQL tables', 'Compiling C source code']
      ],
      'ML': [
        ['Configuring NGINX reverse proxy servers', 'Executing SQL alter table statements', 'Training models without cross-validation or holdout test sets'],
        ['Using raw unscaled data with extreme outliers', 'Ignoring feature correlation during feature selection', 'Bypassing hyperparameter tuning'],
        ['Soldering circuit components', 'Writing HTML forms', 'Creating React components']
      ],
      'IoT': [
        ['Deploying Kubernetes pods across multi-cloud clusters', 'Writing React Native flex layout styles', 'Parsing JSON Web Tokens in client request headers'],
        ['Operating components beyond recommended voltage and thermal limits', 'Ignoring signal noise filtering in analog-to-digital conversions', 'Disabling hardware watchdog timers'],
        ['Executing SQL JOIN queries', 'Writing CSS stylesheets', 'Compiling TypeScript code']
      ],
      'Electronics': [
        ['Deploying Kubernetes cluster pods', 'Writing React Native layout components', 'Parsing JWT tokens in API requests'],
        ['Exceeding component power ratings without heatsinks', 'Ignoring decoupling capacitors on IC power pins', 'Operating logic gates outside voltage thresholds'],
        ['Executing SQL queries', 'Writing CSS rules', 'Creating NPM packages']
      ],
      'Electrical': [
        ['Writing React component state hooks', 'Parsing JSON web tokens', 'Operating electrical machines above rated thermal limits'],
        ['Ignoring power factor correction in inductive loads', 'Bypassing circuit breakers and overcurrent protection', 'Running transformers without oil cooling'],
        ['Creating HTML web pages', 'Executing SQL queries', 'Configuring Docker containers']
      ],
      'Mechanical': [
        ['Importing NPM package dependencies in Node.js', 'Declaring React component props interfaces', 'Querying MongoDB document collections'],
        ['Exceeding material yield strength without safety factors', 'Ignoring thermal expansion stress during structural assembly', 'Operating fluid systems above cavitation limits'],
        ['Writing CSS stylesheets', 'Parsing JSON payloads', 'Setting up Git repositories']
      ],
      'Civil': [
        ['Writing JavaScript async/await promises', 'Creating CSS grid layouts', 'Querying SQL database tables'],
        ['Ignoring soil bearing capacity during foundation design', 'Exceeding structural load limits without safety factors', 'Bypassing concrete curing time requirements'],
        ['Configuring Webpack bundlers', 'Setting up Docker containers', 'Soldering circuit boards']
      ]
    };

    const defaultDistractorSets = [
      ['Executing unindexed SQL query operations', 'Manually editing system host files on client nodes', 'Disabling network security firewalls globally'],
      ['Compiling raw source code without version control', 'Storing unencrypted database passwords in client HTML', 'Hardcoding static IP addresses into CSS files'],
      ['Formatting physical hard disk partitions using fdisk', 'Bypassing HTTP security policies globally', 'Directly manipulating CPU register pointers']
    ];

    const category = ql.category || 'Programming';
    const distractorBank = categoryDistractors[category] || defaultDistractorSets;

    for (let i = 0; i < count; i++) {
      const template = templates[i % templates.length];
      const correctText = template.c;
      const setIdx = i % distractorBank.length;
      const distSet = distractorBank[setIdx];

      const d1 = distSet[0];
      const d2 = distSet[1];
      const d3 = distSet[2];

      const options = [correctText, d1, d2, d3];
      seed = (seed * 9301 + 49297) % 233280;
      const correctIdx = Math.floor((seed / 233280) * 4);

      const temp = options[0];
      options[0] = options[correctIdx];
      options[correctIdx] = temp;

      const optLetters = ['A', 'B', 'C', 'D'];
      const correctLetter = optLetters[correctIdx];

      questions.push({
        question_number: i + 1,
        question_text: \`Q\${i + 1}. \${template.q}\`,
        option_a: options[0],
        option_b: options[1],
        option_c: options[2],
        option_d: options[3],
        correct_option: correctLetter,
        explanation: \`Option \${correctLetter} is correct. \${correctText}\`
      });
    }
  }

  return questions;
}`;

scriptContent = scriptContent.replace(oldGeneratorRegex, newGeneratorCode);
fs.writeFileSync(scriptPath, scriptContent);
console.log('Successfully updated scripts/seed_content_library.js with domain-realistic distractors!');
