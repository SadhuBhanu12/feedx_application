import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Share,
  Image
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS, RADIUS, SHADOWS, SPACING } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { validateText, validateNumberRange } from '@/utils/validation';
import { useRouter } from 'expo-router';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import {
  getCommunityPosts, createCommunityPost, togglePostLike, createCommunityComment,
  getForumQuestions, createForumQuestion, toggleQuestionUpvote, createForumReply,
  getProjectCollaborations, createProjectCollaboration, toggleCollabApply,
  getStudyGroups, createStudyGroup, toggleJoinStudyGroup,
  getPlacementExperiences, createPlacementExperience,
  getMarketplaceItems, createMarketplaceItem, markMarketplaceItemSold,
  getAlumniDirectory, getNotifications, uploadCommunityImage, getClubs
} from '@/services/supabaseService';

const { width } = Dimensions.get('window');

export default function JoinUsScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [currentView, setCurrentView] = useState('home'); // home, feed, forum, collaboration, groups, placement, marketplace, clubs, alumni, reputation
  
  // App States
  const [xp, setXp] = useState(380);
  const [feedPosts, setFeedPosts] = useState([]);
  const [forumQuestions, setForumQuestions] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [studyGroups, setStudyGroups] = useState([]);
  const [placementPosts, setPlacementPosts] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [clubs, setClubs] = useState([]);

  // Input states for creation modals
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostType, setNewPostType] = useState('achievement'); // achievement, certification, internship, project
  const [selectedPostImage, setSelectedPostImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionDesc, setNewQuestionDesc] = useState('');
  const [newQuestionCat, setNewQuestionCat] = useState('DSA');

  const [newColTitle, setNewColTitle] = useState('');
  const [newColSkills, setNewColSkills] = useState('');
  const [newColDesc, setNewColDesc] = useState('');

  const [newMarketTitle, setNewMarketTitle] = useState('');
  const [newMarketPrice, setNewMarketPrice] = useState('');
  const [newMarketCond, setNewMarketCond] = useState('Like New');
  const [newMarketDesc, setNewMarketDesc] = useState('');

  // Active Filters
  const [forumFilter, setForumFilter] = useState('All');
  const [marketFilter, setMarketFilter] = useState('All');

  // Modals Visibility
  const [activeModal, setActiveModal] = useState(null); // post, question, collab, marketplace
  
  // Selected Details
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [newAnswerText, setNewAnswerText] = useState('');
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [newCommentText, setNewCommentText] = useState('');

  // Hardware Back Handler Setup
  useEffect(() => {
    const onBackPress = () => {
      if (currentView !== 'home') {
        if (selectedQuestion) {
          setSelectedQuestion(null);
        } else {
          setCurrentView('home');
        }
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => backHandler.remove();
  }, [currentView, selectedQuestion]);

  const addXp = (amount) => {
    setXp((prev) => prev + amount);
  };

  const renderFormattedTaggedContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(@[a-zA-Z0-9_.-]+|#[a-zA-Z0-9_.-]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <Text key={index} style={{ color: '#38BDF8', fontWeight: '800' }}>
            {part}
          </Text>
        );
      }
      if (part.startsWith('#')) {
        return (
          <Text key={index} style={{ color: '#C084FC', fontWeight: '800' }}>
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  const getReputationLevel = (pts) => {
    if (pts < 200) return 'Beginner Tier';
    if (pts < 400) return 'Contributor Tier';
    if (pts < 600) return 'Expert Tier';
    if (pts < 900) return 'Mentor Tier';
    return 'Campus Leader';
  };

  // Real-time Supabase loading hook
  const loadRealtimeData = async () => {
    if (!user?.id) return;
    try {
      const posts = await getCommunityPosts(0, 20, 'All', '', 'Newest', user.id);
      setFeedPosts(posts && posts.length > 0 ? posts.map(p => ({
        id: p.id,
        author: p.author_name || p.users?.full_name || 'Anonymous',
        roll: p.author_roll || 'ST-2026',
        role: p.author_role || p.users?.role || 'Student',
        avatar: p.users?.avatar_url || null,
        image: p.image_url || null,
        images: p.images || [],
        time: p.created_at ? new Date(p.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent',
        type: p.type || 'general',
        content: p.content || p.caption || '',
        likes: p.likes || p.likes_count || 0,
        hasLiked: Boolean(p.hasLiked),
        comments: p.comments?.map(c => ({
          id: c.id,
          author: c.users?.full_name || c.author_name || 'Anonymous',
          avatar: c.users?.avatar_url || null,
          content: c.comment_text || c.content
        })) || []
      })) : []);

      const questions = await getForumQuestions(user.college_id);
      setForumQuestions(questions && questions.length > 0 ? questions.map(q => ({
        id: q.id,
        title: q.title,
        desc: q.description,
        category: q.category || 'General',
        upvotes: q.upvotes_count || 0,
        hasUpvoted: q.upvotes?.some(u => u.user_id === user.id) || false,
        replies: q.replies?.map(r => ({
          id: r.id,
          author: r.author_name || 'Anonymous',
          content: r.content
        })) || []
      })) : []);

      const collabs = await getProjectCollaborations(user.college_id);
      setCollaborations(collabs && collabs.length > 0 ? collabs.map(col => ({
        id: col.id,
        title: col.title,
        author: col.author_name || 'Coordinator',
        branch: col.branch || 'CSE',
        skills: Array.isArray(col.skills) ? col.skills : (col.skills ? String(col.skills).split(',').map(s => s.trim()).filter(Boolean) : []),
        desc: col.description,
        applied: col.applications?.some(a => a.user_id === user.id) || false
      })) : []);

      const groups = await getStudyGroups(user.college_id);
      setStudyGroups(groups && groups.length > 0 ? groups.map(g => ({
        id: g.id,
        title: g.title,
        subject: g.subject || 'General',
        members: g.members_count || 1,
        filesCount: g.files_count || 0,
        joined: g.members?.some(m => m.user_id === user.id) || false
      })) : []);

      const marketplace = await getMarketplaceItems(user.college_id);
      setMarketplaceItems(marketplace && marketplace.length > 0 ? marketplace.map(m => ({
        id: m.id,
        title: m.title,
        price: m.price || 0,
        condition: m.condition || 'Good',
        category: m.category || 'Books',
        description: m.description,
        sold: m.is_sold || false,
        author: m.author_name || 'Seller',
        user_id: m.user_id || ''
      })) : []);

      const placements = await getPlacementExperiences(user.college_id);
      setPlacementPosts(placements && placements.length > 0 ? placements.map(pl => ({
        id: pl.id,
        title: pl.title,
        author: pl.author_name || 'Alum',
        company: pl.company || 'Company',
        content: pl.content,
        date: pl.created_at ? new Date(pl.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'
      })) : []);

      const notifs = await getNotifications(user.id);
      setAnnouncements(notifs && notifs.length > 0 ? notifs.slice(0, 3).map(n => ({
        id: n.id,
        title: n.title,
        type: n.type || 'admin',
        date: n.created_at ? new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'
      })) : []);

      const alumniList = await getAlumniDirectory(user.college_id);
      setAlumni(alumniList || []);

      const clubsList = await getClubs(user.college_id);
      setClubs(clubsList || []);
    } catch (e) {
      console.warn("Real-time DB connection warning: ", e);
    }
  };

  useEffect(() => {
    loadRealtimeData();

    if (!user?.id) return;

    // Realtime channel for JoinUsScreen community tables
    const channel = supabase.channel(`joinus-realtime-${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_comments' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_likes' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_questions' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_replies' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'forum_upvotes' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_collaborations' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'collaboration_applications' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_groups' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'study_group_members' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'placement_experiences' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'marketplace_items' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alumni_directory' }, () => loadRealtimeData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clubs' }, () => loadRealtimeData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, currentView]);

  if (!user) {
    return <FullScreenLoader message="Checking user session..." />;
  }

  // Action Handlers backed by database operations
  const handlePickPostImage = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedPostImage(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('Error picking image:', err);
    }
  };

  const handleCreatePost = async () => {
    const contentCheck = validateText(newPostContent, { min: 5, max: 1000, fieldName: 'Post Content' });
    if (!contentCheck.isValid) {
      Alert.alert('Validation Error', contentCheck.error);
      return;
    }
    setUploadingImage(true);
    let uploadedUrl = null;
    try {
      if (selectedPostImage) {
        uploadedUrl = await uploadCommunityImage(user.id, selectedPostImage);
      }
      
      const roleStr = user?.role === 'super_admin' ? 'Super Admin' : (user?.role === 'inst_admin' ? 'Admin' : 'Student');
      
      await createCommunityPost({
        college_id: user?.college_id || null,
        user_id: user?.id || null,
        author_name: user?.full_name || 'Anonymous Student',
        author_roll: user?.roll_no || user?.roll_number || 'ST-2026',
        author_role: roleStr,
        content: newPostContent.trim(),
        type: newPostType,
        image_url: uploadedUrl
      });
      setNewPostContent('');
      setSelectedPostImage(null);
      setActiveModal(null);
      addXp(15);
      await loadRealtimeData();
      Alert.alert('Post Shared!', 'You earned +15 XP for contributing to the feed!');
    } catch (err) {
      console.error(err);
      // Local Fallback
      const newPost = {
        id: `p_${Date.now()}`,
        author: user?.full_name || 'Anonymous Student',
        roll: user?.roll_no || user?.roll_number || 'ST-2026',
        role: user?.role === 'super_admin' ? 'Super Admin' : (user?.role === 'inst_admin' ? 'Admin' : 'Student'),
        time: 'Just now',
        type: newPostType,
        content: newPostContent.trim(),
        image: selectedPostImage,
        likes: 0,
        hasLiked: false,
        comments: []
      };
      setFeedPosts([newPost, ...feedPosts]);
      setNewPostContent('');
      setSelectedPostImage(null);
      setActiveModal(null);
      addXp(15);
      Alert.alert('Post Shared!', 'Created local draft. Run community_and_innovation.sql in Supabase for live sync.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLikePost = async (postId) => {
    const post = feedPosts.find(p => p.id === postId);
    if (!post || !user?.id) return;
    const prevLiked = Boolean(post.hasLiked);
    const prevCount = post.likes || 0;

    // Optimistic update
    setFeedPosts(prev => prev.map(p => p.id === postId ? {
      ...p,
      hasLiked: !prevLiked,
      likes: prevLiked ? Math.max(0, prevCount - 1) : prevCount + 1
    } : p));

    try {
      const res = await togglePostLike(postId, user.id, prevLiked);
      if (res) {
        setFeedPosts(prev => prev.map(p => p.id === postId ? {
          ...p,
          hasLiked: res.hasLiked,
          likes: res.likes
        } : p));
      }
    } catch {
      setFeedPosts(prev => prev.map(p => p.id === postId ? {
        ...p,
        hasLiked: prevLiked,
        likes: prevCount
      } : p));
    }
  };

  const handleAddComment = async (postId) => {
    if (!newCommentText.trim()) return;
    try {
      const comment = await createCommunityComment(postId, user.id, newCommentText.trim());
      setFeedPosts(feedPosts.slice(0, 15).map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, {
              id: comment.id,
              author: comment.users?.full_name || user.full_name || 'Anonymous',
              avatar: comment.users?.avatar_url || user.avatar_url || null,
              content: comment.comment_text
            }]
          };
        }
        return p;
      }));
      setNewCommentText('');
      addXp(5);
    } catch (e) {
      console.error(e);
      setFeedPosts(feedPosts.slice(0, 15).map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, {
              id: `c_${Date.now()}`,
              author: user?.full_name || 'Anonymous',
              avatar: user?.avatar_url || null,
              content: newCommentText.trim()
            }]
          };
        }
        return p;
      }));
      setNewCommentText('');
      addXp(5);
    }
  };

  const handleAskQuestion = async () => {
    const titleCheck = validateText(newQuestionTitle, { min: 5, max: 150, fieldName: 'Question Title' });
    if (!titleCheck.isValid) {
      Alert.alert('Validation Error', titleCheck.error);
      return;
    }
    const descCheck = validateText(newQuestionDesc, { min: 15, max: 1000, fieldName: 'Question Details' });
    if (!descCheck.isValid) {
      Alert.alert('Validation Error', descCheck.error);
      return;
    }
    try {
      await createForumQuestion({
        college_id: user?.college_id || null,
        user_id: user?.id || null,
        title: newQuestionTitle.trim(),
        description: newQuestionDesc.trim(),
        category: newQuestionCat
      });
      setNewQuestionTitle('');
      setNewQuestionDesc('');
      setActiveModal(null);
      addXp(20);
      await loadRealtimeData();
      Alert.alert('Question Posted!', 'You earned +20 XP for academic contribution!');
    } catch {
      const newQ = {
        id: `f_${Date.now()}`,
        title: newQuestionTitle.trim(),
        desc: newQuestionDesc.trim(),
        category: newQuestionCat,
        upvotes: 0,
        hasUpvoted: false,
        replies: []
      };
      setForumQuestions([newQ, ...forumQuestions]);
      setNewQuestionTitle('');
      setNewQuestionDesc('');
      setActiveModal(null);
      addXp(20);
      Alert.alert('Question Posted!', 'Created local draft. Run community_and_innovation.sql in Supabase for live sync.');
    }
  };

  const handleUpvoteQuestion = async (qId) => {
    const q = forumQuestions.find(item => item.id === qId);
    if (!q) return;
    try {
      const newUpvotes = await toggleQuestionUpvote(qId, user.id, q.hasUpvoted);
      setForumQuestions(forumQuestions.map(item => item.id === qId ? { ...item, upvotes: newUpvotes, hasUpvoted: !item.hasUpvoted } : item));
    } catch {
      setForumQuestions(forumQuestions.map(item => {
        if (item.id === qId) {
          return {
            ...item,
            upvotes: item.hasUpvoted ? item.upvotes - 1 : item.upvotes + 1,
            hasUpvoted: !item.hasUpvoted
          };
        }
        return item;
      }));
    }
  };

  const handleAddAnswer = async (qId) => {
    if (!newAnswerText.trim()) return;
    try {
      const reply = await createForumReply(qId, user.id, user.full_name || 'Student', newAnswerText.trim());
      const updated = forumQuestions.map(q => {
        if (q.id === qId) {
          const updatedQ = {
            ...q,
            replies: [...q.replies, {
              id: reply.id,
              author: reply.author_name,
              content: reply.content
            }]
          };
          setSelectedQuestion(updatedQ);
          return updatedQ;
        }
        return q;
      });
      setForumQuestions(updated);
      setNewAnswerText('');
      addXp(25);
    } catch {
      const updated = forumQuestions.map(q => {
        if (q.id === qId) {
          const updatedQ = {
            ...q,
            replies: [...q.replies, {
              id: `fr_${Date.now()}`,
              author: `${user?.full_name || 'Student'}`,
              content: newAnswerText.trim()
            }]
          };
          setSelectedQuestion(updatedQ);
          return updatedQ;
        }
        return q;
      });
      setForumQuestions(updated);
      setNewAnswerText('');
      addXp(25);
    }
  };

  const handleCreateCollab = async () => {
    const titleCheck = validateText(newColTitle, { min: 5, max: 100, fieldName: 'Project Title' });
    if (!titleCheck.isValid) {
      Alert.alert('Validation Error', titleCheck.error);
      return;
    }
    const descCheck = validateText(newColDesc, { min: 15, max: 1000, fieldName: 'Project Description' });
    if (!descCheck.isValid) {
      Alert.alert('Validation Error', descCheck.error);
      return;
    }
    try {
      await createProjectCollaboration({
        college_id: user?.college_id || null,
        user_id: user?.id || null,
        title: newColTitle.trim(),
        author_name: user?.full_name || 'Student Coordinator',
        branch: user?.branch || 'CSE',
        skills: newColSkills.split(',').map(s => s.trim()).filter(Boolean),
        description: newColDesc.trim()
      });
      setNewColTitle('');
      setNewColSkills('');
      setNewColDesc('');
      setActiveModal(null);
      addXp(15);
      await loadRealtimeData();
    } catch {
      const newCol = {
        id: `col_${Date.now()}`,
        title: newColTitle.trim(),
        author: user?.full_name || 'Student Coordinator',
        branch: user?.branch || 'CSE',
        skills: newColSkills.split(',').map(s => s.trim()).filter(Boolean),
        desc: newColDesc.trim(),
        applied: false
      };
      setCollaborations([newCol, ...collaborations]);
      setNewColTitle('');
      setNewColSkills('');
      setNewColDesc('');
      setActiveModal(null);
      addXp(15);
    }
  };

  const handleToggleApplyCollab = async (collabId) => {
    const collab = collaborations.find(c => c.id === collabId);
    if (!collab) return;
    try {
      const applied = await toggleCollabApply(collabId, user.id, collab.applied);
      setCollaborations(collaborations.slice(0, 15).map(c => c.id === collabId ? { ...c, applied } : c));
    } catch {
      setCollaborations(collaborations.slice(0, 15).map(c => c.id === collabId ? { ...c, applied: !c.applied } : c));
    }
  };

  const handleToggleJoinGroup = async (groupId) => {
    const group = studyGroups.find(g => g.id === groupId);
    if (!group) return;
    try {
      const members = await toggleJoinStudyGroup(groupId, user.id, group.joined);
      setStudyGroups(studyGroups.slice(0, 15).map(g => g.id === groupId ? { ...g, members, joined: !g.joined } : g));
    } catch {
      setStudyGroups(studyGroups.slice(0, 15).map(g => g.id === groupId ? { ...g, members: g.joined ? g.members - 1 : g.members + 1, joined: !g.joined } : g));
    }
  };

  const handleCreateMarketItem = async () => {
    const titleCheck = validateText(newMarketTitle, { min: 3, max: 100, fieldName: 'Item Title' });
    if (!titleCheck.isValid) {
      Alert.alert('Validation Error', titleCheck.error);
      return;
    }
    const priceCheck = validateNumberRange(newMarketPrice, 0, 100000, 'Price');
    if (!priceCheck.isValid) {
      Alert.alert('Validation Error', priceCheck.error);
      return;
    }
    try {
      await createMarketplaceItem({
        college_id: user?.college_id || null,
        user_id: user?.id || null,
        author_name: user?.full_name || 'Student',
        title: newMarketTitle.trim(),
        price: parseFloat(newMarketPrice) || 0,
        condition: newMarketCond,
        category: 'Books',
        description: newMarketDesc.trim()
      });
      setNewMarketTitle('');
      setNewMarketPrice('');
      setNewMarketDesc('');
      setActiveModal(null);
      addXp(10);
      await loadRealtimeData();
    } catch {
      const newItem = {
        id: `m_${Date.now()}`,
        title: newMarketTitle.trim(),
        price: parseFloat(newMarketPrice) || 0,
        condition: newMarketCond,
        category: 'Books',
        description: newMarketDesc.trim(),
        sold: false,
        author: user?.full_name || 'Student'
      };
      setMarketplaceItems([newItem, ...marketplaceItems]);
      setNewMarketTitle('');
      setNewMarketPrice('');
      setNewMarketDesc('');
      setActiveModal(null);
      addXp(10);
    }
  };

  const handleMarkSold = async (itemId) => {
    try {
      await markMarketplaceItemSold(itemId);
      setMarketplaceItems(marketplaceItems.map(m => m.id === itemId ? { ...m, sold: true } : m));
    } catch {
      setMarketplaceItems(marketplaceItems.map(m => m.id === itemId ? { ...m, sold: true } : m));
    }
  };

  // Filters
  const filteredQuestions = forumFilter === 'All' ? forumQuestions : forumQuestions.filter(q => q.category === forumFilter);
  const filteredMarket = marketFilter === 'All' ? marketplaceItems : marketplaceItems.filter(m => m.category === marketFilter);

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={['#0F172A', '#020617']} style={StyleSheet.absoluteFill} />
        <View style={[styles.glowBlob, { top: -100, left: -50, backgroundColor: 'rgba(99, 102, 241, 0.15)' }]} />
        <View style={[styles.glowBlob, { bottom: 100, right: -100, backgroundColor: 'rgba(168, 85, 247, 0.1)' }]} />
      </View>

      <View style={styles.headerBar}>
        {currentView !== 'home' ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => {
            if (selectedQuestion) setSelectedQuestion(null);
            else setCurrentView('home');
          }}>
            <Feather name="arrow-left" size={20} color="#FFF" />
          </TouchableOpacity>
        ) : (
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name="google-circles-group" size={22} color="#8B5CF6" />
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            {currentView === 'home' ? 'FEEDX Community' : currentView.toUpperCase() + ' CELL'}
          </Text>
          <Text style={styles.headerSub}>
            {currentView === 'home' ? 'College Collaboration & Q&A' : 'Interactive Campus Channel'}
          </Text>
        </View>
      </View>

      {/* Main Views Container */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* VIEW 1: HOME DASHBOARD */}
        {currentView === 'home' && (
          <Animated.View entering={FadeInUp.duration(400)}>
            {/* Reputation Banner */}
            <LinearGradient colors={['#1E1B4B', '#311042']} style={styles.reputationCard}>
              <View style={styles.repLeft}>
                <Text style={styles.repLevelLabel}>COMMUNITY STATUS</Text>
                <Text style={styles.repLevelValue}>{getReputationLevel(xp)}</Text>
                <View style={styles.xpBarBg}>
                  <View style={[styles.xpBarFill, { width: `${Math.min((xp / 1000) * 100, 100)}%` }]} />
                </View>
                <Text style={styles.xpText}>{xp} / 1000 XP to next level</Text>
              </View>
              <View style={styles.repRight}>
                <View style={styles.trophyIcon}>
                  <Feather name="award" size={32} color="#FBBF24" />
                </View>
              </View>
            </LinearGradient>

            {/* Pinned Announcements */}
            <View style={styles.announcementSection}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <MaterialCommunityIcons name="bullhorn-outline" size={18} color="#8B5CF6" />
                <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>College Announcements</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.announcementScroll}>
                {announcements.map(ann => (
                  <View key={ann.id} style={styles.announcementCard}>
                    <View style={styles.annCardTag}>
                      <Text style={styles.annTagText}>{(ann.type || 'admin').toUpperCase()}</Text>
                    </View>
                    <Text style={styles.annCardTitle}>{ann.title}</Text>
                    <Text style={styles.annCardDate}>{ann.date}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Categories Selection Grid */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <Feather name="grid" size={16} color="#8B5CF6" />
              <Text style={[styles.sectionHeading, { marginBottom: 0 }]}>Community Channels</Text>
            </View>
            <View style={styles.grid}>
              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('feed')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                  <Feather name="activity" size={22} color="#3B82F6" />
                </View>
                <Text style={styles.gridCardTitle}>Community Portal</Text>
                <Text style={styles.gridCardDesc}>Admin Posts & Discussions</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('forum')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                  <Feather name="message-square" size={22} color="#A855F7" />
                </View>
                <Text style={styles.gridCardTitle}>Academic Forum</Text>
                <Text style={styles.gridCardDesc}>DSA, DBMS, Subjects Q&A</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('collaboration')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <Feather name="users" size={22} color="#10B981" />
                </View>
                <Text style={styles.gridCardTitle}>Teammate Finder</Text>
                <Text style={styles.gridCardDesc}>Hackathons & Coursework</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('marketplace')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                  <Feather name="shopping-bag" size={22} color="#F59E0B" />
                </View>
                <Text style={styles.gridCardTitle}>Marketplace</Text>
                <Text style={styles.gridCardDesc}>Buy & Sell Books/Gear</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('groups')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(6, 182, 212, 0.15)' }]}>
                  <Feather name="book-open" size={22} color="#06B6D4" />
                </View>
                <Text style={styles.gridCardTitle}>Study Groups</Text>
                <Text style={styles.gridCardDesc}>Mid-exam preparation rooms</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('placement')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
                  <Feather name="briefcase" size={22} color="#EF4444" />
                </View>
                <Text style={styles.gridCardTitle}>Placements</Text>
                <Text style={styles.gridCardDesc}>Amazon/TCS experiences</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('clubs')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(236, 72, 153, 0.15)' }]}>
                  <Feather name="zap" size={22} color="#EC4899" />
                </View>
                <Text style={styles.gridCardTitle}>Clubs</Text>
                <Text style={styles.gridCardDesc}>Robotics, Coding club cells</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridCard} onPress={() => setCurrentView('alumni')}>
                <View style={[styles.gridIconCircle, { backgroundColor: 'rgba(74, 222, 128, 0.15)' }]}>
                  <Feather name="globe" size={22} color="#4ADE80" />
                </View>
                <Text style={styles.gridCardTitle}>Alumni Connect</Text>
                <Text style={styles.gridCardDesc}>Mentorship & referrals</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* VIEW 2: COMMUNITY PORTAL */}
        {currentView === 'feed' && (
          <Animated.View entering={FadeInDown}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.viewHeading}>Community Updates</Text>
              {(user.role === 'super_admin' || user.role === 'inst_admin') && (
                <TouchableOpacity style={styles.composerBtn} onPress={() => setActiveModal('post')}>
                  <Feather name="plus" size={14} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={styles.composerBtnText}>New Post</Text>
                </TouchableOpacity>
              )}
            </View>

            {feedPosts.slice(0, 15).map((post) => (
              <View key={post.id} style={styles.instaCard}>
                {/* Header */}
                <View style={styles.instaHeader}>
                  {post.avatar ? (
                    <Image source={{ uri: post.avatar }} style={styles.instaAvatar} />
                  ) : (
                    <View style={styles.instaAvatarPlaceholder}>
                      <Text style={styles.avatarChar}>{post.author[0]}</Text>
                    </View>
                  )}
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.instaAuthorName}>{post.author}</Text>
                      {(post.role === 'Super Admin' || post.role === 'Admin') && (
                        <View style={styles.instaBadge}>
                          <MaterialCommunityIcons name="shield-check" size={12} color="#A855F7" style={{ marginRight: 2 }} />
                          <Text style={styles.instaBadgeText}>Official</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.instaMeta}>{post.roll} • {post.time}</Text>
                  </View>
                  
                  <View style={[styles.instaTagBadge, { backgroundColor: post.type === 'achievement' ? 'rgba(16, 185, 129, 0.15)' : post.type === 'announcement' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(59, 130, 246, 0.15)' }]}>
                    <Text style={[styles.instaTagText, { color: post.type === 'achievement' ? '#10B981' : post.type === 'announcement' ? '#A855F7' : '#3B82F6' }]}>{post.type.toUpperCase()}</Text>
                  </View>
                </View>

                {/* Post Image */}
                {post.image ? (
                  <View style={styles.instaImageContainer}>
                    <Image source={{ uri: post.image }} style={styles.instaImage} resizeMode="cover" />
                  </View>
                ) : null}

                {/* Actions Bar */}
                <View style={styles.instaActionsBar}>
                  <View style={styles.instaActionsLeft}>
                    <TouchableOpacity style={styles.instaActionIconBtn} onPress={() => handleLikePost(post.id)}>
                      <Ionicons name={post.hasLiked ? "heart" : "heart-outline"} size={24} color={post.hasLiked ? "#EF4444" : "#FFF"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.instaActionIconBtn} onPress={() => router.push(`/community/post/${post.id}`)}>
                      <Ionicons name="chatbubble-outline" size={22} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.instaActionIconBtn} onPress={() => Share.share({ message: `Check out this update on FEEDX: ${post.content}` })}>
                      <Ionicons name="paper-plane-outline" size={22} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Likes Counter */}
                <Text style={styles.instaLikesText}>
                  {post.likes === 1 ? '1 like' : `${post.likes} likes`}
                </Text>

                {/* Caption & Content */}
                <View style={styles.instaCaptionContainer}>
                  <Text style={styles.instaCaptionText} numberOfLines={3}>
                    <Text style={styles.instaCaptionAuthor}>{post.author}</Text>
                    {"  "}{post.content}
                  </Text>
                </View>

                {/* View Comments Trigger */}
                <TouchableOpacity style={styles.instaCommentsTrigger} onPress={() => router.push(`/community/post/${post.id}`)}>
                  <Text style={styles.instaCommentsTriggerText}>
                    {post.comments?.length > 0 ? `View all ${post.comments.length} comments` : 'Add or view comments'}
                  </Text>
                </TouchableOpacity>

                {/* Comments List & Input */}
                {activeCommentPostId === post.id && (
                  <View style={styles.instaCommentsSection}>
                    {post.comments.map((c) => (
                      <View key={c.id} style={styles.instaCommentRow}>
                        {c.avatar ? (
                          <Image source={{ uri: c.avatar }} style={styles.instaCommentAvatar} />
                        ) : (
                          <View style={styles.instaCommentAvatarPlaceholder}>
                            <Text style={styles.instaCommentAvatarChar}>{c.author[0]}</Text>
                          </View>
                        )}
                        <View style={styles.instaCommentInfo}>
                          <Text style={styles.instaCommentText}>
                            <Text style={[styles.instaCommentAuthor, { color: '#818CF8' }]}>{c.author}</Text>
                            {"  "}{renderFormattedTaggedContent(c.content)}
                          </Text>
                          <TouchableOpacity
                            onPress={() => {
                              const tagHandle = `@${c.author.replace(/\s+/g, '_')} `;
                              setNewCommentText(prev => prev.includes(tagHandle) ? prev : `${tagHandle}${prev}`);
                            }}
                            style={{ marginTop: 3 }}
                            activeOpacity={0.7}
                          >
                            <Text style={{ fontSize: 11, color: '#38BDF8', fontWeight: '800' }}>Reply / Tag</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}

                    <View style={styles.instaCommentInputRow}>
                      <TextInput
                        placeholder="Add a comment..."
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        style={styles.instaCommentInput}
                        value={newCommentText}
                        onChangeText={setNewCommentText}
                      />
                      <TouchableOpacity style={styles.instaCommentSendBtn} onPress={() => handleAddComment(post.id)}>
                        <Ionicons name="arrow-up-circle" size={28} color="#8B5CF6" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </Animated.View>
        )}

        {/* VIEW 3: ACADEMIC DISCUSSION FORUM */}
        {currentView === 'forum' && !selectedQuestion && (
          <Animated.View entering={FadeInDown}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.viewHeading}>Academic Discussions</Text>
              <TouchableOpacity style={styles.composerBtn} onPress={() => setActiveModal('question')}>
                <Feather name="plus-circle" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.composerBtnText}>Ask Question</Text>
              </TouchableOpacity>
            </View>

            {/* Category Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {['All', 'DSA', 'DBMS', 'Web Development', 'AI/ML', 'Subjects'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, forumFilter === cat && styles.activeChip]}
                  onPress={() => setForumFilter(cat)}
                >
                  <Text style={[styles.chipText, forumFilter === cat && styles.activeChipText]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredQuestions.slice(0, 15).map((q) => (
              <TouchableOpacity key={q.id} style={styles.card} onPress={() => setSelectedQuestion(q)}>
                <View style={styles.qHeader}>
                  <View style={styles.qCategoryTag}>
                    <Text style={styles.qCategoryText}>{q.category}</Text>
                  </View>
                  <TouchableOpacity style={styles.upvoteButton} onPress={() => handleUpvoteQuestion(q.id)}>
                    <Feather name="chevron-up" size={18} color={q.hasUpvoted ? '#A855F7' : 'rgba(255,255,255,0.4)'} />
                    <Text style={[styles.upvoteText, q.hasUpvoted && { color: '#A855F7' }]}>{q.upvotes}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.qTitle}>{q.title}</Text>
                <Text style={styles.qDesc} numberOfLines={2}>{q.desc}</Text>
                <View style={styles.qMetaBar}>
                  <Feather name="message-square" size={12} color="rgba(255,255,255,0.3)" />
                  <Text style={styles.qMetaText}>{q.replies.length} replies • Tap to read & answer</Text>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}

        {/* VIEW 3B: QUESTION DETAIL & ANSWER SCENE */}
        {currentView === 'forum' && selectedQuestion && (
          <Animated.View entering={FadeInDown}>
            <TouchableOpacity style={styles.backLink} onPress={() => setSelectedQuestion(null)}>
              <Feather name="chevron-left" size={16} color={COLORS.primary} />
              <Text style={styles.backLinkText}>Back to questions</Text>
            </TouchableOpacity>

            <View style={styles.detailCard}>
              <Text style={styles.detailCategory}>{selectedQuestion.category}</Text>
              <Text style={styles.detailTitle}>{selectedQuestion.title}</Text>
              <Text style={styles.detailDesc}>{selectedQuestion.desc}</Text>
            </View>

            <Text style={styles.repliesHeading}>Replies ({selectedQuestion.replies.length})</Text>

            {selectedQuestion.replies.map((reply) => (
              <View key={reply.id} style={styles.replyCard}>
                <Text style={styles.replyAuthor}>{reply.author}</Text>
                <Text style={styles.replyContent}>{reply.content}</Text>
              </View>
            ))}

            <View style={styles.answerBox}>
              <Text style={styles.answerLabel}>Your Answer</Text>
              <TextInput
                placeholder="Write your explanation or answer here..."
                placeholderTextColor="rgba(255,255,255,0.25)"
                style={styles.answerInput}
                multiline
                numberOfLines={3}
                value={newAnswerText}
                onChangeText={setNewAnswerText}
              />
              <TouchableOpacity style={styles.answerSubmitBtn} onPress={() => handleAddAnswer(selectedQuestion.id)}>
                <Text style={styles.answerSubmitBtnText}>Submit Answer</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}

        {/* VIEW 4: TEAMMATE FINDER */}
        {currentView === 'collaboration' && (
          <Animated.View entering={FadeInDown}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.viewHeading}>Project Collaboration Finder</Text>
              <TouchableOpacity style={styles.composerBtn} onPress={() => setActiveModal('collab')}>
                <Feather name="plus" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.composerBtnText}>Post Request</Text>
              </TouchableOpacity>
            </View>

            {collaborations.slice(0, 15).map((col) => (
              <View key={col.id} style={styles.card}>
                <View style={styles.colHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.colTitle}>{col.title}</Text>
                    <Text style={styles.colMeta}>Posted by {col.author} • {col.branch}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.applyBtn, col.applied && styles.applyBtnSuccess]}
                    onPress={() => {
                      handleToggleApplyCollab(col.id);
                      if (!col.applied) {
                        Alert.alert('Request Sent!', 'Your request to join the project has been sent to the coordinator.');
                      }
                    }}
                  >
                    <Text style={styles.applyBtnText}>{col.applied ? 'Requested' : 'Join'}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.colDesc}>{col.desc}</Text>
                <View style={styles.skillsGrid}>
                  {col.skills.map((skill, si) => (
                    <View key={si} style={styles.skillBadge}>
                      <Text style={styles.skillBadgeText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* VIEW 5: STUDY GROUPS */}
        {currentView === 'groups' && (
          <Animated.View entering={FadeInDown}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.viewHeading}>Active Study Groups</Text>
              <TouchableOpacity style={styles.composerBtn} onPress={() => {
                Alert.prompt('Create Group', 'Enter study group name:', async (name) => {
                  if (name) {
                    try {
                      await createStudyGroup({
                        college_id: user.college_id,
                        title: name,
                        subject: 'General',
                        files_count: 0
                      });
                      addXp(10);
                      await loadRealtimeData();
                    } catch {
                      setStudyGroups([...studyGroups, {
                        id: `g_${Date.now()}`,
                        title: name,
                        subject: 'General',
                        members: 1,
                        filesCount: 0,
                        joined: true
                      }]);
                      addXp(10);
                    }
                  }
                });
              }}>
                <Feather name="users" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.composerBtnText}>Create Group</Text>
              </TouchableOpacity>
            </View>

            {studyGroups.slice(0, 15).map((group) => (
              <View key={group.id} style={styles.card}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupIconBg}>
                    <Feather name="book" size={20} color="#06B6D4" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.groupTitle}>{group.title}</Text>
                    <Text style={styles.groupMeta}>{group.members} members • {group.filesCount} shared resources</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.groupActionBtn, group.joined && styles.groupActionBtnJoined]}
                    onPress={() => {
                      handleToggleJoinGroup(group.id);
                    }}
                  >
                    <Text style={styles.groupActionBtnText}>{group.joined ? 'Leave' : 'Join'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* VIEW 6: PLACEMENTS CORNER */}
        {currentView === 'placement' && (
          <Animated.View entering={FadeInDown}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.viewHeading}>Placement Discussions</Text>
              <TouchableOpacity style={styles.composerBtn} onPress={() => {
                Alert.alert('Share Experience', 'To maintain verified placement profiles, please submit your experience details to admin via Support tab.');
              }}>
                <Feather name="share-2" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.composerBtnText}>Share Story</Text>
              </TouchableOpacity>
            </View>

            {placementPosts.slice(0, 15).map((post) => (
              <View key={post.id} style={styles.card}>
                <View style={styles.postHeader}>
                  <View style={styles.companyBadge}>
                    <Text style={styles.companyBadgeText}>{post.company[0]}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.placementTitle}>{post.title}</Text>
                    <Text style={styles.postMeta}>Shared by {post.author} • {post.date}</Text>
                  </View>
                </View>
                <Text style={styles.placementContent}>{post.content}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {/* VIEW 7: MARKETPLACE */}
        {currentView === 'marketplace' && (
          <Animated.View entering={FadeInDown}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.viewHeading}>Buy & Sell Classifieds</Text>
              <TouchableOpacity style={styles.composerBtn} onPress={() => setActiveModal('marketplace')}>
                <Feather name="plus-circle" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.composerBtnText}>Sell Item</Text>
              </TouchableOpacity>
            </View>

            {/* Marketplace Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {['All', 'Books', 'Electronics', 'Others'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.chip, marketFilter === cat && styles.activeChip]}
                  onPress={() => setMarketFilter(cat)}
                >
                  <Text style={[styles.chipText, marketFilter === cat && styles.activeChipText]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredMarket.slice(0, 15).map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.marketHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.marketItemTitle}>{item.title}</Text>
                    <Text style={styles.marketItemMeta}>Condition: {item.condition} • By {item.author}</Text>
                  </View>
                  <Text style={styles.marketItemPrice}>{item.price} pts</Text>
                </View>
                <Text style={styles.marketItemDesc}>{item.description}</Text>
                <View style={styles.marketActions}>
                  <TouchableOpacity style={styles.marketChatBtn} onPress={() => Alert.alert('Contact Seller', `Connection request sent. ${item.author} has been notified.`)}>
                    <Feather name="message-circle" size={14} color="#FFF" style={{ marginRight: 6 }} />
                    <Text style={styles.marketChatBtnText}>Chat Seller</Text>
                  </TouchableOpacity>
                  {!item.sold && (item.user_id === user.id || item.author === user.full_name) && (
                    <TouchableOpacity style={[styles.marketChatBtn, { backgroundColor: '#10B981', marginLeft: 10 }]} onPress={() => handleMarkSold(item.id)}>
                      <Feather name="check" size={14} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={styles.marketChatBtnText}>Mark Sold</Text>
                    </TouchableOpacity>
                  )}
                  {item.sold && (
                    <View style={{ marginLeft: 12, justifyContent: 'center' }}>
                      <Text style={{ color: '#EF4444', fontWeight: 'bold', fontSize: 12, letterSpacing: 0.5 }}>SOLD</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* VIEW 8: CLUBS COMMUNITIES */}
        {currentView === 'clubs' && (
          <Animated.View entering={FadeInDown}>
            <Text style={styles.viewHeading}>College Clubs & Cells</Text>
            {clubs.length === 0 ? (
              <View style={styles.emptyCard}>
                <Feather name="shield" size={32} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No clubs registered yet</Text>
              </View>
            ) : (
              clubs.map((club) => (
                <View key={club.id} style={styles.card}>
                  <View style={styles.clubHeader}>
                    <View style={styles.clubIconBg}>
                      <Feather name={club.icon || "users"} size={20} color="#EC4899" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.clubTitle}>{club.name}</Text>
                      <Text style={styles.clubDesc}>{club.description || 'No description available'}</Text>
                      <Text style={styles.clubMeta}>{club.members_count || 0} active members</Text>
                    </View>
                    <TouchableOpacity style={styles.clubActionBtn} onPress={() => Alert.alert('Connected', `You have subscribed to ${club.name} announcements.`)}>
                      <Text style={styles.clubActionBtnText}>Enter</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </Animated.View>
        )}

        {/* VIEW 9: ALUMNI CONNECT */}
        {currentView === 'alumni' && (
          <Animated.View entering={FadeInDown}>
            <Text style={styles.viewHeading}>Alumni Directory & Mentorship</Text>
            {alumni.length === 0 ? (
              <View style={styles.emptyCard}>
                <Feather name="users" size={32} color="rgba(255,255,255,0.2)" />
                <Text style={styles.emptyText}>No alumni listed in directory</Text>
              </View>
            ) : (
              alumni.slice(0, 15).map((alum) => (
                <View key={alum.id} style={styles.card}>
                  <View style={styles.alumHeader}>
                    <View style={styles.alumAvatar}>
                      <Text style={styles.avatarChar}>{alum.name ? alum.name[0] : 'A'}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.alumName}>{alum.name} (Class of {alum.class_of})</Text>
                      <Text style={styles.alumJob}>{alum.role} at <Text style={{ color: '#4ADE80', fontWeight: '800' }}>{alum.company}</Text></Text>
                      <Text style={styles.alumSkills}>Focus: {alum.skills}</Text>
                    </View>
                  </View>
                  <View style={styles.alumActionsRow}>
                    <TouchableOpacity style={styles.alumCtaBtn} onPress={() => Alert.alert('Referral Requested', `Senior referral request registered for ${alum.company}.`)}>
                      <Feather name="briefcase" size={14} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={styles.alumCtaText}>Request Referral</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.alumCtaBtn, { backgroundColor: 'rgba(255,255,255,0.06)' }]} onPress={() => Alert.alert('Calendar Booking', `Calendar invitation sent to schedule mentorship slot.`)}>
                      <Feather name="calendar" size={14} color="#FFF" style={{ marginRight: 6 }} />
                      <Text style={styles.alumCtaText}>Book Session</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </Animated.View>
        )}

      </ScrollView>

      {/* COMPOSER MODALS */}
      {activeModal && (
        <BlurView intensity={35} style={StyleSheet.absoluteFill} tint="dark">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalCentered}>
            <View style={styles.modalView}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {activeModal === 'post' ? 'Create Community Update' : activeModal === 'question' ? 'Ask Academic Forum' : activeModal === 'collab' ? 'Find Teammate' : 'List Sell Item'}
                </Text>
                <TouchableOpacity onPress={() => { setActiveModal(null); setSelectedPostImage(null); }}>
                  <Feather name="x" size={20} color="#FFF" />
                </TouchableOpacity>
              </View>

              {/* Form elements depending on modal type */}
              {activeModal === 'post' && (
                <View>
                  <Text style={styles.modalLabel}>Select Category</Text>
                  <View style={styles.postTypeRow}>
                    {['announcement', 'update', 'achievement', 'placement'].map(type => (
                      <TouchableOpacity
                        key={type}
                        style={[styles.postTypeBtn, newPostType === type && styles.activePostType]}
                        onPress={() => setNewPostType(type)}
                      >
                        <Text style={styles.postTypeText}>{type.toUpperCase()}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  
                  <Text style={styles.modalLabel}>Update Message</Text>
                  <TextInput
                    placeholder="Share an important update or announcement..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    multiline
                    numberOfLines={4}
                    style={[styles.modalInput, { marginBottom: 12 }]}
                    value={newPostContent}
                    onChangeText={setNewPostContent}
                  />
                  
                  <Text style={styles.modalLabel}>Media Attachment</Text>
                  {selectedPostImage ? (
                    <View style={styles.imagePreviewContainer}>
                      <Image source={{ uri: selectedPostImage }} style={styles.imagePreview} />
                      <TouchableOpacity style={styles.removeImageBtn} onPress={() => setSelectedPostImage(null)}>
                        <Ionicons name="close-circle" size={24} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.imageSelectBtn} onPress={handlePickPostImage}>
                      <Feather name="image" size={16} color="#A855F7" style={{ marginRight: 8 }} />
                      <Text style={styles.imageSelectBtnText}>Add Photo to Post</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreatePost} disabled={uploadingImage}>
                    {uploadingImage ? (
                      <ButtonLoading color="#FFF" />
                    ) : (
                      <Text style={styles.modalSubmitText}>Share Update</Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {activeModal === 'question' && (
                <View>
                  <Text style={styles.modalLabel}>Category</Text>
                  <View style={styles.postTypeRow}>
                    {['DSA', 'DBMS', 'Web Development', 'AI/ML'].map(cat => (
                      <TouchableOpacity
                        key={cat}
                        style={[styles.postTypeBtn, newQuestionCat === cat && styles.activePostType]}
                        onPress={() => setNewQuestionCat(cat)}
                      >
                        <Text style={styles.postTypeText}>{cat}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TextInput
                    placeholder="Question Title (e.g. Recursion stack limit?)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.modalTextInputLine}
                    value={newQuestionTitle}
                    onChangeText={setNewQuestionTitle}
                  />
                  <TextInput
                    placeholder="Describe your question or error details here..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    multiline
                    numberOfLines={4}
                    style={styles.modalInput}
                    value={newQuestionDesc}
                    onChangeText={setNewQuestionDesc}
                  />
                  <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAskQuestion}>
                    <Text style={styles.modalSubmitText}>Post Question</Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeModal === 'collab' && (
                <View>
                  <TextInput
                    placeholder="Project Title (e.g. Flutter E-commerce app)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.modalTextInputLine}
                    value={newColTitle}
                    onChangeText={setNewColTitle}
                  />
                  <TextInput
                    placeholder="Skills needed (e.g. React, Node, Git)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.modalTextInputLine}
                    value={newColSkills}
                    onChangeText={setNewColSkills}
                  />
                  <TextInput
                    placeholder="Describe project tasks and goals..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    multiline
                    numberOfLines={4}
                    style={styles.modalInput}
                    value={newColDesc}
                    onChangeText={setNewColDesc}
                  />
                  <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateCollab}>
                    <Text style={styles.modalSubmitText}>Post Request</Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeModal === 'marketplace' && (
                <View>
                  <TextInput
                    placeholder="Item Name (e.g. Casio fx-991EX)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.modalTextInputLine}
                    value={newMarketTitle}
                    onChangeText={setNewMarketTitle}
                  />
                  <TextInput
                    placeholder="Price in Points (Tokens)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="numeric"
                    style={styles.modalTextInputLine}
                    value={newMarketPrice}
                    onChangeText={setNewMarketPrice}
                  />
                  <TextInput
                    placeholder="Condition (e.g. Good, Like New)"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    style={styles.modalTextInputLine}
                    value={newMarketCond}
                    onChangeText={setNewMarketCond}
                  />
                  <TextInput
                    placeholder="Short description of the item..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    multiline
                    numberOfLines={3}
                    style={styles.modalInput}
                    value={newMarketDesc}
                    onChangeText={setNewMarketDesc}
                  />
                  <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleCreateMarketItem}>
                    <Text style={styles.modalSubmitText}>Submit Listing</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  glowBlob: { position: 'absolute', width: 350, height: 350, borderRadius: 175, opacity: 0.3 },
  headerBar: { flexDirection: 'row', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerIconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(139, 92, 246, 0.12)', alignItems: 'center', justifyContent: 'center', marginRight: 12, borderWidth: 1, borderColor: 'rgba(139, 92, 246, 0.2)' },
  headerInfo: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#FFF', letterSpacing: -0.5 },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginTop: 1 },
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },

  // Reputation Card
  reputationCard: { flexDirection: 'row', padding: 20, borderRadius: 24, marginVertical: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  repLeft: { flex: 1 },
  repLevelLabel: { fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: '800', letterSpacing: 1 },
  repLevelValue: { fontSize: 20, fontWeight: '900', color: '#FFF', marginVertical: 4 },
  xpBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 3, marginVertical: 6, overflow: 'hidden' },
  xpBarFill: { height: 6, backgroundColor: '#8B5CF6', borderRadius: 3 },
  xpText: { fontSize: 10, color: 'rgba(255,255,255,0.45)', fontWeight: '700' },
  repRight: { width: 60, alignItems: 'center', justifyContent: 'center' },
  trophyIcon: { width: 50, height: 50, borderRadius: 18, backgroundColor: 'rgba(251, 191, 36, 0.1)', alignItems: 'center', justifyContent: 'center' },

  // Announcements
  announcementSection: { marginBottom: 20 },
  sectionHeading: { fontSize: 15, fontWeight: '800', color: '#FFF', marginBottom: 12, letterSpacing: -0.2 },
  announcementScroll: { gap: 12, paddingRight: 20 },
  announcementCard: { width: 260, padding: 16, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginRight: 12 },
  annCardTag: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 8 },
  annTagText: { fontSize: 8, fontWeight: '900', color: '#8B5CF6', letterSpacing: 1 },
  annCardTitle: { fontSize: 13, fontWeight: '700', color: '#FFF', lineHeight: 18 },
  annCardDate: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 8, fontWeight: '700' },

  // Selection Grid
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  gridCard: { width: (width - 52) / 2, padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', gap: 12 },
  gridIconCircle: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  gridCardTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  gridCardDesc: { fontSize: 10.5, color: 'rgba(255,255,255,0.35)', fontWeight: '600', lineHeight: 14 },

  // Common styles
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  viewHeading: { fontSize: 18, fontWeight: '800', color: '#FFF' },
  composerBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: '#8B5CF6' },
  composerBtnText: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  card: { padding: 20, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', marginBottom: 12 },

  // Feed styles
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  postAvatar: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  avatarChar: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  postAuthorName: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  postMeta: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  feedTagBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  feedTagText: { fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  postBody: { fontSize: 14.5, color: 'rgba(255,255,255,0.8)', lineHeight: 22, marginBottom: 16 },
  postActions: { flexDirection: 'row', borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.04)', paddingTop: 12, gap: 20 },
  postActionItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postActionText: { fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: '600' },
  commentsWrap: { marginTop: 12, borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.04)', paddingTop: 12 },
  commentItem: { marginBottom: 8, paddingHorizontal: 8 },
  commentAuthor: { fontSize: 12, fontWeight: '800', color: '#8B5CF6' },
  commentBody: { fontSize: 12.5, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  commentInput: { flex: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 10, paddingHorizontal: 12, color: '#FFF', fontSize: 13 },
  commentSendBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },

  // Forum chips
  chipsScroll: { gap: 8, marginBottom: 16, paddingRight: 20 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  activeChip: { backgroundColor: '#A855F7', borderColor: '#A855F7' },
  chipText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.5)' },
  activeChipText: { color: '#FFF' },

  // Forum list cards
  qHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  qCategoryTag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(168, 85, 247, 0.15)' },
  qCategoryText: { fontSize: 9, fontWeight: '900', color: '#C084FC', letterSpacing: 0.5 },
  upvoteButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.04)' },
  upvoteText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.4)' },
  qTitle: { fontSize: 16, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  qDesc: { fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 18, marginBottom: 12 },
  qMetaBar: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  qMetaText: { fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: '600' },

  // Q&A Detail Screen
  backLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginVertical: 14 },
  backLinkText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  detailCard: { padding: 24, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20 },
  detailCategory: { fontSize: 11, color: '#C084FC', fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  detailTitle: { fontSize: 20, fontWeight: '900', color: '#FFF', marginVertical: 8 },
  detailDesc: { fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 22 },
  repliesHeading: { fontSize: 15, fontWeight: '800', color: '#FFF', marginBottom: 12 },
  replyCard: { padding: 16, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)', marginBottom: 10 },
  replyAuthor: { fontSize: 12, fontWeight: '800', color: '#C084FC', marginBottom: 4 },
  replyContent: { fontSize: 13.5, color: 'rgba(255,255,255,0.75)', lineHeight: 18 },
  answerBox: { marginTop: 20, padding: 16, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.04)' },
  answerLabel: { fontSize: 13, fontWeight: '800', color: '#FFF', marginBottom: 8 },
  answerInput: { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: 12, color: '#FFF', fontSize: 14, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginBottom: 12 },
  answerSubmitBtn: { height: 44, borderRadius: 12, backgroundColor: '#A855F7', alignItems: 'center', justifyContent: 'center' },
  answerSubmitBtnText: { color: '#FFF', fontWeight: '800', fontSize: 14 },

  // Collaboration styles
  colHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  colTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  colMeta: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  applyBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, backgroundColor: '#10B981' },
  applyBtnSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  applyBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
  colDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18, marginBottom: 12 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.05)' },
  skillBadgeText: { fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: '700' },

  // Group styles
  groupHeader: { flexDirection: 'row', alignItems: 'center' },
  groupIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(6, 182, 212, 0.12)', alignItems: 'center', justifyContent: 'center' },
  groupTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  groupMeta: { fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 2 },
  groupActionBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#06B6D4' },
  groupActionBtnJoined: { backgroundColor: 'rgba(6, 182, 212, 0.2)' },
  groupActionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  // Placement styles
  companyBadge: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(239, 68, 68, 0.12)', alignItems: 'center', justifyContent: 'center' },
  companyBadgeText: { fontSize: 18, fontWeight: '900', color: '#EF4444' },
  placementTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  placementContent: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18, marginTop: 12 },

  // Marketplace styles
  marketHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  marketItemTitle: { fontSize: 16, fontWeight: '800', color: '#FFF' },
  marketItemMeta: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 },
  marketItemPrice: { fontSize: 18, fontWeight: '900', color: '#F59E0B' },
  marketItemDesc: { fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 18, marginBottom: 12 },
  marketActions: { borderTopWidth: 1, borderColor: 'rgba(255,255,255,0.04)', paddingTop: 10 },
  marketChatBtn: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#F59E0B' },
  marketChatBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  // Club styles
  clubHeader: { flexDirection: 'row', alignItems: 'center' },
  clubIconBg: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(236, 72, 153, 0.12)', alignItems: 'center', justifyContent: 'center' },
  clubTitle: { fontSize: 15, fontWeight: '800', color: '#FFF' },
  clubDesc: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  clubMeta: { fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 6, fontWeight: '700' },
  clubActionBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8, backgroundColor: '#EC4899' },
  clubActionBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  // Alumni Connect
  alumHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  alumAvatar: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(74, 222, 128, 0.12)', alignItems: 'center', justifyContent: 'center' },
  alumName: { fontSize: 15, fontWeight: '850', color: '#FFF' },
  alumJob: { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  alumSkills: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4, fontWeight: '750' },
  alumActionsRow: { flexDirection: 'row', gap: 10 },
  alumCtaBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, backgroundColor: '#10B981' },
  alumCtaText: { color: '#FFF', fontWeight: '800', fontSize: 12 },

  // Modals
  modalCentered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  modalView: { width: '100%', backgroundColor: '#0F172A', borderRadius: 28, padding: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#FFF' },
  modalLabel: { fontSize: 11, fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  postTypeRow: { flexDirection: 'row', gap: 6, marginBottom: 14 },
  postTypeBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' },
  activePostType: { backgroundColor: '#8B5CF6' },
  postTypeText: { fontSize: 9, fontWeight: '800', color: '#FFF' },
  modalTextInputLine: { height: 50, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, paddingHorizontal: 14, color: '#FFF', fontSize: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 12 },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 12, padding: 14, color: '#FFF', fontSize: 14, minHeight: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20 },
  modalSubmitBtn: { height: 54, borderRadius: 14, backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center' },
  modalSubmitText: { color: '#FFF', fontWeight: '800', fontSize: 15 },

  // Instagram Feed Redesign Styles
  instaCard: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: 20,
    overflow: 'hidden'
  },
  instaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14
  },
  instaAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19
  },
  instaAvatarPlaceholder: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  instaAuthorName: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#FFF'
  },
  instaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6
  },
  instaBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#C084FC',
    letterSpacing: 0.5
  },
  instaMeta: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    marginTop: 2
  },
  instaTagBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  instaTagText: {
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.5
  },
  instaImageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000'
  },
  instaImage: {
    width: '100%',
    height: 300
  },
  instaActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 6
  },
  instaActionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14
  },
  instaActionIconBtn: {
    padding: 2
  },
  instaLikesText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    paddingHorizontal: 14,
    paddingBottom: 6
  },
  instaCaptionContainer: {
    paddingHorizontal: 14,
    paddingBottom: 8
  },
  instaCaptionText: {
    fontSize: 13.5,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 18
  },
  instaCaptionAuthor: {
    fontWeight: '800',
    color: '#FFF'
  },
  instaCommentsTrigger: {
    paddingHorizontal: 14,
    paddingBottom: 10
  },
  instaCommentsTriggerText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600'
  },
  instaCommentsSection: {
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 14,
    gap: 10
  },
  instaCommentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  instaCommentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12
  },
  instaCommentAvatarPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  instaCommentAvatarChar: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF'
  },
  instaCommentInfo: {
    flex: 1,
    marginLeft: 8
  },
  instaCommentText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 16
  },
  instaCommentAuthor: {
    fontWeight: '700',
    color: '#FFF'
  },
  instaCommentInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4
  },
  instaCommentInput: {
    flex: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    paddingHorizontal: 14,
    color: '#FFF',
    fontSize: 12.5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  instaCommentSendBtn: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderStyle: 'dashed',
    marginBottom: 20
  },
  imageSelectBtnText: {
    fontSize: 13,
    color: '#A855F7',
    fontWeight: '800'
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20
  },
  imagePreview: {
    width: '100%',
    height: '100%'
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8
  }
});
