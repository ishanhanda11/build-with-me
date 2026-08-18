// src/db/db.js
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Create the connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pass the adapter into PrismaClient
const prisma = new PrismaClient({ adapter });

module.exports = prisma;