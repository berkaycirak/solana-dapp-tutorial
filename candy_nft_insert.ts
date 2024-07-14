import {
	addConfigLines,
	mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';

import bs58 from 'bs58';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());

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
