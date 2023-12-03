// screens/DeletAppointmentsScreen.js
import React from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
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
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <Button title="Randevuyu Sil" onPress={handleDelete} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',  // Arka plan rengi
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',  // Metin rengi
  },
  date: {
    fontSize: 16,
    color: '#666',  // Tarih metni rengi
  },
});

export default DeletAppointmentsScreen;
