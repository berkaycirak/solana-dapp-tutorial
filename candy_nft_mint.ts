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
import { candy_init } from './candy_init';
import { candy_nft_insert } from './candy_nft_insert';
import { nft_init } from './nft_image';
import { nft_metadata } from './nft_metadata';
import { mint_nft } from './nft_mint';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

const CANDY_MACHINE_ADDRESS =
	'4N7PSu6Cqyrox1cgxubYJPdK5owDxdwBiJJA5teKXQam';
const COLLECTION_MINT_ADDRESS =
	'HKEcgQAYgsgqcyrZu2ANbw3jHDi6RgnrzSJZdEobhjcY';

const candy_nft_mint = async () => {
	try {
		// 1.Upload Nft Image
		const imgUri = await nft_init({ path: '' });
		// 2.Upload Metadata JSON for Collection type NFT
		if (imgUri) {
			const jsonURI = await nft_metadata({
				nft_name: '',
				nft_description: '',
				imgUri,
				image_type: '',
			});

			// 3.Mint NFT to an address
			const mint_nft;
		} else {
			throw new Error('Img Uri is not created');
		}

		// First init candy machine to an address
		const candy_init_promise = candy_init();
		// Then instert created nfts into it. itemAvailable must be matched!!
		const insert_nfts_promise = candy_nft_insert();

		// Resolve batched promises
		await Promise.all([candy_init_promise, insert_nfts_promise]);

		// Then mint nfts to your account from candy machine

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
					candyMachine: publicKey(CANDY_MACHINE_ADDRESS),
					nftMint: nftMint.publicKey,
					collectionMint: publicKey(COLLECTION_MINT_ADDRESS),
					collectionUpdateAuthority: signer.publicKey,
				})
			)
			.sendAndConfirm(umi);

		console.log(
			'Minted NFT Tx----------------->',
			bs58.encode(mintedTx.signature)
		);
	} catch (error) {
		console.log(
			'An Error occured while Candy_NFT_Mint------------>',
			error
		);
	}
};

candy_nft_mint();
