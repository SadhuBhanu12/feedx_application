const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('FEEDX SINGLE NOTIFICATION DEDUPLICATION TEST SUITE');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}: ${err.message}`);
    failCount++;
  }
}

// 1. Verify RewardNotificationManager logic
runTest('RewardNotificationManager - Hardened deduplication and queue pruning', () => {
  const filePath = path.join(__dirname, '..', 'services', 'RewardNotificationManager.ts');
  const code = fs.readFileSync(filePath, 'utf8');

  // Verify drop of invalid/already-earned/zero-point
  assert.ok(code.includes('result.pointsAwarded <= 0 || result.alreadyEarned'), 'Must reject <= 0 points or already-earned');
  // Verify deduplication window
  assert.ok(code.includes('now - lastSeen < 10000'), 'Must enforce 10s deduplication window');
  // Verify active screen guard
  assert.ok(code.includes('this.currentItem !== null'), 'Must check active current item before enqueuing');
  // Verify dismissCurrent queue pruning
  assert.ok(code.includes('this.queue = this.queue.filter'), 'Must prune duplicates when dismissing current notification');
});

// 2. Verify Today\'s Mission (DailyChallengesCard) has no duplicate Alert
runTest("DailyChallengesCard - Single notification (no Alert.alert on success)", () => {
  const filePath = path.join(__dirname, '..', 'components', 'gamification', 'DailyChallengesCard.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(
    !code.includes("Alert.alert('Checked In! 🎉'"),
    'Must not display Alert.alert on successful checkin'
  );
  assert.ok(
    !code.includes('<RewardSuccessModal'),
    'Must not render redundant local RewardSuccessModal'
  );
});

// 3. Verify Quick Learn (QuickLearnDetailScreen) has no duplicate Alert and has ref guard
runTest('QuickLearnDetailScreen - Single notification and isCompletingRef guard', () => {
  const filePath = path.join(__dirname, '..', 'screens', 'QuickLearnDetailScreen.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes('isCompletingRef = React.useRef'), 'Must declare isCompletingRef');
  assert.ok(code.includes('!isCompletingRef.current'), 'Must guard completion with isCompletingRef.current');
  assert.ok(
    !code.includes("Alert.alert('Congratulations! 🎉'"),
    'Must not display Alert.alert on lesson completion'
  );
});

// 4. Verify Daily Tasks (DailyTasks) has processingTasksRef and un-nested TouchableOpacity
runTest('DailyTasks - Anti-double tap ref guard and no nested TouchableOpacity', () => {
  const filePath = path.join(__dirname, '..', 'components', 'home', 'DailyTasks.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes('processingTasksRef = useRef'), 'Must declare processingTasksRef');
  assert.ok(code.includes('processingTasksRef.current.has(taskId)'), 'Must guard task toggle with processingTasksRef');
  assert.ok(code.includes('<View style={styles.checkBtn}>'), 'Check button must be View, not nested TouchableOpacity');
});

// 5. Verify DailyQuizResultScreen has rewardTriggeredRef guard
runTest('DailyQuizResultScreen - rewardTriggeredRef prevents duplicate RPC/state reward triggers', () => {
  const filePath = path.join(__dirname, '..', 'screens', 'DailyQuizResultScreen.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes('rewardTriggeredRef = useRef'), 'Must declare rewardTriggeredRef');
  assert.ok(code.includes('!rewardTriggeredRef.current'), 'Must guard triggerReward with !rewardTriggeredRef.current');
});

// 6. Verify AIRoadmapScreen uses skipPopup to prevent dual celebration modals
runTest('AIRoadmapScreen - skipPopup prevents overlapping celebration modals', () => {
  const filePath = path.join(__dirname, '..', 'screens', 'AIRoadmapScreen.tsx');
  const code = fs.readFileSync(filePath, 'utf8');

  assert.ok(code.includes('skipPopup: true'), 'Must pass skipPopup: true to avoid dual celebration modal overlap');
});

console.log('\n================================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
