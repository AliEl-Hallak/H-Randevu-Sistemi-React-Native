



// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View,Alert, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebasseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
const auth =FIREBASE_AUTH;
const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // Firebase ile giriş yapma işlemi
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      if (userCredential.user.uid === "xfkDERfdaMhMYZ8yqBI7iwNfb5V2") {
        const userEmail = userCredential.user.email;
        // Belirtilen UID'ye sahip kullanıcı için Admin ekranına yönlendir
        navigation.navigate('Admin', { email: userEmail });

      } else {
        const userEmail = userCredential.user.email;
        navigation.navigate('Appointment', { email: userEmail });

        // Diğer kullanıcılar için Randevu ekranına yönlendir
       
      }
    } catch (error) {
      // Hata durumunda kullanıcıya bildirim göster
      Alert.alert('Hata', 'Giriş başarısız: ' + error.message);
    }
    setEmail("");
    setPassword("");
  };











  return (
    <View style={styles.container}>
     
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text)=>setEmail(text)}
        placeholder="E-posta"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(text)=>setPassword(text)}
        placeholder="Şifre"
        secureTextEntry
      />
    <Button title="Giriş Yap" color="#4a90e2" onPress={handleLogin} />
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>Hesabınız yok mu? Kaydolun</Text>
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
export default LoginScreen;
