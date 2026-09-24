import notifee, { AndroidImportance } from '@notifee/react-native';

class NotificationService {
  async sendTestNotification() {
    // Request permissions (required for Android 13+)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    // Display notification
    await notifee.displayNotification({
      title: '🔔 Test Expense Reminder',
      body: 'Local notification via Notifee working smoothly!',
      android: {
        channelId,
        pressAction: {
          id: 'default',
        },
      },
    });
    return true;
  }

  async requestAndroidPermission() {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1;
  }

  cancelAllReminders() {
    notifee.cancelAllNotifications();
  }
}

export default new NotificationService();
