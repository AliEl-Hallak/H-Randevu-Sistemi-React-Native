import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebasseConfig';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = ({ route }) => {
  const { uid, username: initialUsername, phoneNumber: initialPhoneNumber, email: initialEmail } = route.params;

  const [username, setUsername] = useState(initialUsername);
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);

  const navigation = useNavigation();

  const handleSaveChanges = async () => {
    try {
      // Firestore'daki kullanıcı belgesini güncelle
      await FIRESTORE_DB.collection('users').doc(uid).update({
        username,
        phoneNumber,
      });

      // Başarı mesajı göster
      Alert.alert('Başarı', 'Değişiklikler kaydedildi');

      // Kullanıcıyı profil ekranına geri gönder
      navigation.navigate('UserProfileScreen', {
        username,
        email: initialEmail,
        phoneNumber,
      });
    } catch (error) {
      // Hata durumunda kullanıcıya bildirim göster
      Alert.alert('Hata', 'Değişiklikler kaydedilemedi: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      <Text style={styles.label}>Telefon Numarası</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
