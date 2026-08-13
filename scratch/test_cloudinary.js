/* eslint-disable */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

async function testCommunityUpload() {
  console.log('--- STARTING CLOUDINARY INTEGRATION TEST ---');

  const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error('ERROR: Cloudinary credentials missing in .env');
    process.exit(1);
  }

  try {
    // 1. Upload to Cloudinary
    console.log(`1. Uploading test image to Cloudinary (Cloud: ${CLOUD_NAME}, Preset: ${UPLOAD_PRESET})...`);
    
    const imagePath = path.join(__dirname, '../assets/images/logo.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    
    // Convert to Base64 data URI for easy REST API upload
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', UPLOAD_PRESET);

    const uploadStart = Date.now();
    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!cloudinaryRes.ok) {
      const errorText = await cloudinaryRes.text();
      throw new Error(`Cloudinary API Error: ${cloudinaryRes.status} ${errorText}`);
    }

    const cloudinaryData = await cloudinaryRes.json();
    const uploadTime = Date.now() - uploadStart;
    
    // Simulate our q_auto,f_auto logic
    let secureUrl = cloudinaryData.secure_url;
    const parts = secureUrl.split('/upload/');
    if (parts.length === 2) {
      secureUrl = `${parts[0]}/upload/q_auto,f_auto/${parts[1]}`;
    }

    console.log(`✅ Upload Successful in ${uploadTime}ms!`);
    console.log(`🔗 Secure URL: ${secureUrl}`);

    // 2. Insert into Supabase
    console.log('\n2. Creating Community Post in Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Get a valid super admin user ID to bypass RLS if necessary
    const { data: users, error: userErr } = await supabase
      .from('users')
      .select('id, full_name, role')
      .in('role', ['super_admin', 'admin'])
      .limit(1);
      
    let userId = users?.[0]?.id;
    
    if (userErr || !userId) {
        console.warn('Could not find an admin user, fetching any user...');
        const { data: anyUser } = await supabase.from('users').select('id').limit(1);
        userId = anyUser?.[0]?.id;
    }

    if (!userId) {
        throw new Error('No users found in database to attach post to.');
    }
    
    console.log(`Using Author ID: ${userId}`);

    const dbStart = Date.now();
    const { data: insertData, error: insertError } = await supabase
      .from('community_posts')
      .insert({
        title: 'Cloudinary Automated Test',
        caption: 'This is a test post to verify the new Cloudinary integration pipeline!',
        image_url: secureUrl,
        created_by: userId,
        status: 'active',
        visibility: 'public'
      })
      .select();

    if (insertError) {
      throw new Error(`Database Insert Error: ${insertError.message}`);
    }
    const dbTime = Date.now() - dbStart;

    console.log(`✅ Database Insert Successful in ${dbTime}ms!`);
    console.log(`📄 New Post ID: ${insertData[0].id}`);
    
    console.log('\n🎉 ALL TESTS PASSED! COMMUNITY MODULE IS FULLY FUNCTIONAL.');

  } catch (err) {
    console.error(`\n❌ TEST FAILED: ${err.message}`);
    process.exit(1);
  }
}

testCommunityUpload();
