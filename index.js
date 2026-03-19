const fetch = require('node-fetch');

const GROUPME_BOT_ID = 'c64f2794b52f1f1859517fdfd5';
const URL = 'https://live.adashi.com/bcfd/';

const seen = new Set();

async function sendToGroupMe(text) {
  try {
    const res = await fetch('https://api.groupme.com/v3/bots/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bot_id: GROUPME_BOT_ID,
        text
      })
    });
    console.log('GroupMe status:', res.status);
  } catch (err) {
    console.error('GroupMe send error:', err.message);
  }
}

async function checkAdashi() {
  try {
    console.log('Checking Adashi...');
    const res = await fetch(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    console.log('Adashi HTTP status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    console.log('HTML preview:', html.slice(0, 500).replace(/\s+/g, ' '));

    const rows = html.match(/<tr[\s\S]*?<\/tr>/gi);
    console.log('Matched rows:', rows ? rows.length : 0);

    if (!rows || !rows.length) return;

    for (const row of rows) {
      const idMatch = row.match(/F\d+/);
      if (!idMatch) continue;

      const id = idMatch[0];
      if (seen.has(id)) continue;
      seen.add(id);

      const clean = row.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      console.log('New incident found:', id);

      await sendToGroupMe(`🚒 NEW INCIDENT\n${clean}`);
    }
  } catch (err) {
    console.error('Check error:', err.message);
  }
}

console.log('Watcher running...');
checkAdashi();
setInterval(checkAdashi, 3000);
