import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useGamification } from '@/context/GamificationContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { RewardItem, convertTokensToGoldCoins } from '@/services/gamificationService';
import CertificateModal from '@/components/ui/CertificateModal';

const CATEGORIES = ['All', 'certificate', 'gift_card', 'merchandise', 'award'];

const MILESTONES = [
  { coins: 5, reward: 'FEEDX Verified Learner Certificate', icon: 'award' },
  { coins: 10, reward: 'FEEDX Excellence Certificate + ₹100 Gift Card', icon: 'gift' },
  { coins: 20, reward: '₹500 Gift Card + FEEDX Merchandise', icon: 'box' },
  { coins: 50, reward: 'Annual FEEDX Excellence Award + Special Recognition + Premium Prize', icon: 'trophy' },
];

const RewardCardGraphic = ({ cost }: { cost: number }) => {
  if (cost === 5) {
    return (
      <View style={styles.graphicBox}>
        <View style={styles.badgeLeftGraphic}>
          <FontAwesome5 name="award" size={24} color="#F59E0B" />
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
          <FontAwesome5 name="gift" size={24} color="#94A3B8" />
          <Text style={styles.badgeCostText}>10 Coins</Text>
        </View>
        <View style={styles.graphicRightRow}>
          <View style={styles.certCardGraphic}>
            <Text style={styles.certTitleGraphic}>EXCELLENCE</Text>
            <Text style={styles.certSubGraphic}>CERTIFICATE</Text>
          </View>
          <View style={styles.giftCard100Graphic}>
            <Text style={styles.giftCardLabel}>GIFT CARD</Text>
            <Text style={styles.giftCardAmount}>₹100</Text>
          </View>
        </View>
      </View>
    );
  }

  if (cost === 20) {
    return (
      <View style={styles.graphicBox}>
        <View style={styles.badgeLeftGraphic}>
          <FontAwesome5 name="box" size={24} color="#F59E0B" />
          <Text style={styles.badgeCostText}>20 Coins</Text>
        </View>
        <View style={styles.graphicRightRow}>
          <View style={[styles.giftCard100Graphic, { backgroundColor: '#1E1B4B' }]}>
            <Text style={styles.giftCardLabel}>GIFT CARD</Text>
            <Text style={styles.giftCardAmount}>₹500</Text>
          </View>
          <View style={styles.merchIconsGraphic}>
            <FontAwesome5 name="tshirt" size={16} color="#93C5FD" />
            <FontAwesome5 name="shopping-bag" size={16} color="#FDE047" />
            <FontAwesome5 name="book" size={16} color="#A7F3D0" />
          </View>
        </View>
      </View>
    );
  }

  if (cost === 50) {
    return (
      <View style={styles.graphicBox}>
        <View style={styles.badgeLeftGraphic}>
          <FontAwesome5 name="trophy" size={24} color="#8B5CF6" />
          <Text style={styles.badgeCostText}>50 Coins</Text>
        </View>
        <View style={styles.trophyGraphicBox}>
          <FontAwesome5 name="trophy" size={32} color="#F59E0B" />
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.awardTextGraphic}>EXCELLENCE AWARD</Text>
            <Text style={styles.awardSubGraphic}>PREMIUM RECOGNITION</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.graphicBox}>
      <View style={styles.badgeLeftGraphic}>
        <FontAwesome5 name="award" size={24} color="#F59E0B" />
        <Text style={styles.badgeCostText}>{cost} Coins</Text>
      </View>
      <View style={styles.trophyGraphicBox}>
        <FontAwesome5 name="gift" size={32} color="#F59E0B" />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.awardTextGraphic}>FEEDX REWARD</Text>
          <Text style={styles.awardSubGraphic}>EXCLUSIVE RECOGNITION</Text>
        </View>
      </View>
    </View>
  );
};

export default function RewardsScreen() {
  const { wallet, streak, catalog, transactions, redemptions, redeemCatalogItem, convertTokensToGold, refreshGamification, loading } = useGamification();
  const { colors, isDark } = useTheme();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<RewardItem | null>(null);
  const [redeeming, setRedeeming] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const { user } = useUser();

  React.useEffect(() => {
    refreshGamification();
  }, [refreshGamification]);

  // Currencies: Tokens (FX/Task Tokens) and Gold Coins (1 Coin = 1000 Tokens)
  const tokens = wallet?.tokens !== undefined 
    ? wallet.tokens 
    : (streak?.xp_points !== undefined ? streak.xp_points : (user?.xp_points ?? user?.tokens ?? 0));
  
  const coins = wallet?.gold_coins !== undefined 
    ? wallet.gold_coins 
    : (user?.gold_coins ?? user?.coins ?? 0);

  const totalEarned = wallet?.total_earned !== undefined ? wallet.total_earned : (user?.total_earned ?? coins);

  const [certModalVisible, setCertModalVisible] = useState(false);
  const [activeCertType, setActiveCertType] = useState<'verified_learner' | 'excellence'>('verified_learner');
  const [activeCertId, setActiveCertId] = useState<string>('');

  const filteredCatalog = catalog.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleConfirmRedeem = async () => {
    if (!selectedItem) return;

    const coinCost = selectedItem.coin_cost;
    const tokenCost = coinCost * 1000;

    // Check if user has enough coins or tokens
    const totalValueInCoins = coins + Math.floor(tokens / 1000);
    if (coins < coinCost && totalValueInCoins < coinCost) {
      Alert.alert(
        'Insufficient Tokens & Coins 🪙',
        `You need ${tokenCost.toLocaleString()} Tokens (or ${coinCost} Gold Coins) to redeem "${selectedItem.title}".\n\nYour Current Balance:\n⚡ ${tokens.toLocaleString()} Tokens\n🪙 ${coins} Gold Coins`
      );
      setSelectedItem(null);
      return;
    }

    setRedeeming(true);
    try {
      // Auto-convert tokens if needed before redemption
      if (coins < coinCost && tokens >= (coinCost - coins) * 1000) {
        const neededCoins = coinCost - coins;
        await convertTokensToGoldCoins(user?.id || '', neededCoins * 1000);
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
          Alert.alert('🎉 Congratulations!', `You successfully redeemed ${selectedItem.title}!`);
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

  const handleConvertSpecific = async (tokensToConvert: number) => {
    if (tokens < 1000) {
      Alert.alert(
        'Insufficient Tokens ⚡',
        `You need at least 1,000 tokens to exchange for a Gold Coin.\n\nYour Current Balance: ${tokens.toLocaleString()} Tokens.`
      );
      return;
    }

    const coinsToGet = Math.floor(tokensToConvert / 1000);
    const usedTokens = coinsToGet * 1000;

    Alert.alert(
      'Exchange Tokens ⚡ ➔ 🪙',
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
                Alert.alert('Success 🎉', res.message);
              } else {
                Alert.alert('Notice', res.message);
              }
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to convert tokens.');
            } finally {
              setConverting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0F172A' : '#F8FAFC' }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>FEEDX Wallet & Rewards Store</Text>
        
        <TouchableOpacity style={styles.historyBtn} onPress={() => setShowHistoryModal(true)}>
          <Ionicons name="receipt-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Wallet Overview Hero Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="wallet" size={20} color="#6366F1" style={{ marginRight: 8 }} />
              <Text style={styles.walletLabel}>FEEDX Dual Currency Wallet</Text>
            </View>
            <View style={styles.goldBadge}>
              <Text style={styles.goldBadgeText}>{coins >= 5 ? 'Gold Tier' : 'Student Tier'}</Text>
            </View>
          </View>

          {/* Currency Balances Display */}
          <View style={{ flexDirection: 'row', gap: 12, marginVertical: 14 }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(99, 102, 241, 0.15)', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.3)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Ionicons name="flash" size={16} color="#818CF8" />
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#818CF8', textTransform: 'uppercase' }}>Task Tokens</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900' }}>{tokens.toLocaleString()}</Text>
              <Text style={{ color: '#A5B4FC', fontSize: 10, marginTop: 2 }}>Collected from Tasks</Text>
            </View>

            <View style={{ flex: 1, backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <FontAwesome5 name="coins" size={14} color="#F59E0B" />
                <Text style={{ fontSize: 11, fontWeight: '900', color: '#FCD34D', textTransform: 'uppercase' }}>Gold Coins</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '900' }}>{coins}</Text>
              <Text style={{ color: '#FDE68A', fontSize: 10, marginTop: 2 }}>1 Coin = 1,000 Tokens</Text>
            </View>
          </View>

          {/* Milestone progress to next coin */}
          <View style={[styles.tokenRow, { marginTop: 2 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="sparkles" size={13} color="#10B981" style={{ marginRight: 6 }} />
              <Text style={[styles.tokenLabel, { fontSize: 11 }]}>Progress to Next Coin:</Text>
            </View>
            <Text style={[styles.tokenValue, { fontSize: 11, color: '#10B981' }]}>{(tokens % 1000).toLocaleString()} / 1,000 Tokens</Text>
          </View>

          <View style={styles.tokenProgressTrack}>
            <View style={[styles.tokenProgressFill, { width: `${Math.min(((tokens % 1000) / 1000) * 100, 100)}%`, backgroundColor: '#10B981' }]} />
          </View>
        </View>

        {/* 1,000:1 Token Converter Card */}
        <View style={{ marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 20, backgroundColor: isDark ? '#1E293B' : '#FFFFFF', borderWidth: 1, borderColor: isDark ? '#334155' : '#E2E8F0', gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: 'rgba(245, 158, 11, 0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesome5 name="exchange-alt" size={13} color="#F59E0B" />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '900', color: colors.textPrimary }}>Token to Coin Exchange</Text>
            </View>
            <View style={{ backgroundColor: 'rgba(16, 185, 129, 0.12)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
              <Text style={{ fontSize: 10, fontWeight: '800', color: '#10B981' }}>1,000 Tokens = 1 Coin</Text>
            </View>
          </View>

          <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}>
            Convert your collected Task Tokens into Gold Coins to redeem certificates and rewards!
          </Text>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }}>
            <TouchableOpacity
              style={[
                styles.convertBtn,
                { flex: 1, backgroundColor: tokens >= 1000 ? '#6366F1' : (isDark ? '#334155' : '#CBD5E1') }
              ]}
              onPress={() => handleConvertSpecific(1000)}
              disabled={converting || tokens < 1000}
            >
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                Exch. 1,000 Tokens (1 Coin)
              </Text>
            </TouchableOpacity>

            {tokens >= 2000 && (
              <TouchableOpacity
                style={[
                  styles.convertBtn,
                  { flex: 1, backgroundColor: '#F59E0B' }
                ]}
                onPress={() => handleConvertSpecific(Math.floor(tokens / 1000) * 1000)}
                disabled={converting}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                  Exch. All ({Math.floor(tokens / 1000)} Coins)
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Milestone Progression Timeline */}
        <View style={{ marginHorizontal: 16, marginTop: 4 }}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Reward Tiers & Milestones</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingVertical: 8 }}>
            {MILESTONES.map((m) => {
              const totalValueInCoins = coins + Math.floor(tokens / 1000);
              const achieved = totalValueInCoins >= m.coins;
              return (
                <View
                  key={m.coins}
                  style={[
                    styles.milestoneCard,
                    {
                      backgroundColor: achieved
                        ? isDark ? 'rgba(245, 158, 11, 0.15)' : '#FEF3C7'
                        : isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: achieved ? '#F59E0B' : isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <View style={styles.milestoneIconWrap}>
                    <FontAwesome5 name={m.icon as any} size={16} color={achieved ? '#D97706' : '#94A3B8'} />
                  </View>
                  <Text style={[styles.milestoneCoins, { color: achieved ? '#D97706' : colors.textPrimary }]}>
                    {m.coins} Coins ({ (m.coins * 1000).toLocaleString() } Tokens)
                  </Text>
                  <Text style={styles.milestoneText} numberOfLines={2}>{m.reward}</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Catalog Categories */}
        <View style={{ marginTop: 18, marginHorizontal: 16 }}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, marginBottom: 10 }]}>Redeem Rewards Store</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catTab,
                  {
                    backgroundColor: selectedCategory === cat
                      ? '#F59E0B'
                      : isDark ? '#1E293B' : '#E2E8F0',
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.catTabText,
                    { color: selectedCategory === cat ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {cat.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Catalog Items Grid */}
        <View style={styles.catalogGrid}>
          {filteredCatalog.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={{ color: colors.textSecondary }}>No reward items available in this category.</Text>
            </View>
          ) : (
            filteredCatalog.map((item) => {
              const coinCost = item.coin_cost;
              const tokenCost = coinCost * 1000;
              const totalValueInCoins = coins + Math.floor(tokens / 1000);
              const canAfford = totalValueInCoins >= coinCost;

              const existingRedemption = (redemptions || []).find((r) => r.reward_id === item.id);
              const isAlreadyRedeemed = Boolean(existingRedemption);

              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemCard,
                    {
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      borderColor: isDark ? '#334155' : '#E2E8F0',
                    },
                  ]}
                >
                  <RewardCardGraphic cost={item.coin_cost} />

                  <View style={styles.itemHeader}>
                    <Text style={styles.itemCategory}>{item.category.toUpperCase()}</Text>
                    <View style={styles.costBadge}>
                      <FontAwesome5 name="coins" size={10} color="#D97706" style={{ marginRight: 4 }} />
                      <Text style={styles.costText}>{item.coin_cost} Gold Coins</Text>
                    </View>
                  </View>
                  <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{item.title}</Text>
                  <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>

                  {isAlreadyRedeemed ? (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      style={[styles.redeemBtn, { backgroundColor: '#3B82F6' }]}
                      onPress={() => {
                        const isCert = (item.category || '').toLowerCase() === 'certificate' || item.id.toLowerCase().includes('cert') || item.title.toLowerCase().includes('certificate');
                        if (isCert) {
                          const type = item.coin_cost >= 10 || item.title.toLowerCase().includes('excellence') ? 'excellence' : 'verified_learner';
                          setActiveCertType(type);
                          setActiveCertId(existingRedemption?.certificate_id || `FX-${type === 'excellence' ? 'EX' : 'VL'}-001`);
                          setCertModalVisible(true);
                        } else {
                          Alert.alert('Redeemed Reward 🎁', `You have already redeemed "${item.title}".`);
                        }
                      }}
                    >
                      <Text style={styles.redeemBtnText}>View Certificate 📜</Text>
                    </TouchableOpacity>
                  ) : coins >= coinCost ? (
                    <TouchableOpacity
                      style={[styles.redeemBtn, { backgroundColor: '#10B981' }]}
                      onPress={() => setSelectedItem(item)}
                    >
                      <Text style={styles.redeemBtnText}>Redeem Item ({item.coin_cost} Coins)</Text>
                    </TouchableOpacity>
                  ) : totalValueInCoins >= coinCost ? (
                    <TouchableOpacity
                      style={[styles.redeemBtn, { backgroundColor: '#F59E0B' }]}
                      onPress={() => setSelectedItem(item)}
                    >
                      <Text style={styles.redeemBtnText}>Exchange Tokens & Redeem ({item.coin_cost} Coins)</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.redeemBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
                      <Text style={[styles.redeemBtnText, { color: colors.textMuted }]}>
                        🔒 Locked ({coins}/{item.coin_cost} Coins)
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        {/* Footer Note Banner */}
        <View style={[styles.noteBanner, { backgroundColor: isDark ? '#1E293B' : '#FEF3C7', borderColor: '#F59E0B' }]}>
          <Text style={styles.noteTitle}>💡 NOTE :</Text>
          <Text style={[styles.noteText, { color: isDark ? '#CBD5E1' : '#92400E' }]}>
            Completing tasks earns you Task Tokens. Exchange 1,000 Tokens to get 1 Gold Coin. Use your Gold Coins to redeem exclusive certificates and rewards in the store!
          </Text>
        </View>
      </ScrollView>

      {/* Redemption Modal */}
      <Modal visible={!!selectedItem} transparent animationType="fade" onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.overlay}>
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Confirm Reward Redemption</Text>
            {selectedItem && (
              <>
                <Text style={styles.modalSub}>
                  Are you sure you want to redeem <Text style={{ fontWeight: '800', color: colors.textPrimary }}>{selectedItem.title}</Text> for{' '}
                  <Text style={{ color: '#10B981', fontWeight: '800' }}>{(selectedItem.coin_cost * 1000).toLocaleString()} Tokens ({selectedItem.coin_cost} Gold Coins)</Text>?
                </Text>

                <View style={styles.modalRow}>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: isDark ? '#334155' : '#E2E8F0' }]}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={{ color: colors.textPrimary, fontWeight: '700' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalBtn, { backgroundColor: '#10B981' }]}
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
          <View style={[styles.modalCard, { backgroundColor: isDark ? '#0F172A' : '#FFFFFF', maxHeight: '80%' }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Transactions & Exchange Ledger</Text>
              <TouchableOpacity onPress={() => setShowHistoryModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {transactions.length === 0 ? (
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginVertical: 20 }}>No transaction history found.</Text>
              ) : (
                transactions.map((tx) => (
                  <View key={tx.id} style={[styles.txItem, { borderBottomColor: isDark ? '#334155' : '#E2E8F0' }]}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={[styles.txDesc, { color: colors.textPrimary }]}>{tx.description}</Text>
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
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 15, fontWeight: '800' },
  headerCoinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(234, 179, 8, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAB308',
  },
  headerCoinText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#EAB308',
  },
  historyBtn: { padding: 4 },
  walletCard: {
    margin: 16,
    borderRadius: 24,
    padding: 20,
    backgroundColor: '#1E1B4B',
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  walletLabel: { color: '#C7D2FE', fontSize: 13, fontWeight: '600' },
  goldBadge: {
    backgroundColor: 'rgba(234, 179, 8, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  goldBadgeText: { color: '#FEF08A', fontSize: 10, fontWeight: '800' },
  walletBalance: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', marginVertical: 10 },
  walletStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  statBox: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  statLabel: { color: '#A5B4FC', fontSize: 10 },
  statDivider: { width: 1, height: 20, backgroundColor: 'rgba(255, 255, 255, 0.2)' },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  milestoneCard: {
    width: 140,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
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
  milestoneCoins: { fontSize: 12, fontWeight: '800' },
  milestoneText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  catTab: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  catTabText: { fontSize: 11, fontWeight: '800' },
  catalogGrid: { paddingHorizontal: 16, marginTop: 14, gap: 12 },
  emptyBox: { padding: 20, alignItems: 'center' },
  itemCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemCategory: { fontSize: 10, fontWeight: '800', color: '#94A3B8' },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  costText: { fontSize: 11, fontWeight: '800', color: '#D97706' },
  itemTitle: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  itemDesc: { fontSize: 12, color: '#64748B', marginBottom: 12 },
  redeemBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  redeemBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: { borderRadius: 24, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: 10 },
  modalSub: { fontSize: 14, color: '#64748B', marginBottom: 20, lineHeight: 20 },
  modalRow: { flexDirection: 'row', gap: 10 },
  modalBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  txItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  txDesc: { fontSize: 13, fontWeight: '700' },
  txDate: { fontSize: 10, color: '#94A3B8', marginTop: 2 },
  txAmount: { fontSize: 14, fontWeight: '800' },
  noteBanner: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  noteTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#D97706',
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 18,
  },
  graphicBox: {
    height: 90,
    backgroundColor: '#0B0F19',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  badgeLeftGraphic: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCostText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FEF08A',
    marginTop: 4,
  },
  certCardGraphic: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#F59E0B',
    alignItems: 'center',
  },
  certBrand: {
    fontSize: 8,
    fontWeight: '900',
    color: '#0F172A',
  },
  certTitleGraphic: {
    fontSize: 9,
    fontWeight: '900',
    color: '#D97706',
  },
  certSubGraphic: {
    fontSize: 7,
    fontWeight: '700',
    color: '#475569',
  },
  graphicRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  giftCard100Graphic: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  giftCardLabel: {
    fontSize: 7,
    fontWeight: '800',
    color: '#94A3B8',
  },
  giftCardAmount: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FEF08A',
  },
  merchIconsGraphic: {
    flexDirection: 'row',
    gap: 6,
  },
  trophyGraphicBox: {
    alignItems: 'center',
    gap: 4,
  },
  awardTextGraphic: {
    fontSize: 9,
    fontWeight: '900',
    color: '#F59E0B',
  },
  awardSubGraphic: {
    fontSize: 7,
    color: '#94A3B8',
  },
  goldCoinGraphicBox: {
    alignItems: 'center',
  },
  goldCoinTextGraphic: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FEF08A',
    marginTop: 2,
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  tokenLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  tokenValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#3B82F6',
  },
  tokenProgressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 12,
  },
  tokenProgressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  convertBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  convertBtnText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
