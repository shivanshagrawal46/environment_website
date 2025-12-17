#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if environment is properly configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║  🔍 Environment Setup Checker                           ║');
console.log('║  Environment Website API                                 ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

let allGood = true;

// Check if .env file exists
console.log('📄 Checking .env file...');
const envPath = path.join(rootDir, '.env');
if (fs.existsSync(envPath)) {
  console.log('  ✅ .env file exists');
  
  // Read and parse .env
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1].trim()] = match[2].trim();
    }
  });
  
  // Check required variables
  const required = [
    'MONGO_URI',
    'MONGO_DB_NAME',
    'ADMIN_USERNAME',
    'ADMIN_PASSWORD',
    'JWT_SECRET'
  ];
  
  console.log('\n🔑 Checking required environment variables...');
  required.forEach(varName => {
    if (envVars[varName] && envVars[varName] !== '' && !envVars[varName].includes('YOUR_')) {
      console.log(`  ✅ ${varName} is set`);
    } else {
      console.log(`  ❌ ${varName} is missing or using placeholder value`);
      allGood = false;
    }
  });
  
  // Security checks
  console.log('\n🔒 Security checks...');
  
  if (envVars['JWT_SECRET'] && envVars['JWT_SECRET'].length >= 32) {
    console.log('  ✅ JWT_SECRET is strong (>= 32 characters)');
  } else {
    console.log('  ⚠️  JWT_SECRET should be at least 32 characters long');
    allGood = false;
  }
  
  if (envVars['ADMIN_PASSWORD'] && envVars['ADMIN_PASSWORD'].length >= 12) {
    console.log('  ✅ ADMIN_PASSWORD is reasonably strong (>= 12 characters)');
  } else {
    console.log('  ⚠️  ADMIN_PASSWORD should be at least 12 characters long');
    allGood = false;
  }
  
  // MongoDB checks
  console.log('\n🗄️  MongoDB configuration...');
  if (envVars['MONGO_URI'] && envVars['MONGO_URI'].includes('mongodb')) {
    console.log('  ✅ MONGO_URI format looks correct');
  } else {
    console.log('  ❌ MONGO_URI format looks incorrect');
    allGood = false;
  }
  
  if (envVars['MONGO_DB_NAME'] === 'environment') {
    console.log('  ✅ MONGO_DB_NAME is set to "environment"');
  } else {
    console.log('  ℹ️  MONGO_DB_NAME is set to: ' + envVars['MONGO_DB_NAME']);
  }
  
} else {
  console.log('  ❌ .env file not found');
  console.log('  ℹ️  Copy .env.example to .env and fill in your values');
  allGood = false;
}

// Check node_modules
console.log('\n📦 Checking dependencies...');
const nodeModulesPath = path.join(rootDir, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('  ✅ node_modules folder exists');
  
  // Check for key packages
  const packages = ['express', 'mongoose', 'compression', 'express-rate-limit'];
  packages.forEach(pkg => {
    if (fs.existsSync(path.join(nodeModulesPath, pkg))) {
      console.log(`  ✅ ${pkg} is installed`);
    } else {
      console.log(`  ❌ ${pkg} is missing`);
      allGood = false;
    }
  });
} else {
  console.log('  ❌ node_modules not found');
  console.log('  ℹ️  Run: npm install');
  allGood = false;
}

// Summary
console.log('\n' + '═'.repeat(60));
if (allGood) {
  console.log('✅ All checks passed! Your environment is ready.');
  console.log('\n🚀 Start your server with: npm run dev:all');
} else {
  console.log('⚠️  Some issues found. Please fix them before starting the server.');
  console.log('\n📚 Check SETUP_GUIDE.md for detailed instructions.');
}
console.log('═'.repeat(60) + '\n');

