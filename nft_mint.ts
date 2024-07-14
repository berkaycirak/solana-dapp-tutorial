// Final step is minting that nft

import {
	createSignerFromKeypair,
	generateSigner,
	percentAmount,
	signerIdentity,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

// Create the Collection NFT
// First create an nft and mint it as isCollection=true

(async () => {
	const uri =
		'https://arweave.net/xwQ3SAjbk3tGITyzi0mE_aUgKBGK_ASUcSkSLhNuTsY';

	const collectionMint = generateSigner(umi);
	await createNft(umi, {
		mint: collectionMint,
		authority: signer,
		name: 'My Collection NFT',
		uri: uri,
		sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
		isCollection: true,
	}).sendAndConfirm(umi);
})();
