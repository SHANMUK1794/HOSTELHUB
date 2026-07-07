import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  database: 'hostelhub',
  user: 'postgres',
  password: 'WTPGjmda@09',
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    const versionResult = await client.query('SELECT version()');
    console.log('📦 PostgreSQL version:', versionResult.rows[0].version);

    const tablesResult = await client.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name"
    );

    console.log('\n📋 Tables in hostelhub database:');
    if (tablesResult.rows.length === 0) {
      console.log('  (no tables found)');
    } else {
      tablesResult.rows.forEach(row => console.log('  -', row.table_name));
    }
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed.');
  }
}

testConnection();
