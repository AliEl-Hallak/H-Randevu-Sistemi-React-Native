import React, { useState, useEffect } from 'react';
import { View,Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';
import * as Notifications from 'expo-notifications';

const UpdateAppointmentScreen = ({ route, navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const appointmentId = route.params.appointmentId;

  useEffect(() => {
    const loadAppointmentData = async () => {
      const docRef = doc(FIRESTORE_DB, 'appointments', appointmentId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        setDate(docSnap.data().date);
      } else {
        Alert.alert("Randevu bulunamadı");
      }
    };

    loadAppointmentData();
  }, [appointmentId]);

  const handleUpdate = async () => {
    const appointmentRef = doc(FIRESTORE_DB, 'appointments', appointmentId);

    try {
      await updateDoc(appointmentRef, {
        title: title,
        date: date,
      });
      Alert.alert("Başarılı", "Randevu güncellendi", [
        { text: 'Tamam', onPress: () => navigation.navigate('ListoneAppointments') }
      ]);
      
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Randevunuz Güncellendi ✅",
          body: 'Randevu detaylarınız başarıyla güncellendi. Yeni randevu bilgilerinizi kontrol ediniz.',
        },
        trigger: { seconds: 1 }, // 1 saniye sonra gönder
      });

    } catch (error) {
      Alert.alert("Hata", "Randevu güncellenemedi: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Randevu Güncelleme</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Randevu Başlığı"
      />
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Randevu Tarihi (gg/aa/yyyy)"
      />
      <Button
        title="Randevuyu Güncelle"
        onPress={handleUpdate}
        color="#4a90e2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // Arka plan rengi
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9', // Giriş alanı arka plan rengi
  },
});

export default UpdateAppointmentScreen;
