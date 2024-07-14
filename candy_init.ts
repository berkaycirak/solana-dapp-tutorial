import {
	create,
	mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import {
	createSignerFromKeypair,
	generateSigner,
	percentAmount,
	publicKey,
	signerIdentity,
	some,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import bs58 from 'bs58';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

(async () => {
	const candyMachine = generateSigner(umi);
	const candyMachineTx = await create(umi, {
		candyMachine,
		collectionMint: publicKey(
			'HKEcgQAYgsgqcyrZu2ANbw3jHDi6RgnrzSJZdEobhjcY'
		),
		collectionUpdateAuthority: signer,
		tokenStandard: TokenStandard.NonFungible,
		sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
		itemsAvailable: 1,
		creators: [
			{
				address: signer.publicKey,
				verified: true,
				percentageShare: 100,
			},
		],
		configLineSettings: some({
			prefixName: '',
			nameLength: 32,
			prefixUri: '',
			uriLength: 200,
			isSequential: false,
		}),
	});

	const createdCandyTx = await candyMachineTx.sendAndConfirm(umi);

	console.log(
		'Created Candy Machine-------->',
		bs58.encode(createdCandyTx.signature)
	);
})();
