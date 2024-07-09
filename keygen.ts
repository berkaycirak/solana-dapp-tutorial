import { Keypair } from '@solana/web3.js';

const kp = Keypair.generate();

console.log('My public key:', kp.publicKey.toBase58());
console.log('My secret key:', kp.secretKey);
