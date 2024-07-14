import {
	mintV2,
	mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import {
	createSignerFromKeypair,
	generateSigner,
	publicKey,
	signerIdentity,
	transactionBuilder,
} from '@metaplex-foundation/umi';
import {
	setComputeUnitLimit,
	createMintWithAssociatedToken,
} from '@metaplex-foundation/mpl-toolbox';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';

import bs58 from 'bs58';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
	const nftMint = generateSigner(umi);
	const mintedTx = await transactionBuilder()
		.add(setComputeUnitLimit(umi, { units: 800_000 }))
		.add(
			createMintWithAssociatedToken(umi, {
				mint: nftMint,
				owner: signer.publicKey,
			})
		)
		.add(
			mintV2(umi, {
				candyMachine: publicKey(
					'4N7PSu6Cqyrox1cgxubYJPdK5owDxdwBiJJA5teKXQam'
				),
				nftMint: nftMint.publicKey,
				collectionMint: publicKey(
					'HKEcgQAYgsgqcyrZu2ANbw3jHDi6RgnrzSJZdEobhjcY'
				),
				collectionUpdateAuthority: signer.publicKey,
			})
		)
		.sendAndConfirm(umi);

	console.log(
		'Minted NFT Tx----------------->',
		bs58.encode(mintedTx.signature)
	);
})();
