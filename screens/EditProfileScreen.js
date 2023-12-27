import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../FirebasseConfig';
import { useNavigation } from '@react-navigation/native';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LottieView from 'lottie-react-native';
import { DotIndicator } from 'react-native-indicators';
import CustomAlert from '../CustomAlert';

const EditProfileScreen = ({ route }) => {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const [alertVisible, setAlertVisible] = useState(false);

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
      setIsLoading(true);

      await updateDoc(userRef, {
        username: username,
        phoneNumber: phoneNumber,
      });

      setIsLoading(false);
      setAlertVisible(true);

    
    } catch (error) {
      setIsLoading(false);
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

    if (!oldPassword || !newPassword) {
      Alert.alert('Hata', 'Eski ve yeni şifre alanları boş olamaz.');
      return;
    }

    // Kullanıcının eski şifresini doğrulama
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
    } catch (error) {
      console.error('Eski şifre doğrulaması başarısız:', error);
      Alert.alert('Hata', 'Eski şifre doğrulaması başarısız.');
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
  const handleAlertClose = () => {
    setAlertVisible(false);
    navigation.navigate('Appointment')  
    
  };
  return (
    <View style={styles.container}>
      {/* Bekleme göstergesi */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color='#4caf50' />
        </View>
      )}
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

    
<Text style={styles.label}>Şifre Ayarları</Text>

      <View style={styles.passwordContainer}>
          <TextInput
        style={styles.passwordInput}
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
        placeholder="Eski Şifre"
      />
        <TextInput
          style={styles.passwordInput}
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          placeholder="Yeni Şifre"
        />
        <TouchableOpacity style={styles.passwordIcon} onPress={handleChangePassword}>
        <Icon name="update" size={30} color="green" />
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
      <CustomAlert
        visible={alertVisible}
        message="Başarılı, Profil güncellendi"
        onClose={handleAlertClose}
      />
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
        color: 'green', // Metin rengi güncellendi

    textAlign:'center',
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
    marginTop:20,

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
    marginRight: 10,
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
  passwordIcon: {
    marginLeft: 10,
  },
  lottieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  lottieAnimation: {
    width: 300,
    height: 400,
  },
});

export default EditProfileScreen;
