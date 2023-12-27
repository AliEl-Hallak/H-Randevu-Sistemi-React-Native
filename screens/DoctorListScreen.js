import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { DotIndicator } from 'react-native-indicators';
import Icon from 'react-native-vector-icons/MaterialIcons';

const DoctorListScreen = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingDoctorId, setDeletingDoctorId] = useState(null);

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

  const handleDeleteDoctor = async (doctorId) => {
    try {
      // Silme işlemi başladığında loading göstergesini göster
      setDeletingDoctorId(doctorId);

      await deleteDoc(doc(FIRESTORE_DB, 'doctors', doctorId));
      // Doktor başarıyla silindiğinde bir geri bildirim göster
      Alert.alert('Başarılı', 'Doktor başarıyla silindi.', [{ text: 'Tamam' }]);
      // Silinen doktoru listeden kaldır
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
    } catch (error) {
      console.error('Doktor silinirken hata oluştu:', error);
      // Silme işlemi başarısız olduğunda bir hata mesajı göster
      Alert.alert('Hata', 'Doktor silinirken bir hata oluştu.', [{ text: 'Tamam' }]);
    } finally {
      // Silme işlemi tamamlandığında loading göstergesini kapat
      setDeletingDoctorId(null);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color="#FFA500" />
        </View>
      )}
      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.doctorItem}>
            <View style={styles.doctorInfoContainer}>
              <Text style={styles.doctorInfo}>
                ({item.name} - {item.department} - {item.clinic})
              </Text>
              <Text style={styles.workingDays}>
                Çalışma Günleri: {item.workingDays.join(', ')}
              </Text>
              <Text style={styles.workingHours}>
                Çalışma Saatleri: {item.workingHours.join(', ')}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteDoctor(item.id)} style={styles.deleteIcon}>
              {deletingDoctorId === item.id ? (
                <ActivityIndicator color="red" />
              ) : (
                <Icon name="delete" size={24} color="red" />
              )}
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between', // Sağa ve sola doğru genişletmek için
    alignItems: 'center',
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
  doctorInfoContainer: {
    flex: 1, // İçeriklerin sağa genişlemesini sağlar
  },
  doctorInfo: {
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
  deleteIcon: {
    marginLeft: 10,
  },
});

export default DoctorListScreen;
