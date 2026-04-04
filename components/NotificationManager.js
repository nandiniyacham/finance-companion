import * as Notifications from 'expo-notifications';


export async function scheduleReminder(title, body, secondsFromNow) {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: secondsFromNow },
  });
}