import {
	addConfigLines,
	mplCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine';
import { publicKey } from '@metaplex-foundation/umi';

import bs58 from 'bs58';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());

(async () => {
	const instertedNfts = addConfigLines(umi, {
		candyMachine: publicKey(
			'4N7PSu6Cqyrox1cgxubYJPdK5owDxdwBiJJA5teKXQam'
		),
		index: 0,
		// Total available assets must be added. Otherwise, mint will not start
		configLines: [
			{
				name: 'Thumper the Brave',
				uri: 'https://arweave.net/Vbfr0iOP2YMUDK-9WA4D29UK_1BNMXMmwO2BRCPv6fI',
			},
		],
	});

	const insertedNftsTx = await instertedNfts.sendAndConfirm(umi);
	console.log(
		'Insterted NFTs Tx------------>',
		bs58.encode(insertedNftsTx.signature)
	);
})();
