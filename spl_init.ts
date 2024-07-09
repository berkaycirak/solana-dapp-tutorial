// Token Account for storing token's main data --> Step 1

import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import wallet from './wallet.json';
import { createMint } from '@solana/spl-token';

(async () => {
	const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
	const connection = new Connection(
		clusterApiUrl('devnet'),
		'confirmed'
	);

	const mint = await createMint(
		connection,
		keypair,
		keypair.publicKey,
		null,
		6
	);

	console.log('Token Account is:', mint); //BLZZjhv3vPJCktBtZ6yxHXm5zvXBCQj489aPdgAJz4xj
})();
