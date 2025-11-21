import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSimInfo } from 'react-native-sim-info';

/**
 * Example component demonstrating how to use the useSimInfo hook
 * to display SIM slot information with multi-SIM support
 */
export const App = () => {
  const {
    simSlots,
    isLoading,
    error,
    hasMultipleSims,
    activeSimCount,
    refresh,
    requestPermission,
  } = useSimInfo();

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      Alert.alert('Success', 'Permission granted');
      refresh();
    } else {
      Alert.alert('Permission Denied', 'Unable to access SIM information');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading SIM information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={handleRequestPermission}>
          <Text style={styles.buttonText}>Request Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={refresh}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SIM Information</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refresh}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Active SIM Cards:</Text>
          <Text style={styles.summaryValue}>{activeSimCount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Multiple SIMs:</Text>
          <Text style={styles.summaryValue}>{hasMultipleSims ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      {simSlots.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No active SIM cards found</Text>
        </View>
      ) : (
        simSlots.map((sim, index) => (
          <View key={sim.subscriptionId} style={styles.simCard}>
            <View style={styles.simHeader}>
              <Text style={styles.simTitle}>
                SIM {index + 1} - Slot {sim.slotIndex}
              </Text>
              {sim.isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              )}
            </View>

            <View style={styles.simDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Carrier:</Text>
                <Text style={styles.detailValue}>{sim.carrierName || 'Unknown'}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Display Name:</Text>
                <Text style={styles.detailValue}>{sim.displayName || 'N/A'}</Text>
              </View>

              {sim.phoneNumber && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone Number:</Text>
                  <Text style={styles.detailValue}>{sim.phoneNumber}</Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Country:</Text>
                <Text style={styles.detailValue}>
                  {sim.countryIso ? sim.countryIso.toUpperCase() : 'N/A'}
                </Text>
              </View>

              {(sim.mcc || sim.mnc) && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>MCC/MNC:</Text>
                  <Text style={styles.detailValue}>
                    {sim.mcc || 'N/A'} / {sim.mnc || 'N/A'}
                  </Text>
                </View>
              )}

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Subscription ID:</Text>
                <Text style={styles.detailValue}>{sim.subscriptionId}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Carrier ID:</Text>
                <Text style={styles.detailValue}>
                  {sim.carrierId !== -1 ? sim.carrierId : 'N/A'}
                </Text>
              </View>

              {sim.iccId && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>ICC ID:</Text>
                  <Text style={styles.detailValue} numberOfLines={1}>
                    {sim.iccId}
                  </Text>
                </View>
              )}

              {sim.isEmbedded && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Type:</Text>
                  <Text style={styles.detailValue}>eSIM</Text>
                </View>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  simCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  simHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#007AFF',
  },
  simTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  simDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
});

export default App;
