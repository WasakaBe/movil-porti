import React from 'react'
import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router' // ✅ Reemplazo de navigation
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import { ProgressBar } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'

const customColors = {
  blue: '#007bff',
  grey: '#6c757d',
  green: '#28a745',
}

export default function ConsultarSaldo() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined
  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={styles.background}
    >
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.username}>¡Hola!, Isai Alejandro</Text>

        {/* Plan Image */}
        <View style={styles.planContainer}>
          <Image
            source={require('../../assets/banners/LIKEPHONE/banner_likephone_1.png')}
            style={styles.bannerLike}
          />
        </View>

        {/* Expiration Info */}
        <View style={styles.expirationContainer}>
          <Text style={styles.expirationTitle}>Fecha que expira el plan</Text>
          <View style={styles.expirationDetails}>
            <View style={styles.expirationsubDetails}>
              <Text style={styles.date}>15</Text>
              <Text style={styles.month}>FEBRERO DEL 2025</Text>
            </View>
            <View style={styles.expirationsubDetails}>
              <Text style={styles.date}>7</Text>
              <Text style={styles.month}>DÍAS</Text>
            </View>
          </View>
        </View>

        {/* Usage Details */}
        <View style={styles.usageContainer}>
          <Text style={styles.usageTitle}>Detalle del consumo</Text>

          <Ionicons name="wifi" size={24} color="#000" />
          <Text style={styles.usageLabel}>Internet</Text>
          <ProgressBar
            progress={4.3 / 5.5}
            color={customColors.blue}
            style={styles.progressBar}
          />
          <Text style={styles.usageText}>4.3 GB / 5.5 GB</Text>

          <Ionicons name="chatbox" size={24} color="#000" />
          <Text style={styles.usageLabel}>SMS</Text>
          <ProgressBar
            progress={0.3 / 5.5}
            color={customColors.grey}
            style={styles.progressBar}
          />
          <Text style={styles.usageText}>0 / 1750 SMS</Text>

          <Ionicons name="phone-portrait-outline" size={24} color="#000" />
          <Text style={styles.usageLabel}>Llamadas</Text>
          <ProgressBar
            progress={2.3 / 5.5}
            color={customColors.green}
            style={styles.progressBar}
          />
          <Text style={styles.usageText}>36 llamadas, 45450 MIN</Text>
        </View>

        {/* Coverage Information */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Llamadas y SMS con Cobertura Nacional, Estados Unidos y Canadá
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  bannerLike: {
    width: 400,
    height: 200,
    objectFit: 'fill',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    marginTop: 16,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center',
  },
  planContainer: {
    alignItems: 'center',
    marginVertical: 16,
    backgroundColor: '#7f7ff183',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  expirationContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  expirationTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 24,
  },
  expirationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  expirationsubDetails: {
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  date: {
    fontSize: 30,
    color: 'blue',
    fontWeight: 'bold',
  },
  month: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  daysLeft: {
    fontSize: 22,
    color: 'blue',
    fontWeight: 'bold',
  },
  usageContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 3,
  },
  usageTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  usageLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  usageText: {
    fontSize: 14,
    textAlign: 'right',
    color: '#777',
  },
  footer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 3,
  },
  footerText: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 20,
  },
})
