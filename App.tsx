import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import BookingScreen from './src/screens/BookingScreen';

export default function App() {
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
        <BookingScreen />
      </SafeAreaView>
      <StatusBar style="dark" />
    </>
  );
}
