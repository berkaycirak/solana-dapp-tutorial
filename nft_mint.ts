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
import {
	createNft,
	mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';

const umi = createUmi(clusterApiUrl('devnet'));
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);

const signer = createSignerFromKeypair(umi, keypair);
const mint = generateSigner(umi);

umi.use(signerIdentity(signer));
umi.use(mplTokenMetadata());

(async () => {
	const url =
		'https://arweave.net/xfSdr9NKYwZ33Lj3qdBR6_ExYtf123sr0TImHn4ffZE';

	const tx = createNft(umi, {
		mint,
		name: 'Captain Carpet',
		symbol: 'CC',
		sellerFeeBasisPoints: percentAmount(3),
		uri: url,
	});

	const res = await tx.sendAndConfirm(umi);
	console.log(bs58.encode(res.signature));
})();
