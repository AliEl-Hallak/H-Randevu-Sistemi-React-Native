import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, StyleSheet, Alert, Platform } from 'react-native';
import { FIRESTORE_DB } from '../FirebasseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateAppointmentScreen = () => {
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleCreateAppointment = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userEmail = user.email;
      const userId = user.uid;

      // Randevu tarihini ISO string formatına çevir
      const dateString = appointmentDate.toISOString();

      await addDoc(collection(FIRESTORE_DB, 'appointments'), {
        title: appointmentTitle,
        date: dateString, // String formatında tarih
        userId: userId,
        userEmail: userEmail,
      });

      Alert.alert('Başarılı', 'Randevu oluşturuldu');
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Randevunuz Oluşturuldu 📅",
          body: 'Yeni randevunuz başarıyla oluşturuldu. Randevu detaylarınızı kontrol ediniz.',
        },
        trigger: { seconds: 1 },
      });
    } catch (error) {
      Alert.alert('Hata', 'Randevu oluşturulamadı');
    }
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || appointmentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setAppointmentDate(currentDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yeni Randevu Oluştur</Text>
      <TextInput
        style={styles.input}
        value={appointmentTitle}
        onChangeText={setAppointmentTitle}
        placeholder="Randevu Başlığı"
      />
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDatePicker(true)}
      >
        <Text style={styles.dateText}>
          {formatDate(appointmentDate)}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={appointmentDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}
      <Button
        title="Randevu Oluştur"
        onPress={handleCreateAppointment}
        color="#4a90e2"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  dateInput: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
});

export default CreateAppointmentScreen;
