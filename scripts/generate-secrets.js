#!/usr/bin/env node

/**
 * Generate Secure Secrets for Environment Variables
 * Run this script to generate strong JWT_SECRET values
 */

import crypto from 'crypto';

console.log('\n╔══════════════════════════════════════════════════════════╗');
console.log('║  🔐 Secure Secrets Generator                            ║');
console.log('║  Environment Website API                                 ║');
console.log('╚══════════════════════════════════════════════════════════╝\n');

// Generate JWT Secret (64 bytes = 512 bits)
const jwtSecret = crypto.randomBytes(64).toString('hex');

// Generate a strong password suggestion
const passwordChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
let strongPassword = '';
for (let i = 0; i < 24; i++) {
  strongPassword += passwordChars.charAt(Math.floor(Math.random() * passwordChars.length));
}

console.log('📋 Copy these to your .env file:\n');
console.log('─'.repeat(60));
console.log('\n# JWT Secret (for token signing)');
console.log('JWT_SECRET=' + jwtSecret);
console.log('\n# Admin Password (suggested strong password)');
console.log('ADMIN_PASSWORD=' + strongPassword);
console.log('\n' + '─'.repeat(60));

console.log('\n💡 Tips:');
console.log('  • Never commit these secrets to version control');
console.log('  • Use different secrets for development and production');
console.log('  • Store production secrets securely (e.g., environment variables in hosting platform)');
console.log('  • Rotate secrets periodically for better security\n');

console.log('✅ Secrets generated successfully!\n');

