import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleLogin = () => {
    // Tıklandığı an direkt Home ekranına geçiş yapar
    navigation.navigate('Home');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ImageBackground
          source={require('../assest/resim.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <SafeAreaView style={styles.safeArea}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
              >
                {/* Logo */}
                <View style={styles.logoContainer}>
                  <View style={styles.marvelBox}>
                    <Text style={styles.marvelText}>MOVIEHUB</Text>
                  </View>
                </View>

                {/* Form Alanı */}
                <View style={styles.formContainer}>
                  <Text style={styles.title}>Hoş Geldiniz</Text>
                  <Text style={styles.subtitle}>
                    Filmleri keşfetmek için giriş yapın
                  </Text>

                  {/* Kullanıcı Adı */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Kullanıcı Adı veya E-posta"
                      placeholderTextColor="#AAA"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                    />
                  </View>

                  {/* Şifre */}
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      placeholder="Şifre"
                      placeholderTextColor="#AAA"
                      secureTextEntry={secureText}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setSecureText(!secureText)}
                      style={styles.eyeButton}
                    >
                      <Text style={styles.eyeText}>
                        {secureText ? 'Göster' : 'Gizle'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Giriş Yap Butonu */}
                  <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.8}
                    onPress={handleLogin}
                  >
                    <Text style={styles.buttonText}>GİRİŞ YAP</Text>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.50)',
    paddingHorizontal: 20,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  logoContainer: {
    paddingTop: 10,
    alignItems: 'flex-start',
  },
  marvelBox: {
    backgroundColor: '#E50914',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  marvelText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: '#DDD',
    fontSize: 14,
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  inputContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.85)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    height: 50,
    fontSize: 15,
  },
  eyeButton: {
    padding: 6,
  },
  eyeText: {
    color: '#E50914',
    fontSize: 12,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#E50914',
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
});