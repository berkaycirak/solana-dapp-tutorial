// Amount of token is minted to ATA in that step --> Step 3
import {
	clusterApiUrl,
	Connection,
	Keypair,
	PublicKey,
} from '@solana/web3.js';
import wallet from './wallet.json';
import {
	getOrCreateAssociatedTokenAccount,
	mintTo,
} from '@solana/spl-token';

(async () => {
	const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
	const connection = new Connection(
		clusterApiUrl('devnet'),
		'confirmed'
	);

	const token_decimals = 1_000_000;

	const mint = new PublicKey(
		'47uoc4b1K3jCizkzWoKyggcjhVsVzb493UApFUWmMPMC'
	);

	const ATA = await getOrCreateAssociatedTokenAccount(
		connection,
		keypair,
		mint,
		keypair.publicKey
	);

	// Determine how many tokens you will supply
	const mintTx = await mintTo(
		connection,
		keypair,
		mint,
		ATA.address,
		keypair.publicKey,
		5000 * token_decimals
	);
	console.log(mintTx);
})();
