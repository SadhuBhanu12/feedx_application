import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface Props {
  status: string;
}

const TIMELINE_STAGES = [
  { key: 'Submitted', label: 'Submitted', color: '#F59E0B', icon: 'file-text' },
  { key: 'Under Review', label: 'Under Review', color: '#3B82F6', icon: 'eye' },
  { key: 'Approved', label: 'Approved', color: '#10B981', icon: 'check-circle' },
  { key: 'Completed', label: 'Completed', color: '#8B5CF6', icon: 'award' },
];

export default function ProposalTimeline({ status }: Props) {
  const getStageIndex = (st: string) => {
    const s = String(st || '').toLowerCase().trim();
    if (s.includes('submit')) return 0;
    if (s.includes('under') || s.includes('review') || s.includes('pending')) return 1;
    if (s.includes('approve') || s.includes('feature') || s.includes('recommend')) return 2;
    if (s.includes('complete') || s.includes('done')) return 3;
    return 0;
  };

  const currentIndex = getStageIndex(status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Proposal Progress Timeline</Text>
      <View style={styles.timelineRow}>
        {TIMELINE_STAGES.map((stage, idx) => {
          const isPassed = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <React.Fragment key={stage.key}>
              <View style={styles.nodeWrapper}>
                <View
                  style={[
                    styles.nodeCircle,
                    isPassed && { backgroundColor: stage.color, borderColor: stage.color },
                    isCurrent && styles.activeNodeCircle,
                  ]}
                >
                  <Feather
                    name={stage.icon as any}
                    size={14}
                    color={isPassed ? '#FFF' : 'rgba(255,255,255,0.3)'}
                  />
                </View>
                <Text
                  style={[
                    styles.nodeLabel,
                    isPassed && { color: '#FFF', fontWeight: '700' },
                    isCurrent && { color: stage.color, fontWeight: '800' },
                  ]}
                >
                  {stage.label}
                </Text>
              </View>

              {idx < TIMELINE_STAGES.length - 1 && (
                <View
                  style={[
                    styles.connectorLine,
                    idx < currentIndex && { backgroundColor: TIMELINE_STAGES[idx + 1].color },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  title: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeWrapper: {
    alignItems: 'center',
    gap: 6,
    zIndex: 2,
  },
  nodeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeNodeCircle: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  nodeLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
  connectorLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: -16,
  },
});
