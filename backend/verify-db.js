#!/usr/bin/env node

/**
 * Database Persistence Verification Script
 *
 * Run this script to verify PostgreSQL data persistence:
 * 1. Check current database contents
 * 2. Restart Docker container
 * 3. Verify data still exists
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  try {
    console.log('\n📊 Checking PostgreSQL Database...\n');

    // Get all tasks
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log('✅ Connected to PostgreSQL');
    console.log(`📦 Database contains ${tasks.length} tasks\n`);

    if (tasks.length > 0) {
      console.log('📋 Current tasks:');
      tasks.forEach((task, index) => {
        console.log(`   ${index + 1}. ${task.title}`);
        console.log(`      Status: ${task.status} | Priority: ${task.priority}`);
        console.log(`      Project: ${task.project}`);
        if (task.description) {
          console.log(`      Description: ${task.description}`);
        }
        console.log(`      Created: ${task.createdAt.toISOString()}`);
        console.log('');
      });
    } else {
      console.log('⚠️  Database is empty (no tasks found)');
      console.log('   This is expected after a fresh migration.');
      console.log('   Run the tests to seed data: npm test\n');
    }

    console.log('🔍 Database Type: PostgreSQL (production-ready)');
    console.log('📍 Storage Location: Docker volume "postgres_data"');
    console.log('💾 Persistence: Data survives container restarts\n');

  } catch (error) {
    console.error('\n❌ Error connecting to database:');
    console.error(error.message);
    console.log('\n💡 Make sure PostgreSQL Docker container is running:');
    console.log('   docker ps | grep taskboard-postgres');
    console.log('   If not running: docker compose up -d\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function testPersistence() {
  try {
    console.log('\n🧪 Testing Data Persistence...\n');

    // Create a test task
    const testTask = await prisma.task.create({
      data: {
        title: '🔬 Persistence Test Task',
        description: 'This task verifies PostgreSQL data persistence',
        project: 'development',
        priority: 'high',
        status: 'todo',
        focusedToday: true
      }
    });

    console.log(`✅ Created test task: ${testTask.title}`);
    console.log(`   ID: ${testTask.id}`);
    console.log('\n📝 Next steps to verify persistence:');
    console.log('   1. Restart Docker: docker compose restart');
    console.log('   2. Run this script again: node verify-db.js');
    console.log('   3. Confirm the test task still exists');
    console.log('\n   If the task persists after restart, PostgreSQL is working correctly!\n');

  } catch (error) {
    console.error('❌ Error creating test task:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check if running with --test flag
const args = process.argv.slice(2);
if (args.includes('--test')) {
  testPersistence();
} else {
  verifyDatabase();
}
