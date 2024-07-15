import {
	addConfigLines,
	mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import {
	createSignerFromKeypair,
	publicKey,
	signerIdentity,
} from '@metaplex-foundation/umi';

import bs58 from 'bs58';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());

const keypair = umi.eddsa.createKeypairFromSecretKey(
	new Uint8Array(wallet)
);

// Who will sign the transactions are required
const signer = createSignerFromKeypair(umi, keypair);
console.log(
	'Signer------------------------------->>>>>',
	signer.publicKey
);
umi.use(signerIdentity(signer));

export const candy_nft_insert = async ({
	candy_machine_address,
	nfts,
}: {
	candy_machine_address: string;
	nfts: {
		name: string;
		uri: string;
	}[];
}) => {
	try {
		const instertedNfts = addConfigLines(umi, {
			candyMachine: publicKey(candy_machine_address),
			index: 0,
			// Total available assets must be added. Otherwise, mint will not start
			configLines: [...nfts],
		});

		const insertedNftsTx = await instertedNfts.sendAndConfirm(umi);
		console.log(
			'Insterted NFTs Tx------------>',
			bs58.encode(insertedNftsTx.signature)
		);
	} catch (error) {
		console.log(
			'An Error occured while Candy_NFT_Insert------------>',
			error
		);
	}
};
