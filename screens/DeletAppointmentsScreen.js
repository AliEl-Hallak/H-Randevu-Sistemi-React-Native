import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, deleteDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';

const DeletAppointmentsScreen = ({ route, navigation }) => {
  const { appointmentId, title, date } = route.params;

  const handleDelete = async () => {
    Alert.alert(
      'Randevuyu Sil',
      'Bu randevuyu silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              await deleteDoc(doc(FIRESTORE_DB, 'appointments', appointmentId));
              Alert.alert('Başarılı', 'Randevu silindi', [
                { text: 'Tamam', onPress: () => navigation.navigate('ListoneAppointments') }
              ]);
            } catch (error) {
              Alert.alert('Hata', 'Randevu silinirken bir hata oluştu: ' + error.message);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.appointmentCard}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{date}</Text>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={handleDelete}>
          <Icon name="delete" size={24} color="white" />
          <Text style={styles.deleteButtonText}>Randevuyu Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  appointmentCard: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  deleteButtonText: {
    marginLeft: 10,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DeletAppointmentsScreen;
