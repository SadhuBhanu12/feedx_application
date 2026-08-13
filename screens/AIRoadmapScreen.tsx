import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { storage } from '@/store/storage';
import GlassCard from '@/components/ui/GlassCard';
import { COLORS } from '@/constants/theme';
import { CAREER_ROADMAPS, CAREER_CATEGORIES } from '@/constants/roadmaps';
import { roadmapService, UserProfileInput, PersonalizedBlueprintResponse } from '@/services/roadmapService';
import { useUser } from '@/context/UserContext';
import { useGamification } from '@/context/GamificationContext';
import { awardActivity } from '@/services/gamificationService';
import { SkeletonLoader } from '@/components/ui/Loaders';
import { rf, rs } from '@/constants/responsive';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function AIRoadmapScreen() {
  const router = useRouter();
  const { careerId } = useLocalSearchParams<{ careerId?: string }>();
  const { user } = useUser();
  const { refreshGamification } = useGamification();

  // Wizard Steps: 1 = Choose Career, 2 = Profile Form, 3 = Blueprint Dashboard
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCareerId, setSelectedCareerId] = useState<string>('fullstack-developer');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Form Fields
  const [studentName, setStudentName] = useState<string>(user?.full_name || 'Student');
  const [branch, setBranch] = useState<string>(user?.branch || 'Computer Science');
  const [year, setYear] = useState<string>(user?.year || '2nd Year');
  const [cgpa, setCgpa] = useState<string>('8.6');
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [studyHours, setStudyHours] = useState<string>('3');
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [gradYear, setGradYear] = useState<string>('2026');

  // Blueprint Response & Progress
  const [loading, setLoading] = useState<boolean>(false);
  const [blueprintData, setBlueprintData] = useState<PersonalizedBlueprintResponse | null>(null);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});

  // Auto-synthesize function for direct roadmap loading
  const autoSynthesize = async (careerIdToLoad: string) => {
    setLoading(true);
    setStep(3);
    const profileInput: UserProfileInput = {
      name: studentName || user?.full_name || 'Student',
      branch: branch || user?.branch || 'Computer Science',
      year: year || user?.year || '2nd Year',
      cgpa: cgpa || '8.6',
      careerGoal: careerIdToLoad,
      level: level || 'Beginner',
      studyHoursPerDay: studyHours || '3',
      preferredLanguage: 'TypeScript / Java',
      targetCompany: targetCompany || 'Google',
      graduationYear: gradYear || '2026',
    };
    try {
      const res = await roadmapService.generateCareerBlueprint(profileInput, careerIdToLoad);
      setBlueprintData(res);
      setCompletedPhases(roadmapService.getProgress(res.blueprint.id));
      setBookmarked(roadmapService.isBookmarked(res.blueprint.id));
      if (res.blueprint.phases.length > 0) {
        setExpandedPhases({ [res.blueprint.phases[0].id]: true });
      }
    } catch (err) {
      console.warn('Auto Blueprint error:', err);
      Alert.alert('Error', 'Unable to generate career blueprint.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadSavedRoadmap = async () => {
      // 1. Check search parameter first
      if (careerId) {
        if (isMounted) {
          setSelectedCareerId(careerId);
          autoSynthesize(careerId);
        }
        return;
      }

      // 2. Check MMKV storage
      try {
        const localActive = storage.getString('last_active_career_id');
        if (localActive) {
          if (isMounted) {
            setSelectedCareerId(localActive);
            autoSynthesize(localActive);
          }
          return;
        }
      } catch (e) {
        console.warn(e);
      }

      // 3. Check Supabase student_roadmap_progress
      if (user?.id) {
        try {
          const { data } = await supabase
            .from('student_roadmap_progress')
            .select('career_role_id')
            .eq('user_id', user.id)
            .maybeSingle();
          if (data && data.career_role_id && isMounted) {
            setSelectedCareerId(data.career_role_id);
            autoSynthesize(data.career_role_id);
            return;
          }
        } catch (dbErr) {
          console.warn('[AIRoadmapScreen] Supabase load error:', dbErr);
        }
      }
    };

    loadSavedRoadmap();
    return () => { isMounted = false; };
  }, [careerId, user?.id]);

  const filteredCareers = useMemo(() => {
    return Object.values(CAREER_ROADMAPS).filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.skillsRequired.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleGenerateBlueprint = async () => {
    setLoading(true);
    setStep(3);

    const profileInput: UserProfileInput = {
      name: studentName,
      branch,
      year,
      cgpa,
      careerGoal: selectedCareerId,
      level,
      studyHoursPerDay: studyHours,
      preferredLanguage: 'TypeScript / Java',
      targetCompany,
      graduationYear: gradYear,
    };

    try {
      const res = await roadmapService.generateCareerBlueprint(profileInput, selectedCareerId);
      setBlueprintData(res);
      setCompletedPhases(roadmapService.getProgress(res.blueprint.id));
      setBookmarked(roadmapService.isBookmarked(res.blueprint.id));

      if (res.blueprint.phases.length > 0) {
        setExpandedPhases({ [res.blueprint.phases[0].id]: true });
      }

      // Save progress to MMKV and Supabase
      try {
        storage.set('last_active_career_id', selectedCareerId);
        if (user?.id) {
          await supabase
            .from('student_roadmap_progress')
            .upsert({
              user_id: user.id,
              career_role_id: selectedCareerId,
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id, career_role_id' });
        }
      } catch (dbErr) {
        console.warn('[AIRoadmapScreen] Error saving roadmap progress:', dbErr);
      }
    } catch (err) {
      console.warn('Blueprint error:', err);
      Alert.alert('Error', 'Unable to generate career blueprint.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePhase = async (phaseId: string) => {
    if (!blueprintData) return;
    const wasCompleted = completedPhases.includes(phaseId);
    const updated = roadmapService.togglePhase(blueprintData.blueprint.id, phaseId);
    setCompletedPhases(updated);

    if (!wasCompleted && updated.includes(phaseId) && user?.id) {
      try {
        await awardActivity(user.id, 'roadmap_task', 0, 35, `phase_${phaseId}`);
        await refreshGamification();
      } catch (err) {
        console.warn('Roadmap task point award error:', err);
      }
    }
  };

  const handleToggleBookmark = () => {
    if (!blueprintData) return;
    const isSaved = roadmapService.toggleBookmark(blueprintData.blueprint.id);
    setBookmarked(isSaved);
    Alert.alert(isSaved ? 'Bookmarked' : 'Removed', isSaved ? 'Blueprint saved to bookmarks!' : 'Blueprint removed.');
  };

  const handleShare = async () => {
    if (!blueprintData) return;
    try {
      await Share.share({
        message: `My FEEDX AI Career Blueprint for ${blueprintData.blueprint.title}! Target Company: ${targetCompany}, Target Salary: ${blueprintData.blueprint.expectedSalaryRange}.`,
      });
    } catch (e) {}
  };

  const toggleExpand = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const completionPercentage = useMemo(() => {
    if (!blueprintData || blueprintData.blueprint.phases.length === 0) return 0;
    return Math.round((completedPhases.length / blueprintData.blueprint.phases.length) * 100);
  }, [blueprintData, completedPhases]);

  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      {/* Top Navigation Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Feather name="arrow-left" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>AI Career Roadmap</Text>
          <Text style={styles.headerSub}>Personalized Blueprint & Milestones</Text>
        </View>
      </View>

      {/* STEP 1: CAREER SELECTION */}
      {step === 1 && (
        <View style={{ flex: 1 }}>
          <View style={styles.filterSection}>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>What would you like to become?</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
              {CAREER_CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip, 
                    { backgroundColor: colors.card, borderColor: colors.cardBorder },
                    activeCategory === cat && styles.categoryChipActive
                  ]}
                  onPress={() => setActiveCategory(cat)}
                >
                  <Text style={[
                    styles.categoryChipText, 
                    { color: colors.textSecondary },
                    activeCategory === cat && styles.categoryChipTextActive
                  ]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView contentContainerStyle={styles.careersGrid} showsVerticalScrollIndicator={false}>
            {filteredCareers.map((item, idx) => (
              <Animated.View key={item.id} entering={FadeInDown.delay(idx * 30).springify()}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setSelectedCareerId(item.id);
                    setStep(2);
                  }}
                >
                  <GlassCard style={styles.careerCard}>
                    <View style={styles.careerCardHeader}>
                      <View style={styles.careerIconCircle}>
                        <Feather name={(item.icon as any) || 'code'} size={20} color="#60A5FA" />
                      </View>
                      <View style={[styles.diffBadge, { backgroundColor: colors.inputBg }]}>
                        <Text style={[styles.diffText, { color: colors.textSecondary }]}>{item.difficulty}</Text>
                      </View>
                    </View>
                    <Text style={[styles.careerTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                    <Text style={styles.careerCategory}>{item.category}</Text>
                    <Text style={[styles.careerDesc, { color: colors.textSecondary }]} numberOfLines={2}>{item.overview}</Text>
                  </GlassCard>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* STEP 2: PROFILE FORM */}
      {step === 2 && (
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, marginBottom: 16, paddingTop: 6 }} onPress={() => setStep(1)}>
            <Feather name="arrow-left" size={16} color={colors.primary} />
            <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>Choose Another Career</Text>
          </TouchableOpacity>

          <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Customize Your Profile Metrics</Text>
          <Text style={[styles.stepSub, { color: colors.textMuted }]}>Our AI model synthesizes your CGPA, target company, and study hours to build your blueprint.</Text>

          <GlassCard style={styles.formCard}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Student Full Name</Text>
              <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={studentName} onChangeText={setStudentName} placeholder="Your Name" placeholderTextColor={colors.inputPlaceholder} />
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Academic Branch</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={branch} onChangeText={setBranch} placeholder="CSE / ECE" placeholderTextColor={colors.inputPlaceholder} />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Current CGPA</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={cgpa} onChangeText={setCgpa} keyboardType="numeric" placeholder="8.5" placeholderTextColor={colors.inputPlaceholder} />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Target Company</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={targetCompany} onChangeText={setTargetCompany} placeholder="Google / TCS / Amazon" placeholderTextColor={colors.inputPlaceholder} />
              </View>
              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Study Hours/Day</Text>
                <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.textPrimary }]} value={studyHours} onChangeText={setStudyHours} keyboardType="numeric" placeholder="3" placeholderTextColor={colors.inputPlaceholder} />
              </View>
            </View>

            <TouchableOpacity style={styles.submitBtn} onPress={handleGenerateBlueprint}>
              <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.submitGradient}>
                <Feather name="compass" size={18} color="#FFF" style={{ marginRight: 8 }} />
                <Text style={styles.submitBtnText}>Synthesize Career Blueprint</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </ScrollView>
      )}

      {/* STEP 3: 17-SECTION PERSONALIZED CAREER BLUEPRINT */}
      {step === 3 && (
        <View style={{ flex: 1 }}>
          {loading || !blueprintData ? (
            <View style={{ gap: 16, padding: 20 }}>
              <SkeletonLoader height={180} borderRadius={20} />
              <SkeletonLoader height={120} borderRadius={16} />
              <SkeletonLoader height={120} borderRadius={16} />
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.blueprintScroll} showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, marginBottom: 16, paddingHorizontal: 4, paddingTop: 6 }} onPress={() => setStep(1)}>
                <Feather name="arrow-left" size={16} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 13 }}>Choose Another Career</Text>
              </TouchableOpacity>

              {/* SECTION 1: HEADER & AI SUMMARY */}
              <GlassCard style={styles.headerCard}>
                <View style={styles.greetingRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.greetingTitle, { color: colors.textPrimary }]}>Hello {blueprintData.userProfile.name} 👋</Text>
                    <Text style={styles.greetingSub}>Target: {blueprintData.blueprint.title} @ {blueprintData.userProfile.targetCompany}</Text>
                  </View>
                  <TouchableOpacity onPress={handleToggleBookmark} style={styles.bookmarkBtn}>
                    <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={22} color="#60A5FA" />
                  </TouchableOpacity>
                </View>

                <View style={styles.profileMetaGrid}>
                  <View style={[styles.profileMetaBox, { backgroundColor: colors.inputBg }]}><Text style={[styles.metaBoxLabel, { color: colors.textMuted }]}>BRANCH</Text><Text style={[styles.metaBoxVal, { color: colors.textPrimary }]}>{blueprintData.userProfile.branch}</Text></View>
                  <View style={[styles.profileMetaBox, { backgroundColor: colors.inputBg }]}><Text style={[styles.metaBoxLabel, { color: colors.textMuted }]}>CGPA</Text><Text style={[styles.metaBoxVal, { color: colors.textPrimary }]}>{blueprintData.userProfile.cgpa}</Text></View>
                  <View style={[styles.profileMetaBox, { backgroundColor: colors.inputBg }]}><Text style={[styles.metaBoxLabel, { color: colors.textMuted }]}>DAILY STUDY</Text><Text style={[styles.metaBoxVal, { color: colors.textPrimary }]}>{blueprintData.userProfile.studyHoursPerDay} Hrs/Day</Text></View>
                </View>

                <View style={[styles.aiSummaryBox, { backgroundColor: isDark ? 'rgba(96, 165, 250, 0.08)' : 'rgba(96, 165, 250, 0.15)', borderColor: 'rgba(96, 165, 250, 0.25)' }]}>
                  <Feather name="message-square" size={14} color="#60A5FA" style={{ marginTop: 2 }} />
                  <Text style={[styles.aiSummaryText, { color: colors.textPrimary }]}>{blueprintData.aiSummary}</Text>
                </View>
              </GlassCard>

              {/* SECTION 2: CAREER READINESS SCORE */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Career Readiness Score</Text>
                <View style={styles.readinessRow}>
                  <View style={styles.scoreGauge}>
                    <Text style={styles.scoreNumber}>{blueprintData.currentScore}%</Text>
                    <Text style={[styles.scoreSub, { color: colors.textMuted }]}>Current Score</Text>
                  </View>
                  <View style={styles.scoreGauge}>
                    <Text style={[styles.scoreNumber, { color: '#10B981' }]}>{blueprintData.potentialScore}%</Text>
                    <Text style={[styles.scoreSub, { color: colors.textMuted }]}>Potential Score</Text>
                  </View>
                </View>
                <View style={styles.progressContainer}>
                  <View style={[styles.progressBarTrack, { backgroundColor: colors.border }]}>
                    <View style={[styles.progressBarFill, { width: `${blueprintData.currentScore}%` }]} />
                  </View>
                </View>
              </GlassCard>

              {/* SECTION 3: SKILL GAP ANALYSIS */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Skill Gap Analysis</Text>
                <Text style={styles.subHeading}>Current Acquired Skills</Text>
                <View style={styles.tagRow}>
                  {blueprintData.blueprint.currentSkillsSample.map((s) => (
                    <View key={s} style={styles.greenTag}><Text style={styles.greenTagText}>✓ {s}</Text></View>
                  ))}
                </View>
                <Text style={[styles.subHeading, { marginTop: 12 }]}>Missing Critical Skills to Acquire</Text>
                <View style={styles.tagRow}>
                  {blueprintData.blueprint.missingSkills.map((s) => (
                    <View key={s} style={styles.redTag}><Text style={styles.redTagText}>+ {s}</Text></View>
                  ))}
                </View>
              </GlassCard>

              {/* SECTION 4: LEARNING PATH & TIMELINE */}
              <View style={{ marginTop: rs(12), marginBottom: rs(8) }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: rs(8) }}>
                  <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>Personalized Learning Path</Text>
                  <View style={styles.compBadgeHeader}>
                    <Text style={styles.compBadgeHeaderText}>{completionPercentage}% Completed</Text>
                  </View>
                </View>

                <View style={[styles.pathTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0' }]}>
                  <View style={[styles.pathFill, { width: `${completionPercentage}%` }]} />
                </View>
              </View>

              {blueprintData.blueprint.phases.map((phase, pIdx) => {
                const isComp = completedPhases.includes(phase.id);
                const isExp = !!expandedPhases[phase.id];
                const phaseNum = pIdx + 1;

                return (
                  <GlassCard key={phase.id} style={styles.phaseCard}>
                    <View style={styles.phaseMainRow}>
                      {/* Left Step Node Indicator */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleTogglePhase(phase.id)}
                        style={[
                          styles.nodeCircle,
                          isComp ? styles.nodeCircleComp : styles.nodeCircleActive
                        ]}
                      >
                        {isComp ? (
                          <Feather name="check" size={14} color="#FFF" />
                        ) : (
                          <Text style={styles.nodeNum}>{phaseNum}</Text>
                        )}
                      </TouchableOpacity>

                      {/* Middle Title & Meta */}
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => toggleExpand(phase.id)}
                        style={{ flex: 1, paddingHorizontal: rs(10) }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <Text style={styles.phaseStepTag}>PHASE 0{phaseNum}</Text>
                          <Text style={styles.phaseTimeTag}>• {phase.estimatedTime}</Text>
                        </View>

                        <Text
                          style={[
                            styles.phaseTitleText,
                            { color: colors.textPrimary },
                            isComp && styles.phaseTitleComp
                          ]}
                        >
                          {phase.title}
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                          <View style={styles.rewardTag}>
                            <Text style={styles.rewardTagText}>⭐ +35 Points</Text>
                          </View>
                          {isComp && (
                            <Text style={{ fontSize: rf(11), color: '#10B981', fontWeight: '800' }}>✅ Verified</Text>
                          )}
                        </View>
                      </TouchableOpacity>

                      {/* Right Action: Expand/Collapse */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => toggleExpand(phase.id)}
                        style={styles.expandToggleBtn}
                      >
                        <Feather name={isExp ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textMuted} />
                      </TouchableOpacity>
                    </View>

                    {/* Expanded Body Topics & Content */}
                    {isExp && (
                      <View style={[styles.phaseBody, { borderTopColor: colors.border }]}>
                        <Text style={[styles.phaseDesc, { color: colors.textSecondary }]}>{phase.description}</Text>
                        <Text style={[styles.subHeading, { marginTop: 6, marginBottom: 4 }]}>Core Competencies & Topics:</Text>
                        {phase.topics.map((t) => (
                          <View key={t} style={styles.topicRow}>
                            <Ionicons name="checkmark-circle" size={16} color={isComp ? "#10B981" : "#3B82F6"} />
                            <Text style={[styles.topicText, { color: colors.textSecondary }]}>{t}</Text>
                          </View>
                        ))}

                        {/* Action CTA inside phase */}
                        <TouchableOpacity
                          activeOpacity={0.8}
                          onPress={() => handleTogglePhase(phase.id)}
                          style={[
                            styles.phaseActionBtn,
                            { backgroundColor: isComp ? 'rgba(16, 185, 129, 0.15)' : '#3B82F6' }
                          ]}
                        >
                          <Text style={[styles.phaseActionText, { color: isComp ? '#10B981' : '#FFFFFF' }]}>
                            {isComp ? '✅ Phase Completed (+35 Points Earned)' : 'Mark Phase Completed (⭐ +35 Points)'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </GlassCard>
                );
              })}

              {/* SECTION 5: WEEKLY STUDY SCHEDULE */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Weekly Study Schedule</Text>
                {Object.entries(blueprintData.blueprint.weeklySchedule).map(([day, task]) => (
                  <View key={day} style={[styles.scheduleRow, { borderBottomColor: colors.border }]}>
                    <Text style={styles.dayLabel}>{day}</Text>
                    <Text style={[styles.dayTask, { color: colors.textPrimary }]}>{task}</Text>
                  </View>
                ))}
              </GlassCard>

              {/* SECTION 6: MONTHLY MILESTONES */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Monthly Milestones</Text>
                <View style={styles.milestoneGrid}>
                  {blueprintData.blueprint.monthlyGoals.map((m) => (
                    <View key={m.month} style={[styles.milestoneBox, { backgroundColor: colors.inputBg }]}>
                      <Text style={styles.milestoneMonth}>{m.month}</Text>
                      <Text style={[styles.milestoneGoal, { color: colors.textPrimary }]}>{m.goal}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>

              {/* SECTION 7: RECOMMENDED PROJECTS */}
              <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>Portfolio Project Recommendations</Text>
              {blueprintData.blueprint.projects.map((p) => (
                <GlassCard key={p.name} style={styles.subCard}>
                  <Text style={[styles.subCardTitle, { color: colors.textPrimary }]}>{p.name}</Text>
                  <Text style={[styles.subCardDesc, { color: colors.textSecondary }]}>{p.description}</Text>
                  <View style={styles.tagRow}>
                    {p.tech.map((t) => (
                      <View key={t} style={[styles.miniTag, { backgroundColor: colors.inputBg }]}><Text style={[styles.miniTagText, { color: colors.textSecondary }]}>{t}</Text></View>
                    ))}
                  </View>
                </GlassCard>
              ))}

              {/* SECTION 8 & 9: CERTIFICATIONS & SOFT SKILLS */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Certifications & Soft Skills</Text>
                <Text style={styles.subHeading}>Certifications</Text>
                {blueprintData.blueprint.certifications.map((c) => (
                  <View key={c} style={styles.topicRow}><Feather name="award" size={14} color="#F59E0B" /><Text style={[styles.topicText, { color: colors.textSecondary }]}>{c}</Text></View>
                ))}
                <Text style={[styles.subHeading, { marginTop: 12 }]}>Key Soft Skills</Text>
                <View style={styles.tagRow}>
                  {blueprintData.blueprint.softSkills.map((sk) => (
                    <View key={sk} style={styles.softTag}><Text style={styles.softTagText}>{sk}</Text></View>
                  ))}
                </View>
              </GlassCard>

              {/* SECTION 10 & 11: PLACEMENT & COMPANY PREP */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Placement & Company Preparation ({blueprintData.userProfile.targetCompany})</Text>
                <View style={styles.quotaRow}>
                  <View style={[styles.quotaBox, { backgroundColor: colors.inputBg }]}><Text style={styles.quotaVal}>{blueprintData.blueprint.placementPrep.easyProblems}</Text><Text style={[styles.quotaLab, { color: colors.textMuted }]}>Easy Problems</Text></View>
                  <View style={[styles.quotaBox, { backgroundColor: colors.inputBg }]}><Text style={styles.quotaVal}>{blueprintData.blueprint.placementPrep.mediumProblems}</Text><Text style={[styles.quotaLab, { color: colors.textMuted }]}>Medium Problems</Text></View>
                  <View style={[styles.quotaBox, { backgroundColor: colors.inputBg }]}><Text style={styles.quotaVal}>{blueprintData.blueprint.placementPrep.hardProblems}</Text><Text style={[styles.quotaLab, { color: colors.textMuted }]}>Hard Problems</Text></View>
                </View>
              </GlassCard>

              {/* SECTION 12, 13, 14: LEARNING RESOURCES */}
              <GlassCard style={styles.sectionCard}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Recommended Resources</Text>
                <Text style={styles.subHeading}>Recommended Books</Text>
                {blueprintData.blueprint.recommendedBooks.map((b) => (
                  <View key={b} style={styles.topicRow}><Feather name="book-open" size={14} color="#60A5FA" /><Text style={[styles.topicText, { color: colors.textSecondary }]}>{b}</Text></View>
                ))}
                <Text style={[styles.subHeading, { marginTop: 12 }]}>YouTube Channels & Portals</Text>
                <View style={styles.tagRow}>
                  {blueprintData.blueprint.youtubeChannels.map((y) => (
                    <View key={y} style={[styles.miniTag, { backgroundColor: colors.inputBg }]}><Text style={[styles.miniTagText, { color: colors.textSecondary }]}>{y}</Text></View>
                  ))}
                </View>
              </GlassCard>

              {/* SECTION 15: MOTIVATIONAL AI INSIGHT */}
              <GlassCard style={[styles.sectionCard, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.15)', borderColor: 'rgba(59, 130, 246, 0.3)' }]}>
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
                  <Feather name="zap" size={20} color="#3B82F6" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: rf(14), fontWeight: '900', color: colors.textPrimary }}>AI Motivation Insight</Text>
                    <Text style={{ fontSize: rf(12), color: colors.textSecondary, lineHeight: 18, marginTop: 4 }}>{blueprintData.blueprint.motivationalMessage}</Text>
                  </View>
                </View>
              </GlassCard>

              {/* SECTION 17: FUTURE AI EXPANSION MODULES */}
              <Text style={[styles.sectionHeader, { color: colors.textPrimary }]}>Upcoming AI Extensions</Text>
              <View style={styles.futureGrid}>
                {['AI Mentor Assistant', 'AI Mock Interview Coach', 'ATS Resume Analyzer', 'Job Match Predictor'].map((feat) => (
                  <View key={feat} style={[styles.futureCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                    <Feather name="lock" size={16} color={colors.textMuted} />
                    <Text style={[styles.futureTitle, { color: colors.textPrimary }]}>{feat}</Text>
                    <Text style={styles.futureBadge}>Coming Soon</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingTop: rs(54), paddingHorizontal: rs(20), paddingBottom: rs(16), flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  backBtn: { width: rs(40), height: rs(40), borderRadius: rs(12), backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: rf(18), fontWeight: '900', color: '#FFF' },
  headerSub: { fontSize: rf(11), color: 'rgba(255,255,255,0.4)', fontWeight: '600' },
  aiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(96, 165, 250, 0.12)', paddingHorizontal: rs(10), paddingVertical: rs(5), borderRadius: rs(8), borderWidth: 1, borderColor: 'rgba(96, 165, 250, 0.3)' },
  aiBadgeText: { fontSize: rf(10), fontWeight: '800', color: '#60A5FA' },
  filterSection: { paddingHorizontal: rs(20), marginTop: rs(14), gap: rs(12) },
  stepTitle: { fontSize: rf(18), fontWeight: '900', color: '#FFF' },
  stepSub: { fontSize: rf(12), color: 'rgba(255,255,255,0.5)', marginTop: rs(4), marginBottom: rs(12) },
  searchBox: { height: rs(46), backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: rs(14), flexDirection: 'row', alignItems: 'center', paddingHorizontal: rs(14), borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  searchInput: { flex: 1, marginLeft: rs(10), color: '#FFF', fontSize: rf(13) },
  categoryRow: { gap: rs(8), paddingVertical: rs(4) },
  categoryChip: { paddingHorizontal: rs(14), paddingVertical: rs(7), borderRadius: rs(10), backgroundColor: 'rgba(255,255,255,0.03)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  categoryChipActive: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  categoryChipText: { fontSize: rf(11), fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  categoryChipTextActive: { color: '#FFF', fontWeight: '900' },
  careersGrid: { padding: rs(20), gap: rs(12), paddingBottom: rs(100) },
  careerCard: { padding: rs(16), gap: rs(6) },
  careerCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  careerIconCircle: { width: rs(36), height: rs(36), borderRadius: rs(10), backgroundColor: 'rgba(96, 165, 250, 0.12)', alignItems: 'center', justifyContent: 'center' },
  diffBadge: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: rs(8), paddingVertical: rs(4), borderRadius: rs(6) },
  diffText: { fontSize: rf(9), color: 'rgba(255,255,255,0.6)', fontWeight: '800' },
  careerTitle: { fontSize: rf(16), fontWeight: '900', color: '#FFF' },
  careerCategory: { fontSize: rf(10), fontWeight: '800', color: '#60A5FA' },
  careerDesc: { fontSize: rf(12), color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  formContainer: { padding: rs(20), gap: rs(16) },
  formCard: { padding: rs(18), gap: rs(14) },
  formGroup: { gap: rs(6) },
  formRow: { flexDirection: 'row', gap: rs(10) },
  label: { fontSize: rf(11), fontWeight: '800', color: 'rgba(255,255,255,0.6)' },
  input: { height: rs(44), backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: rs(10), paddingHorizontal: rs(12), color: '#FFF', fontSize: rf(13), borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  submitBtn: { borderRadius: rs(14), overflow: 'hidden', marginTop: rs(10) },
  submitGradient: { height: rs(50), alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  submitBtnText: { fontSize: rf(14), fontWeight: '900', color: '#FFF' },
  blueprintScroll: { padding: rs(20), gap: rs(16), paddingBottom: rs(120) },
  headerCard: { padding: rs(18), gap: rs(12) },
  greetingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  greetingTitle: { fontSize: rf(20), fontWeight: '900', color: '#FFF' },
  greetingSub: { fontSize: rf(12), color: '#60A5FA', fontWeight: '700', marginTop: 2 },
  bookmarkBtn: { padding: rs(4) },
  profileMetaGrid: { flexDirection: 'row', gap: rs(8) },
  profileMetaBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: rs(8), borderRadius: rs(8), alignItems: 'center' },
  metaBoxLabel: { fontSize: rf(8), fontWeight: '800', color: 'rgba(255,255,255,0.4)' },
  metaBoxVal: { fontSize: rf(11), fontWeight: '900', color: '#FFF', marginTop: 2 },
  aiSummaryBox: { flexDirection: 'row', gap: rs(8), backgroundColor: 'rgba(96, 165, 250, 0.08)', padding: rs(12), borderRadius: rs(10), borderWidth: 1, borderColor: 'rgba(96, 165, 250, 0.2)' },
  aiSummaryText: { fontSize: rf(12), color: 'rgba(255,255,255,0.85)', lineHeight: 18, flex: 1 },
  sectionCard: { padding: rs(16), gap: rs(12) },
  sectionTitle: { fontSize: rf(15), fontWeight: '900', color: '#FFF' },
  sectionHeader: { fontSize: rf(16), fontWeight: '900', color: '#FFF', marginTop: rs(8) },
  readinessRow: { flexDirection: 'row', justifyContent: 'space-around' },
  scoreGauge: { alignItems: 'center' },
  scoreNumber: { fontSize: rf(28), fontWeight: '900', color: '#3B82F6' },
  scoreSub: { fontSize: rf(10), color: 'rgba(255,255,255,0.5)', fontWeight: '700', marginTop: 2 },
  progressContainer: { gap: rs(4) },
  progressBarTrack: { height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#3B82F6', borderRadius: 4 },
  subHeading: { fontSize: rf(12), fontWeight: '800', color: '#60A5FA' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: rs(6) },
  greenTag: { backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: rs(10), paddingVertical: rs(5), borderRadius: rs(6) },
  greenTagText: { fontSize: rf(11), color: '#10B981', fontWeight: '800' },
  redTag: { backgroundColor: 'rgba(239, 68, 68, 0.12)', paddingHorizontal: rs(10), paddingVertical: rs(5), borderRadius: rs(6) },
  redTagText: { fontSize: rf(11), color: '#EF4444', fontWeight: '800' },
  compBadgeHeader: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: rs(10),
    paddingVertical: rs(4),
    borderRadius: rs(8),
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  compBadgeHeaderText: {
    fontSize: rf(11),
    fontWeight: '800',
    color: '#10B981',
  },
  pathTrack: {
    height: rs(6),
    borderRadius: rs(3),
    overflow: 'hidden',
    marginBottom: rs(12),
  },
  pathFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: rs(3),
  },
  phaseCard: { padding: rs(14), gap: rs(8), marginBottom: rs(12) },
  phaseMainRow: { flexDirection: 'row', alignItems: 'center' },
  nodeCircle: {
    width: rs(32),
    height: rs(32),
    borderRadius: rs(16),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  nodeCircleActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderColor: '#3B82F6',
  },
  nodeCircleComp: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  nodeNum: {
    fontSize: rf(12),
    fontWeight: '900',
    color: '#3B82F6',
  },
  phaseStepTag: {
    fontSize: rf(9),
    fontWeight: '900',
    color: '#3B82F6',
    letterSpacing: 0.5,
  },
  phaseTimeTag: {
    fontSize: rf(10),
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
  },
  phaseTitleText: {
    fontSize: rf(14),
    fontWeight: '800',
    lineHeight: 20,
    flexShrink: 1,
  },
  phaseTitleComp: {
    color: 'rgba(255,255,255,0.6)',
  },
  rewardTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: rs(8),
    paddingVertical: rs(3),
    borderRadius: rs(6),
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  rewardTagText: {
    fontSize: rf(10),
    fontWeight: '800',
    color: '#F59E0B',
  },
  expandToggleBtn: {
    padding: rs(6),
  },
  phaseActionBtn: {
    paddingVertical: rs(10),
    paddingHorizontal: rs(14),
    borderRadius: rs(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: rs(8),
  },
  phaseActionText: {
    fontSize: rf(12),
    fontWeight: '800',
  },
  phaseBody: { marginTop: rs(8), gap: rs(8), borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)', paddingTop: rs(8) },
  phaseDesc: { fontSize: rf(12), color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  topicRow: { flexDirection: 'row', gap: rs(8), alignItems: 'center' },
  topicText: { fontSize: rf(12), color: '#FFF', fontWeight: '600' },
  scheduleRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: rs(4), borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)' },
  dayLabel: { fontSize: rf(12), fontWeight: '800', color: '#60A5FA' },
  dayTask: { fontSize: rf(12), color: '#FFF', fontWeight: '600' },
  milestoneGrid: { gap: rs(8) },
  milestoneBox: { backgroundColor: 'rgba(255,255,255,0.03)', padding: rs(10), borderRadius: rs(8) },
  milestoneMonth: { fontSize: rf(11), fontWeight: '900', color: '#60A5FA' },
  milestoneGoal: { fontSize: rf(12), color: '#FFF', marginTop: 2 },
  subCard: { padding: rs(14), gap: rs(6) },
  subCardTitle: { fontSize: rf(14), fontWeight: '900', color: '#FFF' },
  subCardDesc: { fontSize: rf(12), color: 'rgba(255,255,255,0.6)', lineHeight: 18 },
  miniTag: { backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: rs(8), paddingVertical: rs(4), borderRadius: rs(6) },
  miniTagText: { fontSize: rf(10), color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
  softTag: { backgroundColor: 'rgba(139, 92, 246, 0.12)', paddingHorizontal: rs(10), paddingVertical: rs(5), borderRadius: rs(6) },
  softTagText: { fontSize: rf(11), color: '#A78BFA', fontWeight: '800' },
  quotaRow: { flexDirection: 'row', gap: rs(8) },
  quotaBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: rs(10), borderRadius: rs(8), alignItems: 'center' },
  quotaVal: { fontSize: rf(18), fontWeight: '900', color: '#60A5FA' },
  quotaLab: { fontSize: rf(9), color: 'rgba(255,255,255,0.5)', fontWeight: '700', marginTop: 2 },
  futureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: rs(10) },
  futureCard: { width: (width - rs(50)) / 2, backgroundColor: 'rgba(255,255,255,0.02)', padding: rs(14), borderRadius: rs(12), gap: rs(6), borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', opacity: 0.7 },
  futureTitle: { fontSize: rf(12), fontWeight: '800', color: '#FFF' },
  futureBadge: { fontSize: rf(9), color: '#60A5FA', fontWeight: '800' },
});
