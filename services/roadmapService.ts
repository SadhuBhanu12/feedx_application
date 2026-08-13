import { CAREER_ROADMAPS, CareerRoadmap } from '@/constants/roadmaps';
import { CAREER_BLUEPRINTS, CareerBlueprint } from '@/constants/roadmaps/blueprints';
import { storage } from '@/store/storage';

export interface UserProfileInput {
  name: string;
  branch: string;
  year: string;
  cgpa: string;
  careerGoal: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  studyHoursPerDay: string;
  preferredLanguage: string;
  targetCompany: string;
  graduationYear: string;
}

export interface PersonalizedBlueprintResponse {
  userProfile: UserProfileInput;
  blueprint: CareerBlueprint;
  aiSummary: string;
  currentScore: number;
  potentialScore: number;
}

class RoadmapService {
  /**
   * Generates a complete AI Career Blueprint based on student profile.
   * Decoupled architecture: Swappable for OpenAI / Gemini / Claude without UI changes.
   */
  async generateCareerBlueprint(
    profile: UserProfileInput,
    careerId: string
  ): Promise<PersonalizedBlueprintResponse> {
    // Simulate realistic 500ms AI synthesis & profile analysis
    await new Promise((res) => setTimeout(res, 500));

    let baseBlueprint = CAREER_BLUEPRINTS[careerId];

    if (!baseBlueprint) {
      const roadmap = CAREER_ROADMAPS[careerId] || CAREER_ROADMAPS['java-developer'];
      baseBlueprint = {
        id: roadmap.id,
        title: roadmap.title,
        category: roadmap.category,
        icon: roadmap.icon,
        difficulty: roadmap.difficulty,
        overview: roadmap.overview,
        estimatedTimeline: roadmap.estimatedTimeline,
        expectedSalaryRange: roadmap.expectedSalaryRange,
        initialReadinessScore: 40,
        potentialReadinessScore: 90,
        aiSummaryTemplate: `Focusing on ${roadmap.title} will prepare you for top-tier software engineering roles.`,
        motivationalMessage: `Mastering the specialized track for ${roadmap.title} will unlock immense placement opportunities.`,
        currentSkillsSample: [roadmap.skillsRequired[0] || 'Basic Programming'],
        missingSkills: roadmap.skillsRequired.slice(1).length > 0 ? roadmap.skillsRequired.slice(1) : ['Advanced concepts', 'System design'],
        weeklySchedule: {
          Monday: `DSA & Problem Solving in ${roadmap.programmingLanguages[0] || 'TypeScript'} (2 Hrs)`,
          Tuesday: `Learn ${roadmap.frameworks[0] || 'Core Frameworks'} (2.5 Hrs)`,
          Wednesday: `Study ${roadmap.tools[0] || 'Development Tools'} (2 Hrs)`,
          Thursday: `Hands-on Project Building (3 Hrs)`,
          Friday: `Review ${roadmap.skillsRequired.slice(0, 3).join(', ')} (2 Hrs)`,
          Saturday: `Mock Technical Interview (2 Hrs)`,
          Sunday: `Weekly Revision & Portfolio Update (2 Hrs)`
        },
        monthlyGoals: [
          { month: 'Month 1', goal: `Master ${roadmap.programmingLanguages.join(', ')} Syntax & Logic` },
          { month: 'Month 2', goal: `Build projects using ${roadmap.frameworks.join(', ')}` },
          { month: 'Month 3', goal: `Deploy portfolio projects and practice mock interviews` }
        ],
        phases: roadmap.phases.map(p => ({
          id: p.id,
          title: p.title,
          description: p.description,
          topics: p.topics,
          estimatedTime: p.estimatedTime
        })),
        projects: roadmap.projects,
        certifications: roadmap.certifications,
        softSkills: ['Technical Communication', 'Problem Solving', 'Structured Thinking'],
        placementPrep: {
          easyProblems: 50,
          mediumProblems: 70,
          hardProblems: 10,
          mockInterviews: 3,
          checklist: ['ATS-optimized resume PDF', 'GitHub Portfolio', 'Active LinkedIn Profile']
        },
        companyPrep: {
          General: ['Core Programming Principles', 'Data Structures & Algorithms', 'System Design']
        },
        recommendedBooks: ['Clean Code by Robert C. Martin', 'Cracking the Coding Interview'],
        youtubeChannels: ['freeCodeCamp', 'take U forward'],
        websites: ['roadmap.sh', 'LeetCode', 'GeeksforGeeks']
      };
    }

    const userCGPA = parseFloat(profile.cgpa) || 8.2;
    const hours = parseInt(profile.studyHoursPerDay) || 3;

    // Dynamically scale readiness scores based on profile metrics
    const currentScore = Math.min(85, Math.max(25, Math.round(baseBlueprint.initialReadinessScore + (userCGPA - 7.5) * 4)));
    const potentialScore = Math.min(99, Math.max(88, Math.round(baseBlueprint.potentialReadinessScore + hours * 1.5)));

    const aiSummary = `We analyzed your academic profile (${profile.branch || 'Engineering'}, ${profile.year || '2nd Year'}, CGPA ${profile.cgpa || '8.5'}) and career target (${baseBlueprint.title}). Based on your target company (${profile.targetCompany || 'Top Tech Companies'}) and commitment of ${hours} hours/day, you have an outstanding trajectory of becoming industry-ready before your ${profile.graduationYear || '2026'} graduation.`;

    return {
      userProfile: profile,
      blueprint: baseBlueprint,
      aiSummary,
      currentScore,
      potentialScore,
    };
  }

  async generateRoadmap(careerId: string, level: 'Beginner' | 'Intermediate' | 'Advanced'): Promise<CareerRoadmap> {
    await new Promise((res) => setTimeout(res, 300));
    const baseRoadmap = CAREER_ROADMAPS[careerId] || CAREER_ROADMAPS['java-developer'];
    return {
      ...baseRoadmap,
      difficulty: level,
    };
  }

  async getAllCareerOptions(): Promise<{ id: string; title: string; category: string; icon: string; difficulty: string }[]> {
    return Object.values(CAREER_ROADMAPS).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      icon: item.icon,
      difficulty: item.difficulty,
    }));
  }

  getProgress(roadmapId: string): string[] {
    try {
      const raw = storage.getString(`roadmap_progress_${roadmapId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  togglePhase(roadmapId: string, phaseId: string): string[] {
    try {
      const current = this.getProgress(roadmapId);
      const updated = current.includes(phaseId)
        ? current.filter((id) => id !== phaseId)
        : [...current, phaseId];

      storage.set(`roadmap_progress_${roadmapId}`, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  }

  isBookmarked(roadmapId: string): boolean {
    try {
      const raw = storage.getString('bookmarked_roadmaps');
      const list: string[] = raw ? JSON.parse(raw) : [];
      return list.includes(roadmapId);
    } catch {
      return false;
    }
  }

  toggleBookmark(roadmapId: string): boolean {
    try {
      const raw = storage.getString('bookmarked_roadmaps');
      const list: string[] = raw ? JSON.parse(raw) : [];
      const updated = list.includes(roadmapId)
        ? list.filter((id) => id !== roadmapId)
        : [...list, roadmapId];

      storage.set('bookmarked_roadmaps', JSON.stringify(updated));
      return updated.includes(roadmapId);
    } catch {
      return false;
    }
  }
}

export const roadmapService = new RoadmapService();
