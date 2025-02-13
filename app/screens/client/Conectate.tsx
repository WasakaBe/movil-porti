import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native'
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Feather,
  MaterialCommunityIcons,
} from '@expo/vector-icons' // Importar íconos
import { useLocalSearchParams, useRouter } from 'expo-router' // ✅ Reemplazo de `navigation`
import { LinearGradient } from 'expo-linear-gradient'
import noticias_styles from '@/app/styles/noticiasStyle'
import getBackgroundByIdPartido from '@/app/constants/fondoPartidos'
import dashboard_styles from '@/app/styles/dashboardStyle'
import { API_URL } from '@env'
import LoadingSpinner from '@/app/components/loadingSpinner'

interface Post {
  id_contenido: number
  autor: string
  descripcion: string
  fecha_publicacion: string
  foto_perfil: string
  nombre_partido: string
  ruta_imagen: string
}

export default function Conectate() {
  const router = useRouter() // ✅ Reemplazo de `navigation`
  const params = useLocalSearchParams()
  const idUsuario = params.idUsuario ? Number(params.idUsuario) : undefined
  const idPartido = params.idPartido ? Number(params.idPartido) : undefined

  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const postsPerPage = 10 // Publicaciones por página

  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showFullCaption, setShowFullCaption] = useState(false)

  useEffect(() => {
    if (idPartido) {
      fetchPosts()
    }
  }, [idPartido, currentPage])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `${API_URL}api/post/${idPartido}?page=${currentPage}&limit=${postsPerPage}`
      )
      const data = await response.json()
      console.log('conectate', data)
      if (data && data.posts && Array.isArray(data.posts)) {
        setPosts(data.posts)
        // Evita que totalPages sea NaN
        setTotalPages(
          data.totalPages && !isNaN(data.totalPages)
            ? data.totalPages
            : data.total && !isNaN(data.total)
            ? Math.ceil(data.total / postsPerPage)
            : 1
        )
      } else {
        console.warn('La API no devolvió posts válidos.')
      }
    } catch (error) {
      console.error('Error al obtener publicaciones:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={getBackgroundByIdPartido(Number(idPartido))}
      style={dashboard_styles.background}
    >
      <View style={noticias_styles.subcontainer}>
        {/* Botón de regresar */}
        <TouchableOpacity
          style={noticias_styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={18} color="#FFFFFF" />
          <Text style={noticias_styles.backText}>Regresar</Text>
        </TouchableOpacity>

        <Text style={noticias_styles.tituloNoticia}>Conectate</Text>

        {/* Logo del Partido */}
        <Image
          source={require('../../assets/logo_partidos/unidosPt.png')}
          style={noticias_styles.logo}
        />
      </View>
      {loading ? (
        <LoadingSpinner text="Cargando POST..." color="#FFD700" />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id_contenido.toString()}
          renderItem={({ item }) => (
            <View style={styles.container}>
              {/* Header */}
              <View style={styles.header}>
                <View style={styles.userInfo}>
                  <LinearGradient
                    colors={['#FF6B6B', '#FF8E53', '#FF2F68']}
                    style={styles.avatarBorder}
                  >
                    <Image
                      source={{ uri: item.foto_perfil }}
                      style={styles.avatar}
                    />
                  </LinearGradient>
                  <View style={styles.userTextContainer}>
                    <Text style={styles.username}>{item.autor}</Text>
                    <Text style={styles.location}>
                      {new Date(item.fecha_publicacion).toLocaleDateString(
                        'es-MX',
                        {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Feather name="more-horizontal" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              {/* Image */}
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.ruta_imagen }}
                  style={styles.image}
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0.3)', 'transparent']}
                  style={styles.imageOverlay}
                />
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <View style={styles.leftActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setIsLiked(!isLiked)}
                  >
                    <MaterialCommunityIcons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={28}
                      color={isLiked ? '#FF4757' : '#333'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="message-circle" size={26} color="#333" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="send" size={26} color="#333" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setIsSaved(!isSaved)}
                >
                  <FontAwesome
                    name={isSaved ? 'bookmark' : 'bookmark-o'}
                    size={26}
                    color="#333"
                  />
                </TouchableOpacity>
              </View>

              {/* Caption */}
              <View style={styles.captionContainer}></View>
            </View>
          )}
          onEndReached={() => setCurrentPage(currentPage + 1)}
          onEndReachedThreshold={0.5}
        />
      )}

      {/* Botones de paginación */}
      <View style={styles.pagination}>
        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === 1 && styles.disabledButton,
          ]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageText}>Anterior</Text>
        </TouchableOpacity>

        <Text style={styles.pageIndicator}>
          Página {currentPage} de {totalPages || 1}
        </Text>

        <TouchableOpacity
          style={[
            styles.pageButton,
            currentPage === totalPages && styles.disabledButton,
          ]}
          onPress={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <Text style={styles.pageText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  userTextContainer: {
    marginLeft: 10,
  },
  username: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  imageContainer: {
    width: '100%',
    height: Dimensions.get('window').width * 0.65,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
    padding: 4,
  },
  likesContainer: {
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  likes: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  captionContainer: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  more: {
    color: '#666',
  },
  commentsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  comments: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
    textTransform: 'uppercase',
  },

  //paginator
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageButton: {
    backgroundColor: '#FF4757',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  pageText: {
    color: 'white',
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
})
