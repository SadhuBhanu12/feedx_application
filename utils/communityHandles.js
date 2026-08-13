import { Alert, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export const FEEDX_HANDLES_TEXT = `Stay updated with the latest student opportunities, announcements, educational resources, and community initiatives.

🌐 Website
feedxpolytechnic.com

📢 WhatsApp Public Channel
whatsapp.com/channel/0029Vaqm8e4IN9iqTfXumX1r

📸 Instagram
instagram.com/feedx_official

💼 LinkedIn
linkedin.com/company/feedx-tg-polytechnic-community

▶️ YouTube
youtube.com/@feedx_official

💚 Join the movement. Stay informed. Make your voice count.

FEEDX Polytechnic Community
Built by Students, for Students
Listen • Respond • Resolve`;

export function showCommunityHandlesAlert() {
  Alert.alert(
    '📲 Connect With FEEDX Polytechnic Community',
    FEEDX_HANDLES_TEXT,
    [
      { text: 'Close', style: 'cancel' },
      { text: 'Visit Website', onPress: () => WebBrowser.openBrowserAsync('https://feedxpolytechnic.com') }
    ]
  );
}
