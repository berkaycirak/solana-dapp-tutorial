// Determine the metadata of the uploaded NFT --> Step2

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';
import {
	createSignerFromKeypair,
	signerIdentity,
} from '@metaplex-foundation/umi';
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

const umi = createUmi(clusterApiUrl('devnet')).use(
	mplTokenMetadata()
);
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);

const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));

const uploader = createBundlrUploader(umi);

(async () => {
	const imageUrl =
		'https://arweave.net/pBnFc4-cNyrNOg1PIgu5EYyATRipQyHacpzxgI1zWIg';

	const metadata = {
		name: 'Thumper the Brave ',
		description:
			'Thumper wields a carrot-shaped sword with fierce determination. Despite his warrior spirit, his floppy ears and fluffy tail make him irresistibly adorable.',
		image: imageUrl,
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
