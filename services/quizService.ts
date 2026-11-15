import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { awardActivity, getCalendarDateString } from './gamificationService';
import { getTopicQuiz } from './quizTopicQuestions';

export interface QuizQuestion {
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

export interface DailyQuiz {
  id: string;
  quiz_date: string;
  title: string;
  description: string;
  status: string;
  total_questions: number;
  coins_reward: number;
  questions?: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  user_id: string;
  current_question: number;
  score: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  coins_awarded: number;
}

// 1. Fetch Today's or Selected Published Quiz with Questions
export async function fetchTodayQuiz(targetQuizId?: string): Promise<DailyQuiz | null> {
  try {
    if (targetQuizId && (targetQuizId.includes('git') || targetQuizId === 'q-1' || targetQuizId === 'ql-1')) {
      return getGitHubGitBasicsQuiz();
    }

    if (targetQuizId && targetQuizId.startsWith('q-')) {
      return getTopicQuiz(targetQuizId);
    }

    let quiz: any = null;

    if (targetQuizId) {
      const { data: dQuiz } = await supabase
        .from('daily_quizzes')
        .select('*')
        .eq('id', targetQuizId)
        .maybeSingle();
      quiz = dQuiz;

      if (!quiz) {
        const { data: eQuiz } = await supabase
          .from('explore_quizzes')
          .select('*')
          .eq('id', targetQuizId)
          .maybeSingle();
        if (eQuiz) {
          quiz = {
            id: eQuiz.id,
            quiz_date: new Date().toISOString().split('T')[0],
            title: eQuiz.title,
            description: eQuiz.description || '',
            status: 'published',
            total_questions: eQuiz.question_count || 15,
            coins_reward: eQuiz.fx_reward || 15,
          };
        }
      }
    }

    if (quiz && (quiz.title?.toLowerCase().includes('git') || quiz.title?.toLowerCase().includes('github'))) {
      return getGitHubGitBasicsQuiz();
    }

    if (quiz && quiz.title) {
      return getTopicQuiz(quiz.id || targetQuizId || 'q-2', quiz.title);
    }

    if (!quiz) {
      const today = new Date().toISOString().split('T')[0];
      const { data: todayDaily } = await supabase
        .from('daily_quizzes')
        .select('*')
        .eq('quiz_date', today)
        .eq('status', 'published')
        .maybeSingle();
      quiz = todayDaily;

      if (!quiz) {
        const todayStr = new Date().toISOString().split('T')[0];
        const mockQuizIds = ['q-git-01', 'q-2', 'q-3'];
        let hash = 0;
        for (let i = 0; i < todayStr.length; i++) {
          hash += todayStr.charCodeAt(i);
        }
        const selectedIndex = hash % mockQuizIds.length;
        const todayQuizId = mockQuizIds[selectedIndex];
        
        if (todayQuizId === 'q-git-01') {
          return getGitHubGitBasicsQuiz();
        } else {
          return getTopicQuiz(todayQuizId);
        }
      }
    }

    // Fetch questions dynamically from database
    let finalQuestions: any[] = [];

    // 1. Try to fetch questions for this specific quiz from daily_quiz_questions
    const q1Res = await supabase
      .from('daily_quiz_questions')
      .select('*')
      .eq('quiz_id', quiz.id)
      .order('question_number', { ascending: true });
    const q1 = q1Res.data || [];

    if (q1.length > 0) {
      finalQuestions = q1;
    } else {
      // 2. Try to fetch questions for this specific quiz from explore_quiz_questions
      const q2Res = await supabase
        .from('explore_quiz_questions')
        .select('*')
        .eq('quiz_id', quiz.id)
        .order('question_number', { ascending: true });
      const q2 = q2Res.data || [];

      if (q2.length > 0) {
        finalQuestions = q2;
      } else {
        // 3. Fallback: try loading general daily quiz questions
        const qFallback1 = await supabase
          .from('daily_quiz_questions')
          .select('*')
          .order('question_number', { ascending: true })
          .limit(20);
        const f1 = qFallback1.data || [];
        if (f1.length > 0) {
          finalQuestions = f1;
        } else {
          // 4. Fallback: try loading general explore quiz questions
          const qFallback2 = await supabase
            .from('explore_quiz_questions')
            .select('*')
            .order('question_number', { ascending: true })
            .limit(20);
          const f2 = qFallback2.data || [];
          if (f2.length > 0) {
            finalQuestions = f2;
          }
        }
      }
    }

    if (!finalQuestions || finalQuestions.length === 0) {
      const fallbackMock = getMockDataStructuresQuiz();
      finalQuestions = fallbackMock.questions || [];
    }

    // Normalize question fields from database
    const normalized = finalQuestions.map((q, idx) => ({
      id: q.id || `q_${idx + 1}`,
      quiz_id: quiz.id,
      question_number: idx + 1,
      question_text: q.question_text || q.question || q.title || `Question ${idx + 1}`,
      option_a: q.option_a || q.options?.[0] || 'Option A',
      option_b: q.option_b || q.options?.[1] || 'Option B',
      option_c: q.option_c || q.options?.[2] || 'Option C',
      option_d: q.option_d || q.options?.[3] || 'Option D',
      correct_option: (q.correct_option || q.correct_answer || 'A').toUpperCase(),
      explanation: q.explanation || 'Review concept details.',
    }));

    return {
      ...quiz,
      total_questions: normalized.length,
      questions: normalized,
    };
  } catch (err) {
    console.error('[QuizService] fetchTodayQuiz exception:', err);
    return getMockDataStructuresQuiz();
  }
}

export function getGitHubGitBasicsQuiz(): DailyQuiz {
  return {
    id: 'q-git-01',
    quiz_date: new Date().toISOString().split('T')[0],
    title: 'GitHub & Git Basics Quiz',
    description: 'Master Git version control, commits, branches, and GitHub pull requests with 15 practice MCQs.',
    status: 'published',
    total_questions: 15,
    coins_reward: 15,
    questions: [
      {
        id: 'git-q1',
        quiz_id: 'q-git-01',
        question_number: 1,
        question_text: 'Which tool tracks changes in a project’s files?',
        option_a: 'Git',
        option_b: 'GitHub',
        option_c: 'Docker',
        option_d: 'SQL',
        correct_option: 'A',
        explanation: 'Git is the version-control tool used to track changes.',
      },
      {
        id: 'git-q2',
        quiz_id: 'q-git-01',
        question_number: 2,
        question_text: 'What is GitHub?',
        option_a: 'A hosted platform for Git repositories and collaboration',
        option_b: 'A programming language',
        option_c: 'A database engine',
        option_d: 'A computer network protocol',
        correct_option: 'A',
        explanation: 'GitHub provides hosted repositories and collaboration features around Git.',
      },
      {
        id: 'git-q3',
        quiz_id: 'q-git-01',
        question_number: 3,
        question_text: 'What does a Git commit represent?',
        option_a: 'A saved change in repository history',
        option_b: 'A remote server',
        option_c: 'A programming language',
        option_d: 'A network address',
        correct_option: 'A',
        explanation: 'A commit records a set of changes in Git history.',
      },
      {
        id: 'git-q4',
        quiz_id: 'q-git-01',
        question_number: 4,
        question_text: 'What is a branch used for?',
        option_a: 'A separate line of development',
        option_b: 'Encrypting a file',
        option_c: 'Running a database',
        option_d: 'Creating a network',
        correct_option: 'A',
        explanation: 'Branches let developers work on separate lines of development.',
      },
      {
        id: 'git-q5',
        quiz_id: 'q-git-01',
        question_number: 5,
        question_text: 'What does git clone do?',
        option_a: 'Copies a repository to a local environment',
        option_b: 'Deletes a repository',
        option_c: 'Creates a password',
        option_d: 'Publishes a website',
        correct_option: 'A',
        explanation: 'Clone creates a local copy of a repository.',
      },
      {
        id: 'git-q6',
        quiz_id: 'q-git-01',
        question_number: 6,
        question_text: 'What is a pull request?',
        option_a: 'A proposal to merge changes',
        option_b: 'A database query',
        option_c: 'A password reset',
        option_d: 'A cloud storage bucket',
        correct_option: 'A',
        explanation: 'A pull request is used to propose and review changes before merging.',
      },
      {
        id: 'git-q7',
        quiz_id: 'q-git-01',
        question_number: 7,
        question_text: 'What does git push do?',
        option_a: 'Sends local commits to a remote repository',
        option_b: 'Deletes commits',
        option_c: 'Creates an HTML page',
        option_d: 'Starts a firewall',
        correct_option: 'A',
        explanation: 'Push transfers local commits to a configured remote.',
      },
      {
        id: 'git-q8',
        quiz_id: 'q-git-01',
        question_number: 8,
        question_text: 'What does git pull commonly do?',
        option_a: 'Fetches and integrates changes from a remote',
        option_b: 'Formats a disk',
        option_c: 'Creates a database',
        option_d: 'Encrypts a password',
        correct_option: 'A',
        explanation: 'Pull obtains remote changes and integrates them into the current branch.',
      },
      {
        id: 'git-q9',
        quiz_id: 'q-git-01',
        question_number: 9,
        question_text: 'What is a repository?',
        option_a: 'A location containing a project’s files and version history',
        option_b: 'A network cable',
        option_c: 'A browser',
        option_d: 'A password',
        correct_option: 'A',
        explanation: 'A repository contains project files and version-control history.',
      },
      {
        id: 'git-q10',
        quiz_id: 'q-git-01',
        question_number: 10,
        question_text: 'What is GitHub Actions commonly used for?',
        option_a: 'Automating workflows such as testing and deployment',
        option_b: 'Writing SQL queries',
        option_c: 'Drawing circuits',
        option_d: 'Managing IP addresses',
        correct_option: 'A',
        explanation: 'GitHub Actions automates repository workflows.',
      },
      {
        id: 'git-q11',
        quiz_id: 'q-git-01',
        question_number: 11,
        question_text: 'What is a fork on GitHub?',
        option_a: 'A personal copy of another repository on GitHub',
        option_b: 'A local password',
        option_c: 'A network protocol',
        option_d: 'A compiler',
        correct_option: 'A',
        explanation: 'A fork creates a separate copy of a repository under another account or organization.',
      },
      {
        id: 'git-q12',
        quiz_id: 'q-git-01',
        question_number: 12,
        question_text: 'What does the staging area do in Git?',
        option_a: 'Prepares selected changes for a commit',
        option_b: 'Stores cloud backups',
        option_c: 'Runs a web server',
        option_d: 'Encrypts traffic',
        correct_option: 'A',
        explanation: 'The staging area lets you choose changes to include in the next commit.',
      },
      {
        id: 'git-q13',
        quiz_id: 'q-git-01',
        question_number: 13,
        question_text: 'What does git diff show?',
        option_a: 'Changes between versions or working states',
        option_b: 'Internet speed',
        option_c: 'Database tables',
        option_d: 'CPU temperature',
        correct_option: 'A',
        explanation: 'Git diff displays differences between file states.',
      },
      {
        id: 'git-q14',
        quiz_id: 'q-git-01',
        question_number: 14,
        question_text: 'What is a Git tag often used for?',
        option_a: 'Naming a specific point such as a release',
        option_b: 'Creating a firewall',
        option_c: 'Storing passwords',
        option_d: 'Running a database',
        correct_option: 'A',
        explanation: 'Tags provide named references to particular commits, often releases.',
      },
      {
        id: 'git-q15',
        quiz_id: 'q-git-01',
        question_number: 15,
        question_text: 'Why use version control?',
        option_a: 'To track changes and collaborate safely',
        option_b: 'To increase screen brightness',
        option_c: 'To replace an operating system',
        option_d: 'To compress videos',
        correct_option: 'A',
        explanation: 'Version control tracks changes and supports collaboration and recovery.',
      },
    ],
  };
}

function getMockDataStructuresQuiz(): DailyQuiz {
  return {
    id: '00000000-0000-0000-0000-000000000001',
    quiz_date: new Date().toISOString().split('T')[0],
    title: 'Data Structures Daily Challenge',
    description: 'Test your daily Data Structures knowledge and earn 5 Gold Coins!',
    status: 'published',
    total_questions: 10,
    coins_reward: 5,
    questions: [
      {
        id: 'ds-q1',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 1,
        question_text: 'What is the worst-case time complexity of accessing an element in a Singly Linked List of size N?',
        option_a: 'O(1)',
        option_b: 'O(log N)',
        option_c: 'O(N)',
        option_d: 'O(N log N)',
        correct_option: 'C',
        explanation: 'In a singly linked list, elements are accessed by traversing node-by-node from the head, resulting in O(N) operations.'
      },
      {
        id: 'ds-q2',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 2,
        question_text: 'Which data structure uses Last-In, First-Out (LIFO) ordering principles?',
        option_a: 'Queue',
        option_b: 'Stack',
        option_c: 'Heap',
        option_d: 'Array List',
        correct_option: 'B',
        explanation: 'Stacks operate on a Last-In, First-Out (LIFO) order where the last pushed element is the first one popped.'
      },
      {
        id: 'ds-q3',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 3,
        question_text: 'What is the primary advantage of a Hash Table over an Array for search operations?',
        option_a: 'Uses less memory footprint',
        option_b: 'Average-case constant time O(1) search complexity',
        option_c: 'Keeps elements in sorted order',
        option_d: 'Significantly easier to implement',
        correct_option: 'B',
        explanation: 'Hash Tables map keys directly to buckets using a hashing function, allowing constant-time O(1) lookups on average.'
      },
      {
        id: 'ds-q4',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 4,
        question_text: 'What is the height of a balanced Binary Search Tree (BST) with N nodes?',
        option_a: 'O(1)',
        option_b: 'O(N)',
        option_c: 'O(log N)',
        option_d: 'O(N^2)',
        correct_option: 'C',
        explanation: 'A balanced BST distributes nodes evenly, keeping its maximum depth capped at logarithmic height O(log N).'
      },
      {
        id: 'ds-q5',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 5,
        question_text: 'Which sorting algorithm is specifically designed to use a Heap data structure?',
        option_a: 'Quick Sort',
        option_b: 'Merge Sort',
        option_c: 'Heap Sort',
        option_d: 'Bubble Sort',
        correct_option: 'C',
        explanation: 'Heap Sort organizes elements into a binary heap tree layout to extract elements in sorted order efficiently.'
      },
      {
        id: 'ds-q6',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 6,
        question_text: 'In a circular queue of capacity C, how is the rear index incremented?',
        option_a: 'Rear + 1',
        option_b: '(Rear + 1) / C',
        option_c: '(Rear + 1) % C',
        option_d: 'Rear % (C + 1)',
        correct_option: 'C',
        explanation: 'Circular queues use modulo arithmetic (Rear + 1) % C to wrap the rear pointer back to index 0 when capacity is reached.'
      },
      {
        id: 'ds-q7',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 7,
        question_text: 'Which graph representation is most memory-efficient for sparse graphs?',
        option_a: 'Adjacency Matrix',
        option_b: 'Adjacency List',
        option_c: 'Incidence Matrix',
        option_d: 'Edge List',
        correct_option: 'B',
        explanation: 'An Adjacency List only allocates nodes for existing edges, making it ideal for sparse graphs.'
      },
      {
        id: 'ds-q8',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 8,
        question_text: 'What data structure is used internally by the runtime to implement recursion or backtracking?',
        option_a: 'Stack',
        option_b: 'Queue',
        option_c: 'Binary Tree',
        option_d: 'Priority Queue',
        correct_option: 'A',
        explanation: 'The program call stack tracks function frames using a Last-In, First-Out (LIFO) stack layout.'
      },
      {
        id: 'ds-q9',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 9,
        question_text: 'What is the average-case time complexity of inserting an item into a Binary Search Tree (BST)?',
        option_a: 'O(N)',
        option_b: 'O(1)',
        option_c: 'O(log N)',
        option_d: 'O(N log N)',
        correct_option: 'C',
        explanation: 'Insertion requires traversing down the tree, which takes O(log N) steps on average in a balanced BST.'
      },
      {
        id: 'ds-q10',
        quiz_id: '00000000-0000-0000-0000-000000000001',
        question_number: 10,
        question_text: 'Which data structure is best suited for implementing Dijkstra\'s shortest path algorithm efficiently?',
        option_a: 'Stack',
        option_b: 'Deque',
        option_c: 'Min-Priority Queue (Heap)',
        option_d: 'Circular Linked List',
        correct_option: 'C',
        explanation: 'A min-priority queue (or heap) allows fast O(log V) retrieval of the vertex with minimum distance.'
      }
    ]
  };
}

// 2. Get or Create Student Quiz Attempt
export async function getOrCreateAttempt(userId: string, quizId: string): Promise<QuizAttempt | null> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(quizId) && 
                   /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    if (!isUuid) {
      const fallbackId = `attempt_${quizId}_${userId}`;
      const cached = await AsyncStorage.getItem(`@quiz_attempt_${fallbackId}`);
      if (cached) {
        return JSON.parse(cached);
      }
      const fallbackAttempt: QuizAttempt = {
        id: fallbackId,
        quiz_id: quizId,
        user_id: userId,
        current_question: 1,
        score: 0,
        status: 'IN_PROGRESS',
        coins_awarded: 0,
      };
      await AsyncStorage.setItem(`@quiz_attempt_${fallbackId}`, JSON.stringify(fallbackAttempt));
      return fallbackAttempt;
    }

    const { data: existing, error } = await supabase
      .from('daily_quiz_attempts')
      .select('*')
      .or(`user_id.eq.${userId},student_id.eq.${userId}`)
      .eq('quiz_id', quizId)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    const { data: created, error: createErr } = await supabase
      .from('daily_quiz_attempts')
      .insert({
        user_id: userId,
        student_id: userId,
        quiz_id: quizId,
        status: 'IN_PROGRESS',
        current_question: 1,
      })
      .select('*')
      .single();

    if (createErr) {
      console.error('[QuizService] Error creating attempt, falling back:', createErr.message);
      const fallbackId = `attempt_${quizId}_${userId}`;
      const fallbackAttempt: QuizAttempt = {
        id: fallbackId,
        quiz_id: quizId,
        user_id: userId,
        current_question: 1,
        score: 0,
        status: 'IN_PROGRESS',
        coins_awarded: 0,
      };
      await AsyncStorage.setItem(`@quiz_attempt_${fallbackId}`, JSON.stringify(fallbackAttempt));
      return fallbackAttempt;
    }

    return created;
  } catch (err) {
    console.error('[QuizService] getOrCreateAttempt exception, falling back:', err);
    const fallbackId = `attempt_${quizId}_${userId}`;
    const fallbackAttempt: QuizAttempt = {
      id: fallbackId,
      quiz_id: quizId,
      user_id: userId,
      current_question: 1,
      score: 0,
      status: 'IN_PROGRESS',
      coins_awarded: 0,
    };
    try {
      await AsyncStorage.setItem(`@quiz_attempt_${fallbackId}`, JSON.stringify(fallbackAttempt));
    } catch (_) {}
    return fallbackAttempt;
  }
}

// 3. Save Question Answer Progress (Idempotent)
export async function saveQuizAnswer(
  attemptId: string,
  questionId: string,
  userId: string,
  selectedOption: 'A' | 'B' | 'C' | 'D',
  questionNumber: number
): Promise<boolean> {
  try {
    // Save to Local Cache for Offline Resume
    await AsyncStorage.setItem(
      `@quiz_answer_${attemptId}_${questionId}`,
      selectedOption
    );

    // Update attempt current_question in AsyncStorage if it is cached
    const cachedAttempt = await AsyncStorage.getItem(`@quiz_attempt_${attemptId}`);
    if (cachedAttempt) {
      const att = JSON.parse(cachedAttempt);
      att.current_question = questionNumber;
      await AsyncStorage.setItem(`@quiz_attempt_${attemptId}`, JSON.stringify(att));
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(attemptId) &&
                   /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(questionId);

    if (isUuid) {
      // Save to Database
      await supabase.from('daily_quiz_answers').upsert(
        {
          attempt_id: attemptId,
          question_id: questionId,
          user_id: userId,
          student_id: userId,
          selected_option: selectedOption,
        },
        { onConflict: 'attempt_id,question_id' }
      );

      // Update current question number progress on attempt
      await supabase
        .from('daily_quiz_attempts')
        .update({ current_question: questionNumber, updated_at: new Date().toISOString() })
        .eq('id', attemptId);
    }

    return true;
  } catch (err) {
    console.warn('[QuizService] saveQuizAnswer silent exception:', err);
    return true; // Fallback to local cache success
  }
}

// 4. Submit Quiz Attempt & Award Coins (RPC with resilient client fallback)
export async function submitQuizAttempt(
  attemptId: string,
  options?: { isDaily?: boolean; source?: string }
): Promise<{ success: boolean; score?: number; coins_awarded?: number; already_completed?: boolean }> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(attemptId);
  try {
    if (isUuid) {
      const { data, error } = await supabase.rpc('submit_daily_quiz_attempt', {
        p_attempt_id: attemptId,
      });

      if (!error && data) {
        return data;
      }
    }
  } catch (rpcErr) {
    console.warn('[QuizService] RPC submit failed, using client fallback:', rpcErr);
  }

  // Resilient Client Fallback Strategy (used for both mock quizzes and if RPC fails)
  try {
    let userId = 'guest';
    let quizId = '';
    let status = 'IN_PROGRESS';

    const cachedAttempt = await AsyncStorage.getItem(`@quiz_attempt_${attemptId}`);
    if (cachedAttempt) {
      const att = JSON.parse(cachedAttempt);
      userId = att.user_id;
      quizId = att.quiz_id;
      status = att.status;
    }

    // Determine whether this is a Daily Mission quiz (50 tokens) or Explore quiz (15 tokens)
    const isDaily = options?.isDaily !== undefined 
      ? options.isDaily 
      : (options?.source === 'daily_mission' || options?.source !== 'explore');
    const tokenReward = isDaily ? 50 : 15;
    const activityType = isDaily ? 'home_daily_quiz' : 'explore_quiz';
    const todayStr = getCalendarDateString();
    const refId = isDaily ? `daily_quiz_${userId}_${todayStr}` : `explore_quiz_${quizId}_${userId}_${todayStr}`;

    if (status === 'COMPLETED') {
      const att = cachedAttempt ? JSON.parse(cachedAttempt) : {};
      return { success: true, score: att.score || 0, coins_awarded: 0, already_completed: true };
    }

    // Retrieve the quiz to check correct options
    const quiz = await fetchTodayQuiz(quizId);
    const questions = quiz?.questions || [];
    let correctCount = 0;

    if (questions.length > 0) {
      for (const q of questions) {
        const stored = await AsyncStorage.getItem(`@quiz_answer_${attemptId}_${q.id}`);
        const selected = String(stored || '').trim().toUpperCase();
        const target = String(q.correct_option || '').trim().toUpperCase();
        if (selected && target && selected === target) {
          correctCount++;
        }
      }
    }

    const calculatedScore = correctCount;

    // Update in database if it is UUID
    if (isUuid) {
      await supabase
        .from('daily_quiz_attempts')
        .update({
          status: 'COMPLETED',
          score: calculatedScore,
          completed_at: new Date().toISOString(),
          coins_awarded: tokenReward,
        })
        .eq('id', attemptId);
    }

    // Update in AsyncStorage
    const updatedAttempt = {
      id: attemptId,
      quiz_id: quizId,
      user_id: userId,
      current_question: questions.length,
      score: calculatedScore,
      status: 'COMPLETED' as const,
      coins_awarded: tokenReward,
      completed_at: new Date().toISOString(),
    };
    await AsyncStorage.setItem(`@quiz_attempt_${attemptId}`, JSON.stringify(updatedAttempt));
    await AsyncStorage.setItem(`@completed_quiz_${userId || 'guest'}_${quizId}`, 'true');

    // Award FEEDX Tokens authoritatively according to matrix (Today's Mission: 50, Explore: 15)
    if (userId && userId !== 'guest' && userId !== 'guest_user') {
      await awardActivity(userId, activityType, tokenReward, tokenReward, refId);
    }

    return {
      success: true,
      score: calculatedScore,
      coins_awarded: tokenReward,
    };
  } catch (err) {
    console.error('[QuizService] submitQuizAttempt fallback exception:', err);
    return {
      success: false,
      score: 0,
      coins_awarded: 0,
    };
  }
}
