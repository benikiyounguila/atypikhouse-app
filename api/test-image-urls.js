const axios = require('axios');

const testImageUrls = async () => {
  try {
    console.log('=== Test des URLs d\'images ===');
    
    // Test upload-by-link
    console.log('\n1. Test upload-by-link...');
    const linkResponse = await axios.post('http://localhost:5000/api/upload-by-link', {
      link: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'
    });
    
    const imageUrl = linkResponse.data;
    console.log('✅ URL retournée:', imageUrl);
    
    // Test si l'URL est accessible
    console.log('\n2. Test d\'accessibilité de l\'URL...');
    try {
      const imageResponse = await axios.get(imageUrl, { 
        timeout: 5000,
        responseType: 'arraybuffer'
      });
      console.log('✅ Image accessible, taille:', imageResponse.data.length, 'bytes');
    } catch (imageError) {
      console.log('❌ Image non accessible:', imageError.message);
    }
    
    console.log('\n✅ Test terminé !');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
};

testImageUrls(); 