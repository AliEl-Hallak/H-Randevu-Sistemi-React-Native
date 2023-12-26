import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebasseConfig';
import LottieView from 'lottie-react-native';
import { DotIndicator } from 'react-native-indicators';

const DoctorAdd = ({ navigation }) => {
  const [department, setDepartment] = useState('');
  const [clinic, setClinic] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [error, setError] = useState({ department: '', clinic: '', doctorName: '', workingHours: '', selectedDays: '' });
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    let isValid = true;
    setError({ department: '', clinic: '', doctorName: '', workingHours: '', selectedDays: '' });

    if (!department.trim()) {
      setError((prevState) => ({ ...prevState, department: 'Anabilim Dalını doldurunuz.' }));
      isValid = false;
    }

    if (!clinic.trim()) {
      setError((prevState) => ({ ...prevState, clinic: 'Polikliniği doldurunuz.' }));
      isValid = false;
    }

    if (!doctorName.trim()) {
      setError((prevState) => ({ ...prevState, doctorName: 'Doktor Adını doldurunuz.' }));
      isValid = false;
    }

    if (selectedDays.length === 0) {
      setError((prevState) => ({ ...prevState, selectedDays: 'Çalışma günlerini seçiniz.' }));
      isValid = false;
    }

    if (workingHours.length === 0) {
      setError((prevState) => ({ ...prevState, workingHours: 'Çalışma saatlerini seçiniz.' }));
      isValid = false;
    }

    return isValid;
  };

  const toggleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const toggleWorkingHourSelection = (hour) => {
    if (workingHours.includes(hour)) {
      setWorkingHours(workingHours.filter((selectedHour) => selectedHour !== hour));
    } else {
      setWorkingHours([...workingHours, hour]);
    }
  };

  const daysOfWeek = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const hoursOfDay = ['09:00','10:00','11:00', '12:00', '13:00','14:00', '15:00','16:00','17:00'];

  const handleAddDoctor = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      await addDoc(collection(FIRESTORE_DB, 'doctors'), {
        department,
        clinic,
        name: doctorName,
        workingDays: selectedDays,
        workingHours,
      });

      setIsLoading(false);

      Alert.alert('Başarılı', 'Doktor bilgileri eklendi', [
        { text: 'Tamam', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setIsLoading(false);
      setError('Doktor bilgileri eklenemedi');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={error.department ? styles.inputError : styles.input}
        value={department}
        onChangeText={(text) => {
          setDepartment(text);
          validateForm();
        }}
        placeholder="Anabilim Dalı"
      />
      {error.department ? <Text style={styles.errorText}>{error.department}</Text> : null}

      <TextInput
        style={error.clinic ? styles.inputError : styles.input}
        value={clinic}
        onChangeText={(text) => {
          setClinic(text);
          validateForm();
        }}
        placeholder="Poliklinik"
      />
      {error.clinic ? <Text style={styles.errorText}>{error.clinic}</Text> : null}

      <TextInput
        style={error.doctorName ? styles.inputError : styles.input}
        value={doctorName}
        onChangeText={(text) => {
          setDoctorName(text);
          validateForm();
        }}
        placeholder="Doktor Adı"
      />
      {error.doctorName ? <Text style={styles.errorText}>{error.doctorName}</Text> : null}

      <View style={styles.daysContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.selectedDayButton,
            ]}
            onPress={() => toggleDaySelection(day)}
          >
            <Text style={selectedDays.includes(day) ? styles.selectedDayText : styles.dayText}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error.selectedDays ? <Text style={styles.errorText}>{error.selectedDays}</Text> : null}

      <View style={styles.hoursContainer}>
        {hoursOfDay.map((hour) => (
          <TouchableOpacity
            key={hour}
            style={[
              styles.hourButton,
              workingHours.includes(hour) && styles.selectedHourButton,
            ]}
            onPress={() => toggleWorkingHourSelection(hour)}
          >
            <Text style={workingHours.includes(hour) ? styles.selectedHourText : styles.hourText}>
              {hour}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {error.workingHours ? <Text style={styles.errorText}>{error.workingHours}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={handleAddDoctor}>
        <Text style={styles.saveButtonText}>Ekle</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <DotIndicator color="#4caf50" />
        </View>
      )}

      <View style={styles.lottieContainer}>
        <LottieView
          source={require('../resim/r10.json')}
          autoPlay
          loop={true}
          style={styles.lottieAnimation}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  saveButton: {
    marginTop: 10,
    width: '100%',
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
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
  inputError: {
    width: '100%',
    marginVertical: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
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
  lottieContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieAnimation: {
    width: 300,
    height: 200,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  dayButton: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selectedDayButton: {
    backgroundColor: '#4caf50',
  },
  dayText: {
    color: '#333',
  },
  selectedDayText: {
    color: 'white',
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  hourButton: {
    margin: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selectedHourButton: {
    backgroundColor: '#4caf50',
  },
  hourText: {
    color: '#333',
  },
  selectedHourText: {
    color: 'white',
  },
});

export default DoctorAdd;
