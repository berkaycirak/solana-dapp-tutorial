// Determine the metadata of the uploaded NFT --> Step2

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';
import {
	createSignerFromKeypair,
	signerIdentity,
} from '@metaplex-foundation/umi';
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';

const umi = createUmi(clusterApiUrl('devnet'));
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

const uploader = createBundlrUploader(umi);

(async () => {
	const imageUrl =
		'https://arweave.net/KDwZW2G6uaDsmv9mTtjgYxzT3YM7KiRU3mRILNgA9ag';

	const metadata = {
		name: 'Captain Carpet',
		symbol: 'CC',
		description: 'That carpet belongs to captain',
		image: imageUrl,
		attributes: [
			{
				trait_type: 'color',
				value: 'black',
			},
			{
				trait_type: 'rarity',
				value: 'epic',
			},
		],
		properties: {
			files: [
				{
					type: 'image/png',
					uri: imageUrl,
				},
			],
		},
	};

	const myNewUrl = await uploader.uploadJson(metadata);
	console.log(myNewUrl);
})();
