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

export const nft_metadata = async ({
	imgUri,
	image_type,
	nft_description,
	nft_name,
}: {
	imgUri: string;
	nft_name: string;
	nft_description: string;
	image_type: string;
}) => {
	const metadata = {
		name: nft_name,
		description: nft_description,
		image: imgUri,
		properties: {
			files: [
				{
					type: image_type,
					uri: imgUri,
				},
			],
		},
	};

	const jsonURI = await uploader.uploadJson(metadata);
	console.log('jsonURI uploaded------------------->', jsonURI);
	return jsonURI;
};
