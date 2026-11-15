const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = "https://ktontqbfcinzqvalxyqd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b250cWJmY2luenF2YWx4eXFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NTE0MzUsImV4cCI6MjA5MzIyNzQzNX0.XZPB5rzKKyHQW6HrKsiwFJoPJnQDEhqOT5jzYKEhQp8";
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  // Let's test what happens when we try to insert into community_posts and polls
  const { data: post, error: postErr } = await supabase.from('community_posts').insert({
    title: 'Test',
    caption: 'Test',
    post_type: 'poll'
  }).select().single();
  console.log('Insert community_posts:', postErr ? postErr.message : 'OK', post?.id);

  if (post) {
    const { data: poll, error: pollErr } = await supabase.from('polls').insert({
      post_id: post.id,
      question: 'Test question?'
    }).select().single();
    console.log('Insert polls:', pollErr ? pollErr.message : 'OK', poll);

    // Clean up
    await supabase.from('community_posts').delete().eq('id', post.id);
  }
}

check();
