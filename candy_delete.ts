import {
	deleteCandyGuard,
	deleteCandyMachine,
	mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import bs58 from 'bs58';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());

(async () => {
	// candyMachine mint address
	const deleteTx = await deleteCandyMachine(umi, {
		candyMachine: publicKey(
			'5uQGzXpzkw8FnRVt9FJLbwsC3CYWTEwbtZP9Cv7n4fag'
		),
	}).sendAndConfirm(umi);
	// candy machine mint authority address
	await deleteCandyGuard(umi, {
		candyGuard: publicKey(
			'5qP72nQ8j2xiFvLmUL1We9K8kx5CX4J3XHNVFAzHX6Ae'
		),
	}).sendAndConfirm(umi);

	console.log('CANDY TX---------->', bs58.encode(deleteTx.signature));
})();
