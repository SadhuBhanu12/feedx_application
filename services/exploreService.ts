import { supabase } from '@/lib/supabase';
import { storage } from '@/store/storage';
import { awardActivity } from '@/services/gamificationService';
import { cacheService } from '@/services/cacheService';

export interface QuickLearnLesson {
  id: string;
  title: string;
  slug?: string;
  branch: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  estimated_minutes: number;
  is_recommended: boolean;
  fx_reward: number;
  short_description?: string;
  content_markdown?: string;
  cover_image_url?: string;
  knowledge_check?: {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation?: string;
  };
  knowledge_checks?: Array<{
    id: string;
    lesson_id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string;
    explanation?: string;
  }>;
}

export interface ExploreQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  branch: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
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

export const DEFAULT_QUICK_LEARN_LESSONS: QuickLearnLesson[] = [
  {
    id: 'ql-ds-01',
    slug: 'data-structures-arrays-linked-lists',
    title: 'Arrays vs Linked Lists: Big-O & Memory Layout',
    branch: 'CSE',
    category: 'Data Structures',
    difficulty: 'Beginner',
    estimated_minutes: 2,
    is_recommended: true,
    fx_reward: 50,
    short_description: 'Understand contiguous memory vs pointer-based node chains and access time trade-offs.',
    content_markdown: `### Core Concept: Memory Layout & Access Patterns

An **Array** is a contiguous block of memory where each element is stored at consecutive memory addresses. This allows constant time **O(1) random access** using direct index calculation:

\`Address(A[i]) = Base + (i × Size)\`

In contrast, a **Singly Linked List** stores elements in separate nodes scattered across the heap, connected via pointer references (\`next\`). Accessing the *i*-th element requires sequential traversal from the head node: **O(N) access**.

---

### Complexity Comparison

- **Access (by index)**: Array: O(1) | Linked List: O(N)
- **Insert at Beginning**: Array: O(N) (shift elements) | Linked List: O(1) (new node → head)
- **Insert at End**: Array: O(1) (if capacity) | Linked List: O(1) (with tail pointer)
- **Delete Element**: Array: O(N) (shift left) | Linked List: O(N) (search + relink)
- **Cache Locality**: Array: Excellent (CPU cache lines) | Linked List: Poor (pointer chasing)

---

### Key Takeaway for Technical Interviews
Use **Arrays** when read performance and random lookups dominate. Use **Linked Lists** when dynamic resizing without re-allocation or frequent insertions at the front are required.`,
    knowledge_check: {
      question_text: 'What is the time complexity of accessing an element at index K in a Singly Linked List of size N?',
      option_a: 'O(1)',
      option_b: 'O(log N)',
      option_c: 'O(N)',
      option_d: 'O(N^2)',
      correct_option: 'C',
      explanation: 'Linked list nodes are not contiguous in memory; you must start at head and traverse K pointers step-by-step.',
    },
    knowledge_checks: [
      {
        id: 'chk-1',
        lesson_id: 'ql-ds-01',
        question_text: 'What is the time complexity of accessing an element at index K in a Singly Linked List of size N?',
        option_a: 'O(1)',
        option_b: 'O(log N)',
        option_c: 'O(N)',
        option_d: 'O(N^2)',
        correct_option: 'C',
        explanation: 'Linked list nodes are not contiguous in memory; you must start at head and traverse K pointers step-by-step.',
      }
    ]
  },
  {
    id: 'ql-git-01',
    slug: 'git-rebase-vs-merge',
    title: 'Git Merge vs Git Rebase: Clean Commit Histories',
    branch: 'CSE',
    category: 'DevOps & Git',
    difficulty: 'Intermediate',
    estimated_minutes: 2,
    is_recommended: true,
    fx_reward: 10,
    short_description: 'Learn when to rebase vs merge to maintain clean, linear Git project histories.',
    content_markdown: `### Merge vs Rebase

Both \`git merge\` and \`git rebase\` solve the same fundamental problem: integrating changes from one branch into another.

1. **Git Merge**: Preserves the complete chronological history by creating a new 3-way **merge commit**.
2. **Git Rebase**: Rewrites project history by replaying individual commits from your feature branch on top of the tip of the target branch, producing a **linear history**.`,
    knowledge_check: {
      question_text: 'What does git rebase do when applied to a feature branch on top of main?',
      option_a: 'Deletes all commit history',
      option_b: 'Replays feature branch commits sequentially on top of the main branch tip',
      option_c: 'Creates an encrypted cloud backup',
      option_d: 'Merges with a single automatic conflict resolution commit',
      correct_option: 'B',
      explanation: 'Rebase reapplies your unique commits one by one on the new base commit to ensure a linear commit graph.',
    }
  }
];

class ExploreService {
  /**
   * Fetch Quick Learn Lessons filtered dynamically by Branch and Search query with in-memory caching.
   */
  async getQuickLearnLessons(branch: string = 'CSE', searchQuery: string = '', bypassCache: boolean = false): Promise<QuickLearnLesson[]> {
    const cacheKey = `explore_lessons_${branch}_${searchQuery.trim().toLowerCase()}`;
    if (bypassCache) {
      cacheService.invalidate(cacheKey);
    }

    return cacheService.fetchWithCache<QuickLearnLesson[]>(
      cacheKey,
      async () => {
        try {
          let query = supabase.from('quick_learn_lessons')
            .select('*')
            .eq('is_published', true);

          if (branch !== 'All' && branch !== 'For You') {
            query = query.eq('branch', branch);
          }
          if (searchQuery.trim()) {
            const q = searchQuery.trim();
            query = query.or(`title.ilike.%${q}%,short_description.ilike.%${q}%,category.ilike.%${q}%`);
          }

          const { data, error } = await query.order('created_at', { ascending: false }).limit(60);
          if (error) {
            console.warn('[ExploreService] Error fetching lessons:', error.message);
          }

          if (data && data.length > 0) {
            return data;
          }

          // If no branch-specific results, search all lessons
          let allQuery = supabase.from('quick_learn_lessons').select('*');

          if (searchQuery.trim()) {
            const q = searchQuery.trim();
            allQuery = allQuery.or(`title.ilike.%${q}%,short_description.ilike.%${q}%,category.ilike.%${q}%`);
          }

          const { data: allData } = await allQuery.order('created_at', { ascending: false }).limit(60);
          if (allData && allData.length > 0) {
            return allData;
          }

          return DEFAULT_QUICK_LEARN_LESSONS;
        } catch (e) {
          console.warn('[ExploreService] getQuickLearnLessons exception:', e);
          return DEFAULT_QUICK_LEARN_LESSONS;
        }
      },
      60000 // 1 minute TTL
    );
  }

  /**
   * Fetch single Quick Learn Lesson dynamically by ID strictly from database with curated fallbacks.
   */
  async getLessonById(id: string): Promise<QuickLearnLesson | null> {
    try {
      let lesson: any = null;

      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      if (isUuid) {
        const { data } = await supabase
          .from('quick_learn_lessons')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        lesson = data;
      }

      if (!lesson) {
        const { data } = await supabase
          .from('quick_learn_lessons')
          .select('*')
          .eq('slug', id)
          .maybeSingle();
        lesson = data;
      }

      if (!lesson) {
        const { data } = await supabase
          .from('quick_learn_lessons')
          .select('*')
          .ilike('title', `%${id.replace(/-/g, ' ')}%`)
          .maybeSingle();
        lesson = data;
      }

      if (!lesson) {
        const fallback = DEFAULT_QUICK_LEARN_LESSONS.find((l) => l.id === id || l.slug === id) || DEFAULT_QUICK_LEARN_LESSONS[0];
        return fallback;
      }

      // Fetch knowledge check questions strictly from database (by lesson ID or slug)
      let { data: checks } = await supabase
        .from('quick_learn_checks')
        .select('*')
        .eq('lesson_id', lesson.id);

      if ((!checks || checks.length === 0) && lesson.slug) {
        const { data: slugChecks } = await supabase
          .from('quick_learn_checks')
          .select('*')
          .eq('lesson_id', lesson.slug);
        if (slugChecks && slugChecks.length > 0) {
          checks = slugChecks;
        }
      }

      const formattedChecks = checks || [];
      const check = formattedChecks[0] || lesson.knowledge_check || DEFAULT_QUICK_LEARN_LESSONS[0].knowledge_check;

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
        knowledge_checks: formattedChecks.length > 0 ? formattedChecks : (check ? [check] : []),
      };
    } catch (e) {
      console.warn('[ExploreService] getLessonById exception, using fallback:', e);
      return DEFAULT_QUICK_LEARN_LESSONS[0];
    }
  }

  /**
   * Complete Quick Learn Lesson and record progress (Idempotent).
   */
  async completeLesson(userId: string, lessonId: string, fxReward: number = 10): Promise<{ success: boolean; fxAwarded: number }> {
    const key = `lesson_completed_${userId}_${lessonId}`;
    const alreadyCompleted = storage.getBoolean(key);

    if (alreadyCompleted) {
      return { success: true, fxAwarded: 0 };
    }

    storage.set(key, true);
    storage.set(`lesson_completed_${lessonId}`, true);

    try {
      if (userId) {
        // 1. Direct upsert with lessonId
        const { error: err1 } = await supabase.from('student_lesson_progress').upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          fx_awarded: fxReward,
          completed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,lesson_id' });

        if (err1) {
          // 2. If UUID syntax error (22P02), try with deterministic UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(lessonId)) {
            const numMatch = lessonId.match(/\d+/);
            const num = numMatch ? parseInt(numMatch[0], 10) : 1;
            const hex = num.toString(16).padStart(12, '0');
            const fallbackUuid = `00000000-0000-4000-a000-${hex}`;

            await supabase.from('student_lesson_progress').upsert({
              user_id: userId,
              lesson_id: fallbackUuid,
              completed: true,
              fx_awarded: fxReward,
              completed_at: new Date().toISOString(),
            }, { onConflict: 'user_id,lesson_id' });
          }

          // 3. Resilient SECURITY DEFINER RPC fallback
          await supabase.rpc('complete_student_lesson', {
            p_user_id: userId,
            p_lesson_id: lessonId,
            p_fx_reward: fxReward,
          });
        }
      }
    } catch (err) {
      console.warn('[ExploreService] Error recording lesson completion:', err);
    }

    return { success: true, fxAwarded: fxReward };
  }

  /**
   * Fetch user completed lessons from Supabase and synchronize with local storage.
   */
  async getUserLessonProgress(userId: string): Promise<string[]> {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from('student_lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', userId)
        .eq('completed', true);

      if (data && Array.isArray(data)) {
        const completedIds: string[] = [];
        data.forEach((row) => {
          if (row.lesson_id) {
            const id = String(row.lesson_id);
            completedIds.push(id);
            storage.set(`lesson_completed_${userId}_${id}`, true);
            storage.set(`lesson_completed_${id}`, true);
          }
        });
        return completedIds;
      }
    } catch (e) {
      console.warn('[ExploreService] getUserLessonProgress error:', e);
    }
    return [];
  }

  /**
   * Fetch Explore Quizzes dynamically from database with in-memory caching.
   */
  async getQuizzes(branch: string = 'CSE', isDaily: boolean = false, searchQuery: string = '', bypassCache: boolean = false): Promise<ExploreQuiz[]> {
    const cacheKey = `explore_quizzes_${branch}_${isDaily}_${searchQuery.trim().toLowerCase()}`;
    if (bypassCache) {
      cacheService.invalidate(cacheKey);
    }

    return cacheService.fetchWithCache<ExploreQuiz[]>(
      cacheKey,
      async () => {
        try {
          let query = supabase.from('explore_quizzes').select('*');
          if (isDaily) {
            query = query.eq('is_daily', true);
          } else if (branch !== 'All' && branch !== 'For You') {
            query = query.eq('branch', branch);
          }
          if (searchQuery.trim()) {
            const q = searchQuery.trim();
            query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
          }

          const { data, error } = await query.order('created_at', { ascending: false }).limit(60);
          if (error) {
            console.warn('[ExploreService] getQuizzes error:', error.message);
          }

          if (data && data.length > 0) {
            return data;
          }

          // If no results, search all explore_quizzes
          let allQuery = supabase.from('explore_quizzes').select('*');

          if (searchQuery.trim()) {
            const q = searchQuery.trim();
            allQuery = allQuery.or(`title.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`);
          }

          const { data: allQuizzes } = await allQuery.order('created_at', { ascending: false }).limit(60);
          return allQuizzes || [];
        } catch (e) {
          console.warn('[ExploreService] getQuizzes exception:', e);
          return [];
        }
      },
      60000 // 1 minute TTL
    );
  }
}

export const exploreService = new ExploreService();
