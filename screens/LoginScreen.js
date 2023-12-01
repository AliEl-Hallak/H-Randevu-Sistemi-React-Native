



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

  const singin =async()=>{
    try{
      const response = await signInWithEmailAndPassword(auth,email,password);
  
      Alert.alert(
        'giris İşlemi',
        'giris işlemi gerçekleştirildi',
        [
          {
            text: 'Tamam',
            onPress: () => console.log('OK Pressed'),
          },
        ],
        { cancelable: false }
      );
  
    }
    catch (error) {
    
      // Display an error alert
      Alert.alert(
        'Hata',
        'giris işlemi gerçekleştirilemedi',
        [{ text: 'Tamam' }]
      );
    }


   }











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
    <Button title="Giriş Yap" color="#4a90e2" onPress={singin} />
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
