import mongoose from 'mongoose';
import SEO from '../models/SEO';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/meraj-school';

async function migrateSEO() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all SEO documents
    const seoDocuments = await SEO.find();
    console.log(`Found ${seoDocuments.length} SEO documents`);

    for (const seo of seoDocuments) {
      console.log('Processing SEO document:', seo._id);
      
      // Get the document as a plain object
      const seoObj = seo.toObject() as any;
      console.log('Current document fields:', Object.keys(seoObj));
      
      // Check if document has old fields
      const hasOldFields = seoObj.siteName || seoObj.siteDescription;
      
      if (hasOldFields) {
        console.log('Document has old fields, migrating...');
        
        // Map old fields to new fields
        const updateData: any = {};
        
        if (seoObj.siteName && !seoObj.title) {
          updateData.title = seoObj.siteName;
          console.log('Mapping siteName to title:', seoObj.siteName);
        }
        
        if (seoObj.siteDescription && !seoObj.description) {
          updateData.description = seoObj.siteDescription;
          console.log('Mapping siteDescription to description');
        }
        
        // Add missing required fields if they don't exist
        if (!seoObj.schoolName) {
          updateData.schoolName = 'نام مدرسه';
          console.log('Adding schoolName');
        }
        
        if (!seoObj.address) {
          updateData.address = 'آدرس مدرسه';
          console.log('Adding address');
        }
        
        if (!seoObj.phone) {
          updateData.phone = 'شماره تماس';
          console.log('Adding phone');
        }
        
        if (!seoObj.email) {
          updateData.email = 'ایمیل';
          console.log('Adding email');
        }
        
        if (!seoObj.image) {
          updateData.image = '';
          console.log('Adding image');
        }
        
        if (!seoObj.socialMedia) {
          updateData.socialMedia = {
            instagram: '',
            twitter: ''
          };
          console.log('Adding socialMedia');
        }
        
        // Update the document
        const updatedSeo = await SEO.findByIdAndUpdate(seo._id, updateData, { new: true });
        if (updatedSeo) {
          console.log('Document migrated successfully');
          console.log('Updated fields:', Object.keys(updatedSeo.toObject()));
        } else {
          console.log('Failed to update document');
        }
      } else {
        console.log('Document already has new schema');
      }
    }
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateSEO();
}

export default migrateSEO;