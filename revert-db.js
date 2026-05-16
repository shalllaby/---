const { Client } = require('pg');

async function main() {
    const client = new Client({ connectionString: 'postgres://postgres:XJvrN3F9WVwfPzecdmcEi6xFgEqQvtz2sBc8iP5bJxprpFm5wgPZ8jLZXGeyRjVz@187.127.86.138:5432/postgres' });
    await client.connect();
    
    // Revert the category image URL
    await client.query('UPDATE "Category" SET "imageUrl" = $1 WHERE slug = $2', ['/clutter.webp', 'deera-clutter']);
    console.log('Reverted category image to /clutter.webp');
    
    await client.end();
}
main().catch(console.error);
