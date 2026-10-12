const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf-8');
const getEnv = (key) => env.split('\n').find(l => l.startsWith(key + '='))?.split('=')[1]?.trim();

const url = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const key = getEnv('SUPABASE_SERVICE_ROLE_KEY') || getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const supabase = createClient(url, key);

async function updateSupabaseThumbnails() {
  console.log('='.repeat(65));
  console.log('UPDATING SUPABASE EXPERIMENTS TABLE WITH AVIF EXPERIMENT IMAGES');
  console.log('='.repeat(65));

  const customJson = JSON.parse(fs.readFileSync('src/data/experiments_custom.json', 'utf-8'));
  console.log(`Loaded ${customJson.length} experiments from experiments_custom.json`);

  let updatedCount = 0;
  for (const exp of customJson) {
    const heroImg = `/images/experiments/${exp.slug}.avif`;
    const cardImg = `/images/experiments/${exp.slug}.card.avif`;

    // Try updating by slug first, then by id
    const { error: errSlug } = await supabase
      .from('experiments')
      .update({
        thumbnail_url: cardImg,
      })
      .eq('slug', exp.slug);

    if (!errSlug) {
      updatedCount++;
      console.log(`✓ Updated [${exp.slug}] -> ${cardImg}`);
    } else {
      console.log(`! Failed slug [${exp.slug}]:`, errSlug.message);
      // Try by id
      const { error: errId } = await supabase
        .from('experiments')
        .update({
          thumbnail_url: cardImg,
        })
        .eq('id', exp.id);
      if (!errId) {
        updatedCount++;
        console.log(`✓ Updated by ID [${exp.id}] -> ${cardImg}`);
      } else {
        console.error(`X Failed ID [${exp.id}]:`, errId.message);
      }
    }
  }

  console.log('='.repeat(65));
  console.log(`Successfully updated ${updatedCount} rows in Supabase!`);
  console.log('='.repeat(65));
}

updateSupabaseThumbnails().catch(console.error);
