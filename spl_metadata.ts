// Determine token metadata after token account is create --> Step 2
// In that step, we use umi instead of web3.js

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl } from '@solana/web3.js';
import wallet from './wallet.json';
import {
	createSignerFromKeypair,
	publicKey,
	signerIdentity,
} from '@metaplex-foundation/umi';
import {
	createMetadataAccountV3,
	CreateMetadataAccountV3InstructionAccounts,
	CreateMetadataAccountV3InstructionArgs,
	DataV2Args,
} from '@metaplex-foundation/mpl-token-metadata';

(async () => {
	const umi = createUmi(clusterApiUrl('devnet'));
	const keypair = umi.eddsa.createKeypairFromSecretKey(
		new Uint8Array(wallet)
	);

	// We add metadata into token account, therefore we need its public key
	const mint = publicKey(
		'47uoc4b1K3jCizkzWoKyggcjhVsVzb493UApFUWmMPMC'
	);
	// Who will sign the transactions are required
	const signer = createSignerFromKeypair(umi, keypair);
	umi.use(signerIdentity(signer));

	const accounts: CreateMetadataAccountV3InstructionAccounts = {
		mint,
		mintAuthority: signer,
	};

	const data: DataV2Args = {
		name: 'Rabiddo',
		symbol: 'RBD',
		collection: null,
		creators: null,
		sellerFeeBasisPoints: 500,
		uri: 'https://arweave.net/1234',
		uses: null,
	};

	const args: CreateMetadataAccountV3InstructionArgs = {
		data,
		collectionDetails: null,
		isMutable: true,
	};

	// Creating metadata
	const tx = createMetadataAccountV3(umi, {
		...accounts,
		...args,
	});

	tx.sendAndConfirm(umi).then((res) => {
		console.log(res.signature.toString());
	});
})();
