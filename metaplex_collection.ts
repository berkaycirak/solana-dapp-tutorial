import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import wallet from './wallet.json';
import { nft_init } from './nft_image';
import { nft_metadata } from './nft_metadata';
// With UMI:
import {
	createNft,
	findMasterEditionPda,
	findMetadataPda,
	mplTokenMetadata,
	verifyCollection,
	verifySizedCollectionItem,
} from '@metaplex-foundation/mpl-token-metadata';
import {
	percentAmount,
	keypairIdentity,
	generateSigner,
	KeypairSigner,
	createSignerFromKeypair,
} from '@metaplex-foundation/umi';

const umi = createUmi(clusterApiUrl('devnet'));
const creatorWallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const creator = createSignerFromKeypair(umi, creatorWallet);

umi.use(keypairIdentity(creator));
umi.use(mplTokenMetadata());

let nftMint: KeypairSigner = generateSigner(umi);
let collectionMint: KeypairSigner = generateSigner(umi);

console.log(nftMint.publicKey);
console.log(collectionMint.publicKey);

(async () => {
	console.log('Starting-------------------------------->');
	const imageUri = await nft_init({ path: './assets/rabbit_collection.png' });

	if (imageUri) {
		const jsonUri = await nft_metadata({
			image_type: 'png',
			imgUri: imageUri,
			nft_name: 'Test Collection',
			nft_description: 'test collection description',
		});
		// Collection Creating
		await createNft(umi, {
			mint: collectionMint,
			name: 'Dummy Collection',
			uri: jsonUri,
			isCollection: true,
			sellerFeeBasisPoints: percentAmount(2.5),
		}).sendAndConfirm(umi);

		console.log('\nCollection created', collectionMint.publicKey.toString());

		const imgUri = await nft_init({ path: './assets/rabbit5.png' });
		if (imgUri) {
			const jsnUri = await nft_metadata({
				image_type: 'png',
				imgUri,
				nft_description: 'nft description',
				nft_name: 'nft name',
			});
			// NFT Creating
			await createNft(umi, {
				mint: nftMint,
				authority: creator,
				name: 'Dummy NFT',
				uri: jsnUri,
				sellerFeeBasisPoints: percentAmount(2.5),
				collection: {
					key: collectionMint.publicKey,
					verified: false,
				},
				tokenOwner: creator.publicKey,
			}).sendAndConfirm(umi);

			console.log('NFT created', nftMint.publicKey);

			// Verify Collection
			const collectionMetadata = findMetadataPda(umi, { mint: collectionMint.publicKey });
			const collectionMasterEdition = findMasterEditionPda(umi, { mint: collectionMint.publicKey });
			const nftMetadata = findMetadataPda(umi, { mint: nftMint.publicKey });

			await verifySizedCollectionItem(umi, {
				collectionAuthority: creator,
				collectionMint: collectionMint.publicKey,
				collection: collectionMetadata,
				collectionMasterEditionAccount: collectionMasterEdition,
				metadata: nftMetadata,
			}).sendAndConfirm(umi);
			console.log('---------Verified----------');
		}
	}
})();
