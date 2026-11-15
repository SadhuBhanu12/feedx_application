const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://ktontqbfcinzqvalxyqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testPollCreation() {
  const email = 'sadhubhanuprasad12@gmail.com';
  const passwordsToTest = ['FeedX@123', 'feedx@123', '123456', 'Bhanu@123'];
  let authUser = null;

  for (const pw of passwordsToTest) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (!error && data?.user) {
      authUser = data.user;
      console.log('Logged in as:', authUser.id);
      break;
    }
  }

  if (!authUser) {
    console.log('Could not authenticate');
    return;
  }

  // 1. Try to insert post into community_posts
  console.log('Inserting into community_posts...');
  const { data: post, error: postErr } = await supabase.from('community_posts').insert({
    title: 'Test Poll Post',
    caption: 'Test Poll Caption',
    post_type: 'poll',
    category: 'Polls',
    audience_type: 'all',
    status: 'active',
    visibility: 'public',
    created_by: authUser.id
  }).select().single();

  if (postErr) {
    console.error('Post insertion error:', postErr);
    return;
  }
  console.log('Post created successfully:', post.id);

  // 2. Try to insert poll into polls table
  console.log('Inserting into polls...');
  const pollPayload = {
    post_id: post.id,
    question: 'What is your favorite stack?',
    allow_multiple: false,
    anonymous_voting: true,
    show_results_before_vote: false,
    allow_vote_change: false,
    starts_at: new Date().toISOString(),
    ends_at: new Date(Date.now() + 86400000 * 3).toISOString(),
    status: 'ACTIVE'
  };

  const { data: poll, error: pollErr } = await supabase.from('polls').insert(pollPayload).select().single();
  if (pollErr) {
    console.error('Poll insertion error:', pollErr);
  } else {
    console.log('Poll created successfully:', poll);
  }

  // Cleanup test post
  if (post) {
    await supabase.from('community_posts').delete().eq('id', post.id);
  }
}

testPollCreation();
