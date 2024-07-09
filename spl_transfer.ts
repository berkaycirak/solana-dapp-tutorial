// Transfer Tokens between addresses --> Step 4
import {
	clusterApiUrl,
	Connection,
	Keypair,
	PublicKey,
} from '@solana/web3.js';
import wallet from './wallet.json';
import {
	getOrCreateAssociatedTokenAccount,
	transfer,
} from '@solana/spl-token';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const connection = new Connection(
	clusterApiUrl('devnet'),
	'confirmed'
);

// That is required for to know which token we will transfer
const mint = new PublicKey(
	'BLZZjhv3vPJCktBtZ6yxHXm5zvXBCQj489aPdgAJz4xj'
);

const to = new PublicKey(
	'DCxAqfLFnN9uc5Ysix9Si5aT4rqNPHE677keYsUinnvk'
);

(async () => {
	const fromATA = await getOrCreateAssociatedTokenAccount(
		connection,
		keypair,
		mint,
		keypair.publicKey
	);

	const toATA = await getOrCreateAssociatedTokenAccount(
		connection,
		keypair,
		mint,
		to
	);

	const tx = await transfer(
		connection,
		keypair,
		fromATA.address,
		toATA.address,
		keypair.publicKey,
		10000000
	);

	console.log(tx);
})();
