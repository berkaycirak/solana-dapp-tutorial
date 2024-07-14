// Final step is minting that nft

import {
	createSignerFromKeypair,
	generateSigner,
	none,
	percentAmount,
	publicKey,
	signerIdentity,
	some,
	transactionBuilder,
} from '@metaplex-foundation/umi';
import {
	setComputeUnitLimit,
	createMintWithAssociatedToken,
} from '@metaplex-foundation/mpl-toolbox';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';
import {
	createNft,
	TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata';
import {
	addConfigLines,
	create,
	deleteCandyGuard,
	deleteCandyMachine,
	mintV2,
} from '@metaplex-foundation/mpl-candy-machine';

import bs58 from 'bs58';

import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));
console.log('Generated Signer------->', signer.publicKey);

// Create the Collection NFT
const collectionMint = createSignerFromKeypair(umi, keypair);
console.log('CollectionSigner------->', collectionMint.publicKey);
const collectionUpdateAuthority = createSignerFromKeypair(
	umi,
	keypair
);

(async () => {
	const url =
		'https://arweave.net/xwQ3SAjbk3tGITyzi0mE_aUgKBGK_ASUcSkSLhNuTsY';

	// First create an nft and mint it as isCollection=true

	// create the candy machine

	// const candyMachine = generateSigner(umi);
	// const candyMachineTx = await create(umi, {
	// 	candyMachine,
	// 	collectionMint: publicKey(
	// 		'HKEcgQAYgsgqcyrZu2ANbw3jHDi6RgnrzSJZdEobhjcY'
	// 	),
	// 	collectionUpdateAuthority: signer,
	// 	tokenStandard: TokenStandard.NonFungible,
	// 	sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
	// 	itemsAvailable: 1,
	// 	creators: [
	// 		{
	// 			address: signer.publicKey,
	// 			verified: true,
	// 			percentageShare: 100,
	// 		},
	// 	],
	// 	configLineSettings: some({
	// 		prefixName: '',
	// 		nameLength: 32,
	// 		prefixUri: '',
	// 		uriLength: 200,
	// 		isSequential: false,
	// 	}),
	// });

	// const createdCandyTx = await candyMachineTx.sendAndConfirm(umi);

	// console.log(
	// 	'Created Candy Machine-------->',
	// 	bs58.encode(createdCandyTx.signature)
	// );

	// ------------------------- Insterd NFTs into Candy Machine --------------------
	// const instertedNfts = addConfigLines(umi, {
	// 	candyMachine: publicKey(
	// 		'4N7PSu6Cqyrox1cgxubYJPdK5owDxdwBiJJA5teKXQam'
	// 	),
	// 	index: 0,
	// 	configLines: [
	// 		{
	// 			name: 'Thumper the Brave',
	// 			uri: 'https://arweave.net/Vbfr0iOP2YMUDK-9WA4D29UK_1BNMXMmwO2BRCPv6fI',
	// 		},
	// 	],
	// });

	// const insertedNftsTx = await instertedNfts.sendAndConfirm(umi);
	// console.log(
	// 	'Insterted NFTs Tx------------>',
	// 	bs58.encode(insertedNftsTx.signature)
	// );
	//   --------------------MINT NFT FROM CANDY MACHINE ---------------------------------
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

	// const deleteTx = await deleteCandyMachine(umi, {
	// 	candyMachine: publicKey(
	// 		'5uQGzXpzkw8FnRVt9FJLbwsC3CYWTEwbtZP9Cv7n4fag'
	// 	),
	// }).sendAndConfirm(umi);

	// await deleteCandyGuard(umi, {
	// 	candyGuard: publicKey(
	// 		'5qP72nQ8j2xiFvLmUL1We9K8kx5CX4J3XHNVFAzHX6Ae'
	// 	),
	// }).sendAndConfirm(umi);

	// console.log('CANDY TX---------->', bs58.encode(deleteTx.signature));
})();
