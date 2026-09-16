import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DeviceKind = 'light' | 'fan' | 'ac' | 'door';

type Device = {
  id: string;
  name: string;
  kind: DeviceKind;
  icon: keyof typeof Ionicons.glyphMap;
  isOn: boolean;
  statusOn: string;
  statusOff: string;
  color: string;
};

type RootStackParamList = {
  Home: undefined;
  Devices: undefined;
  DeviceDetails: { device: Device };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const initialDevices: Device[] = [
  {
    id: 'living-room-light',
    name: 'Living Room Light',
    kind: 'light',
    icon: 'bulb',
    isOn: true,
    statusOn: 'ON',
    statusOff: 'OFF',
    color: '#f2b84b',
  },
  {
    id: 'bedroom-fan',
    name: 'Bedroom Fan',
    kind: 'fan',
    icon: 'refresh-circle',
    isOn: false,
    statusOn: 'ON',
    statusOff: 'OFF',
    color: '#4d8ca8',
  },
  {
    id: 'air-conditioner',
    name: 'Air Conditioner',
    kind: 'ac',
    icon: 'snow',
    isOn: false,
    statusOn: 'ON',
    statusOff: 'OFF',
    color: '#62a9d1',
  },
  {
    id: 'main-door',
    name: 'Main Door',
    kind: 'door',
    icon: 'lock-closed',
    isOn: false,
    statusOn: 'UNLOCKED',
    statusOff: 'LOCKED',
    color: '#d86b62',
  },
];

type IconName = keyof typeof Ionicons.glyphMap;

function Icon({ name, color = '#183b56', size = 24 }: { name: IconName; color?: string; size?: number }) {
  return <Ionicons name={name} size={size} color={color} />;
}

function ScreenHeader({
  title,
  onBack,
  rightIcon,
  onRightPress,
}: {
  title: string;
  onBack?: () => void;
  rightIcon?: IconName;
  onRightPress?: () => void;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole={onBack ? 'button' : undefined}
        accessibilityLabel={onBack ? 'Go back' : undefined}
        disabled={!onBack}
        onPress={onBack}
        style={styles.headerIconButton}
      >
        <Icon name={onBack ? 'arrow-back' : 'menu'} size={25} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      {rightIcon ? (
        <Pressable onPress={onRightPress} style={styles.headerIconButton}>
          <Icon name={rightIcon} size={24} />
        </Pressable>
      ) : (
        <View style={styles.headerIconButton} />
      )}
    </View>
  );
}

function StatusPill({ device, compact = false }: { device: Device; compact?: boolean }) {
  const isPositive = device.kind === 'door' ? !device.isOn : device.isOn;
  const label = device.isOn ? device.statusOn : device.statusOff;

  return (
    <View style={[styles.statusPill, compact && styles.compactStatusPill, isPositive ? styles.statusOn : styles.statusOff]}>
      <View style={[styles.statusDot, isPositive ? styles.statusDotOn : styles.statusDotOff]} />
      <Text style={[styles.statusText, isPositive ? styles.statusTextOn : styles.statusTextOff]}>{label}</Text>
    </View>
  );
}

function DeviceCard({ device, onPress }: { device: Device; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.deviceCard, pressed && styles.pressed]}>
      <View style={[styles.cardIcon, { backgroundColor: `${device.color}20` }]}>
        <Icon name={device.icon} size={34} color={device.color} />
      </View>
      <Text style={styles.cardName} numberOfLines={2}>{device.name}</Text>
      <StatusPill device={device} compact />
    </Pressable>
  );
}

function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.homeContent}>
        <View style={styles.brandIcon}>
          <Icon name="home" size={32} color="#ffffff" />
        </View>
        <Text style={styles.dashboardTitle}>Smart Home{ '\n' }Dashboard</Text>
        <Text style={styles.welcomeText}>Welcome, Student!</Text>

        <View style={styles.cardGrid}>
          {initialDevices.map((device) => (
            <DeviceCard key={device.id} device={device} onPress={() => navigation.navigate('DeviceDetails', { device })} />
          ))}
        </View>

        <Pressable onPress={() => navigation.navigate('Devices')} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
          <Icon name="menu-outline" color="#ffffff" size={20} />
          <Text style={styles.primaryButtonText}>VIEW DEVICES</Text>
          <Icon name="arrow-forward" color="#ffffff" size={20} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function DeviceRow({ device, onPress, onToggle }: { device: Device; onPress: () => void; onToggle: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.deviceRow, pressed && styles.pressed]}>
      <View style={[styles.listIcon, { backgroundColor: `${device.color}20` }]}>
        <Icon name={device.icon} color={device.color} size={25} />
      </View>
      <View style={styles.deviceInfo}>
        <Text style={styles.deviceName}>{device.name}</Text>
        <StatusPill device={device} compact />
      </View>
      <Switch
        accessibilityLabel={`Toggle ${device.name}`}
        onValueChange={onToggle}
        trackColor={{ false: '#d5dee5', true: '#9bd8b1' }}
        thumbColor={device.isOn ? '#27834c' : '#f6f8f9'}
        value={device.isOn}
      />
    </Pressable>
  );
}

function BottomNavigation({ onHome }: { onHome: () => void }) {
  return (
    <View style={styles.bottomNavigation}>
      <Pressable onPress={onHome} style={styles.bottomItem}>
        <Icon name="home" size={22} color="#27834c" />
        <Text style={styles.bottomItemActive}>Home</Text>
      </Pressable>
      <View style={styles.bottomItem}>
        <Icon name="pulse-outline" size={22} color="#9aaab4" />
        <Text style={styles.bottomItemText}>Activity</Text>
      </View>
      <View style={styles.bottomItem}>
        <Icon name="person-outline" size={22} color="#9aaab4" />
        <Text style={styles.bottomItemText}>Profile</Text>
      </View>
    </View>
  );
}

function DevicesScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Devices'>) {
  const [devices, setDevices] = useState(initialDevices);

  function toggleDevice(id: string) {
    setDevices((currentDevices) => currentDevices.map((device) => (
      device.id === id ? { ...device, isOn: !device.isOn } : device
    )));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScreenHeader title="My Devices" rightIcon="settings-outline" />
      <ScrollView contentContainerStyle={styles.devicesContent}>
        <Text style={styles.sectionEyebrow}>YOUR DEVICES</Text>
        {devices.map((device) => (
          <DeviceRow
            key={device.id}
            device={device}
            onPress={() => navigation.navigate('DeviceDetails', { device })}
            onToggle={() => toggleDevice(device.id)}
          />
        ))}
      </ScrollView>
      <BottomNavigation onHome={() => navigation.navigate('Home')} />
    </SafeAreaView>
  );
}

function DeviceDetailsScreen({ navigation, route }: NativeStackScreenProps<RootStackParamList, 'DeviceDetails'>) {
  const [device, setDevice] = useState(route.params.device);
  const isPositive = device.kind === 'door' ? !device.isOn : device.isOn;

  function toggleDevice() {
    setDevice((currentDevice) => ({ ...currentDevice, isOn: !currentDevice.isOn }));
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScreenHeader title="Device Details" onBack={() => navigation.goBack()} rightIcon="settings-outline" />
      <ScrollView contentContainerStyle={styles.detailsContent}>
        <View style={[styles.detailsIcon, { backgroundColor: `${device.color}20` }]}>
          <Icon name={device.icon} color={device.color} size={64} />
        </View>
        <Text style={styles.detailsName}>{device.name}</Text>
        <StatusPill device={device} />
        <Text style={styles.detailsDescription}>
          {isPositive ? 'This device is currently active.' : 'This device is currently inactive.'}
        </Text>
        <Pressable onPress={toggleDevice} style={({ pressed }) => [styles.toggleButton, isPositive ? styles.toggleButtonOn : styles.toggleButtonOff, pressed && styles.pressed]}>
          <Icon name={isPositive ? 'power' : 'power-outline'} color="#ffffff" size={21} />
          <Text style={styles.toggleButtonText}>{isPositive ? 'TURN OFF' : 'TURN ON'}</Text>
        </Pressable>
        <Pressable style={styles.settingsButton}>
          <Icon name="settings-outline" size={20} color="#183b56" />
          <Text style={styles.settingsButtonText}>Device settings</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Devices" component={DevicesScreen} />
        <Stack.Screen name="DeviceDetails" component={DeviceDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f7f5',
  },
  homeContent: {
    alignItems: 'center',
    padding: 24,
    paddingBottom: 40,
  },
  brandIcon: {
    alignItems: 'center',
    backgroundColor: '#27834c',
    borderRadius: 20,
    height: 64,
    justifyContent: 'center',
    marginBottom: 18,
    width: 64,
  },
  dashboardTitle: {
    color: '#183b56',
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 36,
    textAlign: 'center',
  },
  welcomeText: {
    color: '#647985',
    fontSize: 16,
    marginTop: 8,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    marginTop: 28,
    width: '100%',
  },
  deviceCard: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dce7e2',
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 170,
    padding: 16,
    width: '47%',
  },
  cardIcon: {
    alignItems: 'center',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    marginBottom: 12,
    width: 64,
  },
  cardName: {
    color: '#183b56',
    fontSize: 15,
    fontWeight: '700',
    minHeight: 38,
    textAlign: 'center',
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  compactStatusPill: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusOn: {
    backgroundColor: '#e1f4e7',
  },
  statusOff: {
    backgroundColor: '#edf1f3',
  },
  statusDot: {
    borderRadius: 5,
    height: 8,
    width: 8,
  },
  statusDotOn: {
    backgroundColor: '#27834c',
  },
  statusDotOff: {
    backgroundColor: '#8b9ba3',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusTextOn: {
    color: '#27834c',
  },
  statusTextOff: {
    color: '#647985',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#183b56',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 28,
    paddingHorizontal: 22,
    paddingVertical: 16,
    width: '100%',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.75,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomColor: '#e3ebe7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerIconButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  headerTitle: {
    color: '#183b56',
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  devicesContent: {
    padding: 20,
    paddingBottom: 28,
  },
  sectionEyebrow: {
    color: '#647985',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 12,
  },
  deviceRow: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#dce7e2',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    minHeight: 86,
    padding: 14,
  },
  listIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    marginRight: 14,
    width: 52,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    color: '#183b56',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNavigation: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderTopColor: '#e3ebe7',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    paddingTop: 10,
  },
  bottomItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 80,
  },
  bottomItemActive: {
    color: '#27834c',
    fontSize: 12,
    fontWeight: '700',
  },
  bottomItemText: {
    color: '#9aaab4',
    fontSize: 12,
  },
  detailsContent: {
    alignItems: 'center',
    padding: 28,
  },
  detailsIcon: {
    alignItems: 'center',
    borderRadius: 32,
    height: 128,
    justifyContent: 'center',
    marginTop: 20,
    width: 128,
  },
  detailsName: {
    color: '#183b56',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 24,
    textAlign: 'center',
  },
  detailsDescription: {
    color: '#647985',
    fontSize: 15,
    marginTop: 18,
    textAlign: 'center',
  },
  toggleButton: {
    alignItems: 'center',
    borderRadius: 14,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginTop: 28,
    paddingVertical: 16,
    width: '100%',
  },
  toggleButtonOn: {
    backgroundColor: '#27834c',
  },
  toggleButtonOff: {
    backgroundColor: '#183b56',
  },
  toggleButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  settingsButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
    padding: 12,
  },
  settingsButtonText: {
    color: '#183b56',
    fontSize: 14,
    fontWeight: '700',
  },
});
