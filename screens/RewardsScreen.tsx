import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { safeBack } from '@/utils/navigation';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useGamification } from '@/context/GamificationContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { RewardItem, convertTokensToGoldCoins } from '@/services/gamificationService';
import CertificateModal from '@/components/ui/CertificateModal';
import AnimatedNumber from '@/components/ui/AnimatedNumber';

const CATEGORIES = ['ALL', 'CERTIFICATE', 'AWARD'];

const MILESTONES = [
  { coins: 5, tokens: 5000, reward: 'FEEDX Verified Learner Certificate', icon: 'award' },
  { coins: 10, tokens: 10000, reward: 'FEEDX Academic Excellence Certific...', icon: 'award' },
  { coins: 50, tokens: 50000, reward: 'Annual FEEDX Excellence...', icon: 'trophy' },
];

const RewardCardGraphic = ({ cost }: { cost: number }) => {
  if (cost === 5) {
    return (
      <View style={styles.graphicBox}>
        <View style={styles.badgeLeftGraphic}>
          <FontAwesome5 name="award" size={28} color="#F59E0B" />
          <Text style={styles.badgeCostText}>5 Coins</Text>
        </View>
        <View style={styles.certCardGraphic}>
          <Text style={styles.certBrand}>FEEDX</Text>
          <Text style={styles.certTitleGraphic}>VERIFIED LEARNER</Text>
          <Text style={styles.certSubGraphic}>CERTIFICATE</Text>
        </View>
      </View>
    );
  }

  if (cost === 10) {
    return (
      <View style={styles.graphicBox}>
        <View style={styles.badgeLeftGraphic}>
          <FontAwesome5 name="award" size={28} color="#3B82F6" />
          <Text style={styles.badgeCostText}>10 Coins</Text>
        </View>
        <View style={styles.certCardGraphic}>
          <Text style={styles.certBrand}>FEEDX</Text>
          <Text style={styles.certTitleGraphic}>ACADEMIC EXCELLENCE</Text>
          <Text style={styles.certSubGraphic}>GOLD SEAL CERTIFICATE</Text>
        </View>
      </View>
    );
  }

  if (cost === 30) {
    return (
      <View style={styles.graphicBox}>
        <View style={styles.badgeLeftGraphic}>
          <FontAwesome5 name="award" size={28} color="#F59E0B" />
          <Text style={styles.badgeCostText}>30 Coins</Text>
        </View>
        <View style={styles.bundleGraphicBox}>
          <FontAwesome5 name="award" size={34} color="#F59E0B" />
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <Text style={styles.awardTextGraphic}>FEEDX REWARD</Text>
            <Text style={styles.awardSubGraphic}>EXCLUSIVE RECOGNITION</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.graphicBox}>
      <View style={styles.badgeLeftGraphic}>
        <FontAwesome5 name="trophy" size={28} color="#A855F7" />
        <Text style={styles.badgeCostText}>50 Coins</Text>
      </View>
      <View style={styles.trophyGraphicBox}>
        <FontAwesome5 name="trophy" size={34} color="#F59E0B" />
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <Text style={styles.awardTextGraphic}>EXCELLENCE AWARD</Text>
          <Text style={styles.awardSubGraphic}>PREMIUM RECOGNITION</Text>
        </View>
      </View>
    </View>
  );
};

export default function RewardsScreen() {
  const { wallet, streak, catalog, transactions, redemptions, redeemCatalogItem, refreshGamification } = useGamification();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedItem, setSelectedItem] = useState<RewardItem | null>(null);
  const [redeeming, setRedeeming] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);

  const [certModalVisible, setCertModalVisible] = useState(false);
  const [activeCertType, setActiveCertType] = useState<'verified_learner' | 'excellence'>('verified_learner');
  const [activeCertId, setActiveCertId] = useState<string>('');

  React.useEffect(() => {
    refreshGamification();
  }, [refreshGamification]);

  // Currencies: Spendable Tokens from student_wallets (SSOT) and Gold Coins
  const tokens = wallet?.tokens !== undefined
    ? wallet.tokens
    : (user?.tokens !== undefined ? user.tokens : (streak?.xp_points ?? user?.xp_points ?? 0));

  const coins = wallet?.gold_coins !== undefined
    ? wallet.gold_coins
    : (user?.gold_coins ?? user?.coins ?? 0);

  // Exact 4 rewards fallback if catalog is loading
  const EXACT_FALLBACK: RewardItem[] = [
    {
      id: 'cat_5_coins',
      title: 'FEEDX VERIFIED LEARNER CERTIFICATE',
      description: 'Official verified digital learner certificate signed by FEEDX.',
      coin_cost: 5,
      category: 'certificate',
      stock: -1,
      is_active: true,
    },
    {
      id: 'cat_10_coins',
      title: 'FEEDX CERTIFICATE OF EXCELLENCE',
      description: 'Official FEEDX Certificate of Excellence with Gold Seal & Special Recognition.',
      coin_cost: 10,
      category: 'certificate',
      stock: -1,
      is_active: true,
    },
    {
      id: 'cat_30_coins',
      title: 'PREMIUM LEARNING BUNDLE & PASS',
      description: 'Exclusive access to premium skill modules, workshops & event passes.',
      coin_cost: 30,
      category: 'bundle',
      stock: 50,
      is_active: true,
    },
    {
      id: 'cat_50_coins',
      title: 'ANNUAL EXCELLENCE AWARD + GRAND PRIZE',
      description: 'Annual FEEDX Excellence Trophy, certificate & premium tech prize.',
      coin_cost: 50,
      category: 'ticket',
      stock: 10,
      is_active: true,
    },
  ];

  const displayCatalog = catalog && catalog.length >= 4 ? catalog : EXACT_FALLBACK;

  const filteredCatalog = displayCatalog.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'CERTIFICATE') {
      return (item.category || '').toLowerCase() === 'certificate';
    }
    if (selectedCategory === 'AWARD') {
      return ['award', 'ticket', 'bundle'].includes((item.category || '').toLowerCase());
    }
    return true;
  });

  const progressPct = Math.min(100, Math.round(((tokens % 1000) / 1000) * 100));
  const toNextCoin = 1000 - (tokens % 1000);

  const handleConvertSpecific = async (tokensToConvert: number) => {
    if (tokens < 1000) {
      Alert.alert(
        'Insufficient Tokens',
        `You need at least 1,000 tokens to exchange for a Gold Coin.\n\nYour Current Balance: ${tokens.toLocaleString()} Tokens.`
      );
      return;
    }

    const coinsToGet = Math.floor(tokensToConvert / 1000);
    const usedTokens = coinsToGet * 1000;

    Alert.alert(
      'Exchange Tokens',
      `Exchange ${usedTokens.toLocaleString()} Tokens for ${coinsToGet} Gold Coin(s)?\n\nRate: 1,000 Tokens = 1 Gold Coin`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Exchange Now',
          onPress: async () => {
            setConverting(true);
            try {
              const res = await convertTokensToGoldCoins(user?.id || '', usedTokens);
              if (res.success) {
                await refreshGamification();
                Alert.alert('Success', res.message);
              } else {
                Alert.alert('Notice', res.message);
              }
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to convert tokens.');
            } finally {
              setConverting(false);
            }
          },
        },
      ]
    );
  };

  const handleActionItem = async (item: RewardItem) => {
    const isCert = (item.category || '').toLowerCase() === 'certificate' ||
      item.id.toLowerCase().includes('cert') ||
      item.title.toLowerCase().includes('certificate');

    const coinCost = item.coin_cost;
    const tokenCost = coinCost * 1000;
    const effectiveTotalTokens = (coins * 1000) + tokens;

    const existingRedemption = (redemptions || []).find(
      (r) => r.reward_id === item.id || (r.reward_id && r.reward_id === item.title)
    );
    const isTxRedeemed = (transactions || []).some(
      (t) => t.activity_type === 'redemption' && t.reference_id === item.id
    );
    const isAlreadyRedeemed = Boolean(existingRedemption || isTxRedeemed);

    // If it's a certificate and already redeemed OR user has sufficient coin balance, show certificate directly!
    if (isCert && (isAlreadyRedeemed || coins >= coinCost)) {
      const type = item.coin_cost >= 10 || item.title.toLowerCase().includes('excellence')
        ? 'excellence'
        : 'verified_learner';
      setActiveCertType(type);
      setActiveCertId(existingRedemption?.certificate_id || `FX-${type === 'excellence' ? 'EX' : 'VL'}-001`);
      setCertModalVisible(true);
      return;
    }

    // If user has insufficient balance to unlock
    if (coins < coinCost && effectiveTotalTokens < tokenCost) {
      Alert.alert(
        'Certificate Locked 🔒',
        `The "${item.title}" requires ${coinCost} Gold Coins (${tokenCost.toLocaleString()} Task Tokens).\n\n• Your Balance: ${coins} Gold Coins & ${tokens.toLocaleString()} Tokens\n• Tokens Needed: ${(tokenCost - effectiveTotalTokens).toLocaleString()} more Tokens.\n\nEarn tokens by completing daily missions, quizzes and tasks to unlock this reward!`,
        [{ text: 'Got It', style: 'default' }]
      );
      return;
    }

    // User has enough tokens or coins to redeem/exchange: open redemption modal
    setSelectedItem(item);
  };

  const handleConfirmRedeem = async () => {
    if (!selectedItem) return;

    const coinCost = selectedItem.coin_cost;
    const tokenCost = coinCost * 1000;
    const effectiveTotalTokens = (coins * 1000) + tokens;

    if (coins < coinCost && effectiveTotalTokens < tokenCost) {
      Alert.alert(
        'Insufficient Balance',
        `You do not have enough tokens or gold coins to redeem "${selectedItem.title}".\n\n• Required: ${coinCost} Gold Coins (${tokenCost.toLocaleString()} Tokens)\n• Your Balance: ${coins} Gold Coins & ${tokens.toLocaleString()} Tokens`
      );
      setSelectedItem(null);
      return;
    }

    setRedeeming(true);
    try {
      if (coins < coinCost) {
        const neededCoins = coinCost - coins;
        const tokensToExchange = neededCoins * 1000;
        const convRes = await convertTokensToGoldCoins(user?.id || '', tokensToExchange);
        if (!convRes.success) {
          Alert.alert('Exchange Failed', convRes.message || 'Unable to exchange tokens.');
          setRedeeming(false);
          return;
        }
      }

      const res = await redeemCatalogItem(selectedItem.id);
      if (res.success) {
        const itemCategory = (selectedItem.category || '').toLowerCase();
        const itemId = (selectedItem.id || '').toLowerCase();
        const itemTitle = (selectedItem.title || '').toLowerCase();
        setSelectedItem(null);

        await refreshGamification();

        if (itemCategory === 'certificate' || itemId.includes('cert') || itemTitle.includes('certificate')) {
          const type = selectedItem.coin_cost >= 10 || itemTitle.includes('excellence') ? 'excellence' : 'verified_learner';
          setActiveCertType(type);
          setActiveCertId(res.certificate_id || '');
          setCertModalVisible(true);
        } else {
          Alert.alert('Congratulations! 🎉', `You successfully redeemed ${selectedItem.title}!`);
        }
      } else {
        Alert.alert('Redemption Failed', res.message || 'Unable to redeem item.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Something went wrong.');
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, Platform.OS === 'ios' ? 44 : 12) }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => safeBack('/(tabs)')}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FEEDX Wallet & Rewards Store</Text>
        <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistoryModal(true)}>
          <MaterialCommunityIcons name="receipt-text-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 1. FEEDX Dual Currency Wallet Hero Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="wallet" size={20} color="#3B82F6" style={{ marginRight: 8 }} />
              <Text style={styles.walletLabel}>FEEDX Dual Currency Wallet</Text>
            </View>
            <View style={styles.goldBadge}>
              <Text style={styles.goldBadgeText}>Gold Tier</Text>
            </View>
          </View>

          {/* Dual Currency Balances Row */}
          <View style={styles.dualCurrencyRow}>
            {/* Left Card: Task Tokens */}
            <View style={styles.tokenBox}>
              <View style={styles.currencyBoxHeader}>
                <Ionicons name="flash" size={15} color="#818CF8" />
                <Text style={styles.tokenBoxTitle}>TASK TOKENS</Text>
              </View>
              <Text style={styles.currencyNumber}>{tokens.toLocaleString()}</Text>
              <Text style={styles.currencySubtext}>Collected from Tasks</Text>
            </View>

            {/* Right Card: Gold Coins */}
            <View style={styles.coinBox}>
              <View style={styles.currencyBoxHeader}>
                <FontAwesome5 name="coins" size={13} color="#F59E0B" />
                <Text style={styles.coinBoxTitle}>GOLD COINS</Text>
              </View>
              <Text style={styles.currencyNumber}>{coins.toLocaleString()}</Text>
              <Text style={styles.coinSubtext}>1 Coin = 1,000 Tokens</Text>
            </View>
          </View>

          {/* Progress Box toward Next Gold Coin */}
          <View style={styles.progressBox}>
            <View style={styles.progressHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="sparkles" size={15} color="#10B981" />
                <Text style={styles.progressTitle}>Progress to Next Gold Coin</Text>
              </View>
              <View style={styles.progressPill}>
                <Text style={styles.progressPillText}>{progressPct}%</Text>
              </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.tokenProgressTrack}>
              <View style={[styles.tokenProgressFill, { width: `${progressPct}%` }]} />
            </View>

            {/* 3 Stats Breakdown Columns */}
            <View style={styles.statsThreeRow}>
              <View style={styles.miniStatCard}>
                <Text style={styles.miniStatLabel}>TOKEN BALANCE</Text>
                <Text style={styles.miniStatValueWhite}>{tokens.toLocaleString()}</Text>
              </View>
              <View style={styles.miniStatCardGold}>
                <Text style={styles.miniStatLabelGold}>COINS EARNED</Text>
                <Text style={styles.miniStatValueGold}>{coins} Coins</Text>
              </View>
              <View style={styles.miniStatCardGreen}>
                <Text style={styles.miniStatLabelGreen}>TO NEXT COIN</Text>
                <Text style={styles.miniStatValueGreen}>{toNextCoin.toLocaleString()}</Text>
              </View>
            </View>

            <Text style={styles.progressFooterSubtext}>
              Collect {toNextCoin.toLocaleString()} more tokens to unlock your next Gold Coin (1,000 Tokens = 1 Gold Coin).
            </Text>
          </View>
        </View>

        {/* 2. Token to Coin Exchange Card */}
        <View style={styles.exchangeCard}>
          <View style={styles.exchangeHeaderRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.exchangeIconWrap}>
                <FontAwesome5 name="exchange-alt" size={12} color="#F59E0B" />
              </View>
              <Text style={styles.exchangeTitle}>Token to Coin Exchange</Text>
            </View>
            <View style={styles.ratePill}>
              <Text style={styles.ratePillText}>1,000 Tokens = 1 Coin</Text>
            </View>
          </View>

          <Text style={styles.exchangeDesc}>
            Convert your collected Task Tokens into Gold Coins to redeem certificates and rewards!
          </Text>

          <TouchableOpacity
            style={[
              styles.exchangeActionBtn,
              { backgroundColor: tokens >= 1000 ? '#2563EB' : '#1E2B47' }
            ]}
            onPress={() => handleConvertSpecific(1000)}
            disabled={converting || tokens < 1000}
            activeOpacity={0.8}
          >
            <Text style={styles.exchangeActionBtnText}>
              Exch. 1,000 Tokens (1 Coin)
            </Text>
          </TouchableOpacity>
        </View>

        {/* 3. Reward Tiers & Milestones Section */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Reward Tiers & Milestones</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.milestonesScroll}
          >
            {MILESTONES.map((m) => (
              <View key={m.coins} style={styles.milestoneCard}>
                <View style={styles.milestoneIconWrap}>
                  <FontAwesome5 name={m.icon as any} size={16} color="#F59E0B" />
                </View>
                <Text style={styles.milestoneCoins}>
                  {m.coins} Coins ({m.tokens.toLocaleString()} Tokens)
                </Text>
                <Text style={styles.milestoneText} numberOfLines={2}>
                  {m.reward}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 4. Redeem Rewards Store Section */}
        <View style={styles.sectionWrap}>
          <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Redeem Rewards Store</Text>
          <View style={styles.categoriesRow}>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catTab,
                    { backgroundColor: isSelected ? '#F59E0B' : '#141C30' },
                  ]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.catTabText,
                      { color: isSelected ? '#FFFFFF' : '#94A3B8' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. Catalog Item Cards Grid */}
        <View style={styles.catalogGrid}>
          {filteredCatalog.map((item) => {
            const isCert = (item.category || '').toLowerCase() === 'certificate';
            const categoryTag = isCert
              ? 'CERTIFICATE'
              : (item.coin_cost === 30 ? 'BUNDLE' : 'TICKET');

            return (
              <View key={item.id} style={styles.itemCard}>
                {/* Top Graphic Visual Container */}
                <RewardCardGraphic cost={item.coin_cost} />

                {/* Metadata Row */}
                <View style={styles.itemMetaRow}>
                  <Text style={styles.itemCategoryText}>{categoryTag}</Text>
                  <View style={styles.costBadge}>
                    <FontAwesome5 name="coins" size={10} color="#F59E0B" style={{ marginRight: 4 }} />
                    <Text style={styles.costText}>{item.coin_cost} Gold Coins</Text>
                  </View>
                </View>

                {/* Title & Description */}
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>

                {/* Action Button matching screenshot View Certificate */}
                <TouchableOpacity
                  style={styles.viewCertBtn}
                  activeOpacity={0.8}
                  onPress={() => handleActionItem(item)}
                >
                  <Text style={styles.viewCertBtnText}>View Certificate</Text>
                  <Ionicons name="document-text-outline" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* 6. Footer Note Banner */}
        <View style={styles.noteBanner}>
          <Text style={styles.noteTitle}>📍 NOTE :</Text>
          <Text style={styles.noteText}>
            Completing tasks earns you Task Tokens. Exchange 1,000 Tokens to get 1 Gold Coin. Use your Gold Coins to redeem exclusive certificates and rewards in the store!
          </Text>
        </View>
      </ScrollView>

      {/* Redemption Confirmation Modal */}
      <Modal visible={!!selectedItem} transparent animationType="fade" onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#0F172A' : '#1E293B' }]}>
            <Text style={styles.modalTitle}>Confirm Reward Redemption</Text>
            {selectedItem && (
              <>
                <Text style={styles.modalSub}>
                  Are you sure you want to redeem <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>{selectedItem.title}</Text> for{' '}
                  <Text style={{ color: '#10B981', fontWeight: '800' }}>
                    {(selectedItem.coin_cost * 1000).toLocaleString()} Tokens ({selectedItem.coin_cost} Gold Coins)
                  </Text>?
                </Text>

                <View style={styles.modalRow}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#334155' }]}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#2563EB' }]}
                    disabled={redeeming}
                    onPress={handleConfirmRedeem}
                  >
                    {redeeming ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={{ color: '#FFFFFF', fontWeight: '800' }}>Confirm Redeem</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Transaction History Modal */}
      <Modal visible={showHistoryModal} transparent animationType="slide" onRequestClose={() => setShowHistoryModal(false)}>
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: '#0F172A', maxHeight: '80%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.modalTitle}>Transactions & Exchange Ledger</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {transactions.length === 0 ? (
                <Text style={{ color: '#94A3B8', textAlign: 'center', marginVertical: 20 }}>No transaction history found.</Text>
              ) : (
                transactions.map((tx) => (
                  <View key={tx.id} style={styles.txItem}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={styles.txDesc}>{tx.description}</Text>
                      <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</Text>
                    </View>
                    <Text style={[styles.txAmount, { color: tx.amount > 0 ? '#10B981' : '#EF4444' }]}>
                      {tx.amount > 0 ? `+${tx.amount}` : tx.amount} {tx.activity_type?.includes('token') ? 'Tokens' : 'Coins'}
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Official FEEDX Certificate Modal */}
      <CertificateModal
        visible={certModalVisible}
        onClose={() => setCertModalVisible(false)}
        certificateType={activeCertType}
        studentName={user?.full_name || 'BHANU PRAKASH'}
        certificateId={activeCertId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0F1D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    flex: 1,
    marginHorizontal: 12,
  },
  historyBtn: {
    padding: 4,
  },

  // 1. Dual Currency Wallet Card
  walletCard: {
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 12,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#131C31',
    borderWidth: 1,
    borderColor: '#1E2B47',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  goldBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  goldBadgeText: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '800',
  },
  dualCurrencyRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 14,
  },
  tokenBox: {
    flex: 1,
    backgroundColor: '#1B223D',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2B355A',
  },
  currencyBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tokenBoxTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#818CF8',
    letterSpacing: 0.5,
  },
  currencyNumber: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 2,
  },
  currencySubtext: {
    color: '#94A3B8',
    fontSize: 10.5,
    marginTop: 2,
  },
  coinBox: {
    flex: 1,
    backgroundColor: '#2A2234',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#43334E',
  },
  coinBoxTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  coinSubtext: {
    color: '#FCD34D',
    fontSize: 10.5,
    marginTop: 2,
  },

  // Progress Box
  progressBox: {
    backgroundColor: '#162138',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#223254',
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  progressPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
  },
  tokenProgressTrack: {
    height: 6,
    backgroundColor: '#1E2B47',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  tokenProgressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  statsThreeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  miniStatCard: {
    flex: 1,
    backgroundColor: '#1A243D',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  miniStatLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  miniStatValueWhite: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '900',
    marginTop: 2,
  },
  miniStatCardGold: {
    flex: 1,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  miniStatLabelGold: {
    fontSize: 9,
    color: '#FCD34D',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  miniStatValueGold: {
    fontSize: 14,
    color: '#FCD34D',
    fontWeight: '900',
    marginTop: 2,
  },
  miniStatCardGreen: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
  },
  miniStatLabelGreen: {
    fontSize: 9,
    color: '#6EE7B7',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  miniStatValueGreen: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '900',
    marginTop: 2,
  },
  progressFooterSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
    marginTop: 4,
  },

  // 2. Token to Coin Exchange Card
  exchangeCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#131C31',
    borderWidth: 1,
    borderColor: '#1E2B47',
    gap: 10,
  },
  exchangeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exchangeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exchangeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  ratePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  ratePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10B981',
  },
  exchangeDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
  },
  exchangeActionBtn: {
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  exchangeActionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  // 3. Reward Tiers & Milestones Section
  sectionWrap: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  milestonesScroll: {
    gap: 12,
    paddingVertical: 10,
  },
  milestoneCard: {
    width: 142,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#131C31',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  milestoneIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  milestoneCoins: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
  },
  milestoneText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginTop: 4,
    lineHeight: 14,
  },

  // 4. Redeem Rewards Store Filter Tabs
  categoriesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  catTab: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
  },
  catTabText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  // 5. Catalog Grid & Cards
  catalogGrid: {
    paddingHorizontal: 16,
    marginTop: 14,
    gap: 14,
  },
  itemCard: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: '#131C31',
    borderWidth: 1,
    borderColor: '#1E2B47',
  },
  itemMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6,
  },
  itemCategoryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  costText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 17,
    marginBottom: 12,
  },
  viewCertBtn: {
    backgroundColor: '#2563EB',
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewCertBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },

  // Top Graphic Visual Box
  graphicBox: {
    height: 94,
    backgroundColor: '#0B1220',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  badgeLeftGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCostText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  certCardGraphic: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 150,
  },
  certBrand: {
    fontSize: 8,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  certTitleGraphic: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 0.5,
    marginVertical: 1,
  },
  certSubGraphic: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#334155',
  },
  bundleGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyGraphicBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  awardTextGraphic: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 0.5,
  },
  awardSubGraphic: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },

  // 6. Bottom Note Banner
  noteBanner: {
    marginHorizontal: 16,
    marginTop: 18,
    marginBottom: 24,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#131C31',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F59E0B',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E1',
    lineHeight: 18,
  },

  // Modals
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  modalSub: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  txDesc: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  txDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '800',
  },
});
