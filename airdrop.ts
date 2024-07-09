import {
	clusterApiUrl,
	Connection,
	Keypair,
	LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import wallet from './wallet.json';

const getAirdrop = async () => {
	// to get public key from secret key
	const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

	// without connection, we can't interact with clusters.
	const connection = new Connection(
		clusterApiUrl('devnet'),
		'confirmed'
	);
	// making rpc request to the related cluster's method.
	const txhash = await connection.requestAirdrop(
		keypair.publicKey,
		1 * LAMPORTS_PER_SOL
	);
	console.log(txhash);
};

getAirdrop();
