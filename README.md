# react-native-sim-info

A React Native library to detect the physical status and details of all available SIM card slots on Android devices. Get comprehensive information about each SIM card including carrier details, phone numbers, slot indices, and more.

## Features

- 📱 Get detailed information for all SIM card slots
- 🔄 Detect dual SIM and multi-SIM devices
- 📊 Access carrier information, phone numbers, ICC IDs
- 🌍 Retrieve MCC/MNC codes and country ISO
- ⚡ Built with TurboModules for optimal performance
- 🎯 TypeScript support with full type definitions

## Installation

### Install from npm (when published)

```sh
npm install react-native-sim-info
```

### Install from GitHub

```sh
npm install git+https://github.com/MunishSW/react-native-sim-info.git
```

### Permissions

Add the following permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<!-- For Android 13+ to access phone numbers -->
<uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />
```

Request permissions at runtime before calling any methods:

```javascript
import { PermissionsAndroid, Platform } from 'react-native';

async function requestPermissions() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      {
        title: 'SIM Information Permission',
        message: 'This app needs access to read SIM information',
        buttonPositive: 'OK',
      }
    );
    
    // For Android 13+
    if (Platform.Version >= 33) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_PHONE_NUMBERS
      );
    }
    
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return false;
}
```

## API Reference

### Methods

All methods return Promises and will throw a `SECURITY_EXCEPTION` error if the required permissions are not granted.

#### `getSimSlotInfo()`

Get detailed information about all SIM card slots.

**Returns:** `Promise<SimSlotInfo[]>`

**Throws:** 
- `SECURITY_EXCEPTION` - If READ_PHONE_STATE permission is not granted
- `SERVICE_UNAVAILABLE` - If SubscriptionManager is not available
- `API_LEVEL_TOO_LOW` - If Android API level is below 22

**Example:**

```javascript
import { getSimSlotInfo } from 'react-native-sim-info';

try {
  const simSlots = await getSimSlotInfo();
  console.log('SIM Slots:', simSlots);
  // Output: Array of SimSlotInfo objects
} catch (error) {
  console.error('Error:', error.message);
}
```

#### `hasMultipleSims()`

Check if the device has multiple active SIM cards.

**Returns:** `Promise<boolean>`

**Throws:** 
- `SECURITY_EXCEPTION` - If READ_PHONE_STATE permission is not granted

**Example:**

```javascript
import { hasMultipleSims } from 'react-native-sim-info';

try {
  const isMultiSim = await hasMultipleSims();
  console.log('Has Multiple SIMs:', isMultiSim);
  // Output: true or false
} catch (error) {
  console.error('Error:', error.message);
}
```

#### `getActiveSimCount()`

Get the number of active SIM cards in the device.

**Returns:** `Promise<number>`

**Throws:** 
- `SECURITY_EXCEPTION` - If READ_PHONE_STATE permission is not granted

**Example:**

```javascript
import { getActiveSimCount } from 'react-native-sim-info';

try {
  const count = await getActiveSimCount();
  console.log('Active SIM Count:', count);
  // Output: 0, 1, 2, etc.
} catch (error) {
  console.error('Error:', error.message);
}
```

### Types

#### `SimSlotInfo`

Information about a single SIM card slot.

```typescript
interface SimSlotInfo {
  slotIndex: number;           // SIM slot index (0, 1, etc.)
  carrierId: number;           // Carrier ID (API 28+, otherwise -1)
  displayName: string;         // Display name of the SIM
  carrierName: string;         // Carrier/operator name
  countryIso: string;          // Country ISO code (e.g., "us", "in")
  isEmbedded: boolean;         // Whether SIM is eSIM (API 28+)
  isActive: boolean;           // Whether SIM is currently active
  phoneNumber: string | null;  // Phone number (may be null if not available)
  subscriptionId: number;      // Unique subscription ID
  iccId: string | null;        // ICC ID (SIM card serial number)
  mcc: string | null;          // Mobile Country Code
  mnc: string | null;          // Mobile Network Code
}
```

## Usage Examples

### Basic Usage

```javascript
import { getSimSlotInfo, hasMultipleSims, getActiveSimCount } from 'react-native-sim-info';
import { PermissionsAndroid } from 'react-native';

async function getSimInfo() {
  // Request permission first
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
  );
  
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    console.log('Permission denied');
    return;
  }

  try {
    // Get all SIM information
    const simSlots = await getSimSlotInfo();
    const isMultiSim = await hasMultipleSims();
    const activeCount = await getActiveSimCount();

    console.log('SIM Slots:', simSlots);
    console.log('Multi SIM:', isMultiSim);
    console.log('Active Count:', activeCount);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Using with React Hooks

See the [example app](./example) for a complete implementation with a custom `useSimInfo` hook that handles:
- Automatic permission requests
- Loading and error states
- Refresh functionality
- TypeScript support

```javascript
// Example from the example app
import { useSimInfo } from './hooks/useSimInfo';

function MyComponent() {
  const { 
    simSlots, 
    isLoading, 
    error, 
    hasMultipleSims, 
    activeSimCount,
    refresh,
    requestPermission 
  } = useSimInfo();

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      <Text>Active SIMs: {activeSimCount}</Text>
      <Text>Multi-SIM: {hasMultipleSims ? 'Yes' : 'No'}</Text>
      {simSlots.map((sim, index) => (
        <View key={index}>
          <Text>Carrier: {sim.carrierName}</Text>
          <Text>Phone: {sim.phoneNumber || 'N/A'}</Text>
        </View>
      ))}
    </View>
  );
}
```

## Platform Support

- ✅ Android (API level 22+)
- ❌ iOS (SIM information is not accessible on iOS)

## Error Handling

All methods can throw errors. Always wrap calls in try-catch blocks:

```javascript
try {
  const simSlots = await getSimSlotInfo();
} catch (error) {
  if (error.message.includes('SECURITY_EXCEPTION')) {
    console.log('Permission not granted');
  } else if (error.message.includes('SERVICE_UNAVAILABLE')) {
    console.log('Service not available on this device');
  } else {
    console.log('Unknown error:', error.message);
  }
}
```

## Troubleshooting

### Permission Denied Errors

Make sure you:
1. Added permissions to `AndroidManifest.xml`
2. Requested permissions at runtime before calling methods
3. For Android 13+, also request `READ_PHONE_NUMBERS` permission

### Phone Number Returns Null

Phone numbers may not be available because:
- Carrier doesn't store it on the SIM
- Permission `READ_PHONE_NUMBERS` not granted (Android 13+)
- Privacy restrictions on the device

### Module Not Found After Installation

If installing from Git:
1. Clear caches: `rm -rf node_modules && npm install`
2. Clean Android build: `cd android && ./gradlew clean && cd ..`
3. Rebuild: `npx react-native run-android`

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
