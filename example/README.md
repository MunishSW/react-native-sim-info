# react-native-sim-info Example App

This example app demonstrates how to use the `react-native-sim-info` library to retrieve and display SIM card information on Android devices.

## Features Demonstrated

- ✅ Custom `useSimInfo` hook for managing SIM info state
- ✅ Permission handling with user-friendly UI
- ✅ Loading and error states
- ✅ Displaying all SIM slot information
- ✅ Multi-SIM detection
- ✅ Pull-to-refresh functionality
- ✅ TypeScript implementation

## Project Structure

```
example/
├── src/
│   ├── App.tsx                    # Main app component
│   └── hooks/
│       └── useSimInfo.ts          # Custom hook for SIM info
```

## useSimInfo Hook

The example includes a custom `useSimInfo` hook located at `src/hooks/useSimInfo.ts` that wraps the library methods and provides:

### Props

The hook takes no parameters.

### Return Value

```typescript
interface UseSimInfoResult {
  simSlots: SimSlotInfo[];          // Array of SIM slot information
  isLoading: boolean;               // Loading state
  error: string | null;             // Error message if any
  hasMultipleSims: boolean;         // Whether device has multiple SIMs
  activeSimCount: number;           // Number of active SIM cards
  refresh: () => Promise<void>;     // Refresh SIM information
  requestPermission: () => Promise<boolean>; // Request permissions
}
```

### Properties

#### `simSlots`
- **Type:** `SimSlotInfo[]`
- **Description:** Array containing information about each active SIM card slot
- **Example:**
```javascript
[
  {
    slotIndex: 0,
    carrierName: "Verizon",
    phoneNumber: "+1234567890",
    // ... other properties
  }
]
```

#### `isLoading`
- **Type:** `boolean`
- **Description:** Indicates if SIM information is currently being fetched
- **Usage:** Show loading spinner while `true`

#### `error`
- **Type:** `string | null`
- **Description:** Contains error message if something went wrong, otherwise `null`
- **Common errors:** `"Permission denied"`, `"Service unavailable"`

#### `hasMultipleSims`
- **Type:** `boolean`
- **Description:** `true` if the device has 2 or more active SIM cards

#### `activeSimCount`
- **Type:** `number`
- **Description:** The total number of active SIM cards in the device
- **Values:** `0`, `1`, `2`, etc.

### Methods

#### `refresh()`
- **Type:** `() => Promise<void>`
- **Description:** Manually refresh SIM information
- **Usage:**
```javascript
const { refresh } = useSimInfo();

// Trigger refresh
await refresh();
```

#### `requestPermission()`
- **Type:** `() => Promise<boolean>`
- **Description:** Request READ_PHONE_STATE permission from the user
- **Returns:** `true` if permission granted, `false` otherwise
- **Usage:**
```javascript
const { requestPermission } = useSimInfo();

const granted = await requestPermission();
if (granted) {
  console.log('Permission granted!');
}
```

## Usage Example

```typescript
import { useSimInfo } from './hooks/useSimInfo';

function App() {
  const {
    simSlots,
    isLoading,
    error,
    hasMultipleSims,
    activeSimCount,
    refresh,
    requestPermission,
  } = useSimInfo();

  // Handle loading state
  if (isLoading) {
    return <ActivityIndicator />;
  }

  // Handle error state
  if (error) {
    return (
      <View>
        <Text>Error: {error}</Text>
        <Button title="Request Permission" onPress={requestPermission} />
      </View>
    );
  }

  // Display SIM information
  return (
    <ScrollView>
      <Text>Active SIMs: {activeSimCount}</Text>
      <Text>Dual SIM: {hasMultipleSims ? 'Yes' : 'No'}</Text>
      
      {simSlots.map((sim, index) => (
        <View key={index}>
          <Text>Slot {sim.slotIndex}</Text>
          <Text>Carrier: {sim.carrierName}</Text>
          <Text>Phone: {sim.phoneNumber || 'N/A'}</Text>
          <Text>Country: {sim.countryIso}</Text>
        </View>
      ))}
      
      <Button title="Refresh" onPress={refresh} />
    </ScrollView>
  );
}
```

## Running the Example

### Prerequisites

Make sure you have completed the [React Native environment setup](https://reactnative.dev/docs/set-up-your-environment).

### Step 1: Install Dependencies

From the **root** of the repository:

```sh
npm install
```

### Step 2: Start Metro

From the **example** directory:

```sh
npm start
```

### Step 3: Run on Android

In a new terminal, from the **example** directory:

```sh
npm run android
```

Or from the root:

```sh
npm run example android
```

## Permissions

The example app demonstrates proper permission handling:

1. **Initial Load:** Automatically checks for permissions
2. **Permission Request:** Shows UI to request permissions if not granted
3. **Error Handling:** Displays appropriate error messages
4. **Re-request:** Allows users to request permissions again if denied

The `AndroidManifest.xml` includes:

```xml
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_NUMBERS" />
```

## Key Implementation Details

### Automatic Permission Check
The hook automatically checks for permissions on mount and requests them if needed.

### Error Recovery
If permissions are denied, the app provides a button to re-request them.

### Data Refresh
Pull-to-refresh or manual refresh button allows users to reload SIM data.

### Multi-SIM Support
The app automatically detects and displays information for all SIM slots.

## Troubleshooting

### No SIM Information Displayed

1. Make sure your device has a SIM card inserted
2. Check that permissions were granted
3. Try using the refresh button
4. Check LogCat for error messages

### Permission Denied Error

1. Go to Android Settings > Apps > Example App > Permissions
2. Enable "Phone" permission
3. Restart the app or use the refresh button

### Build Errors

If you encounter build errors:

```sh
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android
```

## Learn More

- [react-native-sim-info Documentation](../README.md)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Android Permissions Guide](https://developer.android.com/guide/topics/permissions/overview)

## License

MIT
