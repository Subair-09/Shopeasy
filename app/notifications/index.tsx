import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { Header } from '../../components/Header';
import { useNotifications } from '../../context/NotificationsContext';
import { AppNotification } from '../../types';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order':
        return { name: 'cube-outline' as const, color: Colors.primary, bg: Colors.lightPurple };
      case 'payment':
        return { name: 'card-outline' as const, color: Colors.success, bg: Colors.successLight };
      case 'promo':
        return { name: 'flame-outline' as const, color: '#D68910', bg: '#FEF3C7' };
      case 'system':
      default:
        return { name: 'notifications-outline' as const, color: Colors.info, bg: Colors.infoLight };
    }
  };

  const handleNotificationPress = (notif: AppNotification) => {
    markAsRead(notif.id);
    if (notif.type === 'order') {
      router.push('/(tabs)/orders');
    } else if (notif.type === 'promo') {
      router.push('/products');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="Notifications"
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark Read</Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="notifications-off-outline" size={54} color={Colors.mutedText} />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up with your updates!</Text>
          </View>
        ) : (
          notifications.map((notif) => {
            const iconConfig = getNotificationIcon(notif.type);
            return (
              <TouchableOpacity
                key={notif.id}
                activeOpacity={0.8}
                onPress={() => handleNotificationPress(notif)}
                style={[
                  styles.notificationCard,
                  !notif.isRead && styles.unreadNotificationCard,
                ]}
              >
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: iconConfig.bg },
                  ]}
                >
                  <Ionicons name={iconConfig.name} size={22} color={iconConfig.color} />
                </View>

                <View style={styles.contentCol}>
                  <View style={styles.titleRow}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        !notif.isRead && styles.unreadNotificationTitle,
                      ]}
                      numberOfLines={1}
                    >
                      {notif.title}
                    </Text>
                    {!notif.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <Text style={styles.messageText}>{notif.message}</Text>
                  <Text style={styles.timeText}>{notif.time}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  markAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  markAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  unreadNotificationCard: {
    backgroundColor: '#FAF9FF',
    borderColor: Colors.lightPurple,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
    flex: 1,
  },
  unreadNotificationTitle: {
    fontWeight: '900',
    color: Colors.primary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 6,
  },
  messageText: {
    fontSize: 13,
    color: Colors.secondaryText,
    lineHeight: 18,
    marginBottom: 6,
  },
  timeText: {
    fontSize: 11,
    color: Colors.mutedText,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.inputBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 6,
  },
});
