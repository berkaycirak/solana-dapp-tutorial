// First upload an NFT image to the IPFS (Initialization) --> Step1

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';
import {
	createGenericFile,
	createSignerFromKeypair,
	signerIdentity,
} from '@metaplex-foundation/umi';

import { readFile } from 'fs/promises';
import { createBundlrUploader } from '@metaplex-foundation/umi-uploader-bundlr';

const umi = createUmi(clusterApiUrl('devnet'));

const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);

// Who will sign the transactions are required
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));
const uploader = createBundlrUploader(umi);

(async () => {
	const file = './assets/rabbit.jpg';
	const buffer = await readFile(file);

	try {
		const image = createGenericFile(buffer, 'rabbit1');
		const [imageUrl] = await uploader.upload([image]);
		console.log(imageUrl);
	} catch (error) {
		console.log(error);
	}
})();
