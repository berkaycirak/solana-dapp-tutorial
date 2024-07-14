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
import { nft_init } from './nft_image';
import { nft_metadata } from './nft_metadata';
import bs58 from 'bs58';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

// Create the Collection NFT
// First create an nft and mint it as isCollection=true

export const mint_nft = async ({
	collection_name,
	uri,
}: {
	collection_name: string;
	uri: string;
}) => {
	try {
		const collectionMint = generateSigner(umi);
		const createNftTx = await createNft(umi, {
			mint: collectionMint,
			authority: signer,
			name: collection_name,
			uri: uri,
			sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
			isCollection: true,
		}).sendAndConfirm(umi);

		console.log(
			'NFT_CREATED TX------------>',
			bs58.encode(createNftTx.signature)
		);
	} catch (error) {
		console.log(error);
	}
};
