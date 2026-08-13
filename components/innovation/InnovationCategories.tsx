import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  iconType: string;
  gradient: [string, string];
  desc: string;
}

export const INNOVATION_CATEGORIES: CategoryItem[] = [
  { id: 'ai', name: 'Artificial Intelligence', icon: 'robot-industrial', iconType: 'mci', gradient: ['#3B82F6', '#1D4ED8'], desc: 'LLMs, Neural Networks, Computer Vision' },
  { id: 'ml', name: 'Machine Learning', icon: 'brain', iconType: 'mci', gradient: ['#8B5CF6', '#6D28D9'], desc: 'Predictive Models, Analytics, AutoML' },
  { id: 'datascience', name: 'Data Science', icon: 'chart-box-outline', iconType: 'mci', gradient: ['#0284C7', '#0369A1'], desc: 'Big Data, Visualizations, Statistics' },
  { id: 'cybersecurity', name: 'Cyber Security', icon: 'shield-lock-outline', iconType: 'mci', gradient: ['#EF4444', '#B91C1C'], desc: 'Ethical Hacking, Network Defense, Cryptography' },
  { id: 'cloud', name: 'Cloud Computing', icon: 'cloud-tags', iconType: 'mci', gradient: ['#06B6D4', '#0E7490'], desc: 'Serverless, Microservices, DevOps' },
  { id: 'iot', name: 'IoT', icon: 'chip', iconType: 'mci', gradient: ['#10B981', '#047857'], desc: 'Embedded Hardware, Smart Sensors, Microcontrollers' },
  { id: 'robotics', name: 'Robotics', icon: 'robot', iconType: 'mci', gradient: ['#F59E0B', '#B45309'], desc: 'Drones, Mechatronics, Autonomous Systems' },
  { id: 'electronics', name: 'Electronics', icon: 'memory', iconType: 'mci', gradient: ['#F43F5E', '#BE123C'], desc: 'VLSI, Circuit Design, PCBs, Microprocessors' },
  { id: 'mechanical', name: 'Mechanical', icon: 'cog', iconType: 'mci', gradient: ['#64748B', '#334155'], desc: 'CAD, Thermal, Automotive, Manufacturing' },
  { id: 'civil', name: 'Civil', icon: 'office-building', iconType: 'mci', gradient: ['#78350F', '#451A03'], desc: 'Smart Infrastructure, Surveying, Structural' },
  { id: 'agriculture', name: 'Agriculture', icon: 'leaf', iconType: 'mci', gradient: ['#84CC16', '#4D7C0F'], desc: 'Precision Farming, Hydroponics, Agri-IoT' },
  { id: 'healthcare', name: 'Healthcare', icon: 'hospital-building', iconType: 'mci', gradient: ['#14B8A6', '#0F766E'], desc: 'Telemedicine, Medical Devices, Health-Tech' },
  { id: 'smart_campus', name: 'Smart Campus', icon: 'school-outline', iconType: 'mci', gradient: ['#A855F7', '#7E22CE'], desc: 'Campus Automation, Attendance AI, Digital ID' },
  { id: 'blockchain', name: 'Blockchain', icon: 'currency-btc', iconType: 'mci', gradient: ['#F97316', '#C2410C'], desc: 'Smart Contracts, Web3, Distributed Ledgers' },
  { id: 'arvr', name: 'AR/VR', icon: 'glasses', iconType: 'mci', gradient: ['#EC4899', '#BE185D'], desc: 'Spatial Computing, Virtual Labs, Metaverse' },
  { id: 'open_innovation', name: 'Open Innovation', icon: 'lightbulb-on-outline', iconType: 'mci', gradient: ['#EAB308', '#A16207'], desc: 'Cross-disciplinary Startups & Moonshots' },
  { id: 'others', name: 'Others', icon: 'hexagon-multiple-outline', iconType: 'mci', gradient: ['#475569', '#1E293B'], desc: 'General Innovations & Interdisciplinary' },
];

interface Props {
  selectedCategory: string;
  onSelectCategory: (categoryName: string) => void;
}

export default function InnovationCategories({ selectedCategory, onSelectCategory }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Explore Innovation Domains</Text>
      <Text style={styles.sectionSubtitle}>Select a technology category to filter community proposals</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {INNOVATION_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name || (selectedCategory === 'All' && cat.id === 'all');
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryCard, isSelected && styles.selectedCategoryCard]}
              onPress={() => onSelectCategory(isSelected ? 'All' : cat.name)}
              activeOpacity={0.8}
            >
              <LinearGradient colors={cat.gradient} style={styles.iconGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <MaterialCommunityIcons name={cat.icon as any} size={22} color="#FFF" />
              </LinearGradient>
              <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
              <Text style={styles.categoryDesc} numberOfLines={2}>{cat.desc}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 14,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  categoryCard: {
    width: 145,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'space-between',
  },
  selectedCategoryCard: {
    borderColor: '#3B82F6',
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  iconGradient: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 4,
  },
  categoryDesc: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.45)',
    lineHeight: 14,
  },
});
