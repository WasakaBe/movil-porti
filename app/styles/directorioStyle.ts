import { StyleSheet } from 'react-native'

const directorio_styles = StyleSheet.create({
  containerDirectorio: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    padding: 10,
    marginBottom: 20,
    width: 260,
  },
  imageSection: {
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: 180,
    objectFit: 'fill',
  },
  serviceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  infoSection: {
    padding: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  phoneNumber: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
})

export default directorio_styles