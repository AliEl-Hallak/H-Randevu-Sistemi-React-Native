import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebasseConfig';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updatePassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Eklemeyi unutmayın
import LottieView from 'lottie-react-native';

const EditProfileScreen = ({ route }) => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState('');

  // Burada uid değerinin varlığını ve geçerliliğini kontrol ediyoruz
  const uid = route.params?.uid;
  if (!uid) {
    Alert.alert('Hata', 'Kullanıcı tanımlayıcısı geçersiz.');
    return null; // Eğer uid geçersizse, bileşeni render etmeyi bırakıyoruz.
  }

  useEffect(() => {
    const loadUserData = async () => {
      const docRef = doc(FIRESTORE_DB, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUsername(docSnap.data().username || '');
        setPhoneNumber(docSnap.data().phoneNumber || '');
      } else {
        Alert.alert("Kullanıcı bulunamadı");
      }
    };

    loadUserData();
  }, [uid]);

  const handleSaveChanges = async () => {
    const userRef = doc(FIRESTORE_DB, 'users', uid);
    try {
      await updateDoc(userRef, {
        username: username,
        phoneNumber: phoneNumber,
      });
      Alert.alert("Başarılı", "Profil güncellendi", [
        { text: 'Tamam', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert("Hata", "Profil güncellenemedi: " + error.message);
    }
  };

  const handleChangePassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('Kullanıcı oturum açmamış');
      return;
    }

    if (!newPassword) {
      Alert.alert('Hata', 'Yeni şifre boş olamaz.');
      return;
    }

    try {
      await updatePassword(user, newPassword);
      console.log('Şifre başarıyla güncellendi');
      Alert.alert('Başarılı', 'Şifre başarıyla güncellendi');
    } catch (error) {
      console.error('Şifre güncellenirken bir hata oluştu:', error);
      Alert.alert('Hata', 'Şifre güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Kullanıcı Adı</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı adınızı girin"
      />

      <Text style={styles.label}>Telefon Numarası</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Telefon numaranızı girin"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Yeni Şifre"
        />
        <TouchableOpacity style={styles.passwordIcon} onPress={handleChangePassword}>
          <Icon name="vpn-key" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Değişiklikleri Kaydet</Text>
      </TouchableOpacity>
      <View style={styles.lottieContainer}>
          <LottieView
            source={require('../resim/r8.json')} // Make sure this path is correct
            autoPlay
            loop={true}
            style={styles.lottieAnimation}
          />
        </View>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  passwordIcon: {
    marginLeft: 10,
  },
  lottieContainer: {
    alignItems: 'center', // Center the LottieView horizontally
    justifyContent: 'center', // Center the LottieView vertically
    marginTop: 0, // Add some space above the LottieView
  },
  lottieAnimation: {
    width: 300, // Adjust width as needed
    height: 350, // Adjust height as needed
  },
});

export default EditProfileScreen;
