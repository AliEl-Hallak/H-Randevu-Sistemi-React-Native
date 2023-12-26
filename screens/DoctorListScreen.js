import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { DotIndicator } from 'react-native-indicators';

const DoctorListScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'doctors'));
      const fetchedDoctors = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDoctors(fetchedDoctors);
      setIsLoading(false);
    };

    fetchDoctors();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color="#2196f3" />
        </View>
      )}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={styles.doctorItem}>
            <Text style={styles.doctorInfo}>
              {item.name} - {item.department} - {item.clinic}
            </Text>
            <Text style={styles.workingDays}>
              Çalışma Günleri: {item.workingDays.join(', ')}
            </Text>
            <Text style={styles.workingHours}>
              Çalışma Saatleri: {item.workingHours.join(', ')}
            </Text>
          </View>
          
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  doctorItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  doctorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  department: {
    color: '#666',
    fontSize: 14,
  },
  clinic: {
    color: '#666',
    fontSize: 14,
  },
  workingDays: {
    color: '#666',
    fontSize: 14,
  },
  workingHours: {
    color: '#666',
    fontSize: 14,
  },
});

export default DoctorListScreen;
