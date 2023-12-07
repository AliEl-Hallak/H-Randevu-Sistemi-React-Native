// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View, Alert, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebasseConfig';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { doc, setDoc } from '@firebase/firestore';

const auth = FIREBASE_AUTH;

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const signUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'a kullanıcı adı ve telefon numarası ekle
      const userRef = doc(FIRESTORE_DB, 'users', user.uid);
      await setDoc(userRef, {
        username: username,
        phoneNumber: phoneNumber,
      });

      Alert.alert(
        'Kayıt İşlemi',
        'Kayıt işlemi başarıyla gerçekleştirildi',
        [
          { text: 'Tamam', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Hata', 'Kayıt başarısız: ' + error.message);
    }

    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setUsername("");
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı Adı"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="E-posta"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Şifre"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        placeholder="Telefon Numarası"
        keyboardType="phone-pad" // Klavyeyi telefon klavyesi olarak ayarla
      />
      <Button title="Kaydol" color="#4a90e2" onPress={signUp} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.linkText}>Zaten bir hesabınız var mı? Giriş Yap</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    input: {
      height: 50,
      borderColor: '#e1e1e1',
      borderWidth: 1,
      marginBottom: 15,
      paddingHorizontal: 10,
      borderRadius: 5,
      backgroundColor: '#fff',
    },
    linkText: {
      color: '#4a90e2',
      marginTop: 15,
      textAlign: 'center',
    },
  });
export default RegistrationScreen;
