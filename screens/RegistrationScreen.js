// screens/RegistrationScreen.js
import React, { useState } from 'react';
import { View,Alert, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../FirebasseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth';
const auth =FIREBASE_AUTH;
const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');








 const singUp =async()=>{
  try{
    const response = await createUserWithEmailAndPassword(auth,email,password);

    Alert.alert(
      'Kayıt İşlemi',
      'Kayıt işlemi gerçekleştirildi',
      [
        {
          text: 'Tamam',
          onPress: () => console.log('OK Pressed'),
        },
      ],
      { cancelable: false }
    );
    navigation.navigate('Login');


  }
  catch (error) {
    // Hata durumunda kullanıcıya bildirim göster
    Alert.alert('Hata', 'Giriş başarısız: ' + error.message);
  }
 }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Kullanıcı adı"
      />
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
      <Button title="Kaydol" color="#4a90e2" onPress={singUp} />
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
