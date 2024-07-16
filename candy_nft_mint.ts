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
import { assets, CandyNFTMint } from './assets';

const umi = createUmi(clusterApiUrl('devnet')).use(mplCandyMachine());
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

let candyMachineAddress: any;

// For general digital non-fungible asset minting
const createMintAsset = async ({
  description,
  imgPath,
  imgType,
  name,
  type,
}: CandyNFTMint) => {
  // 1.Upload Nft Image
  const imgUri = await nft_init({ path: imgPath });
  // 2.Upload Metadata JSON for Collection type NFT
  if (imgUri) {
    const jsonURI = await nft_metadata({
      nft_name: name,
      nft_description: description,
      imgUri,
      image_type: imgType,
    });

    // 3.Mint NFT to an address
    const mintAddress = await mint_nft({
      name,
      uri: jsonURI,
      type,
    });

    return { mintAddress, jsonURI };
  }
};

// For creating a collection
const createCollection = async ({
  description,
  imgPath,
  imgType,
  name,
  type,
}: CandyNFTMint) => {
  const collectionAddress = await createMintAsset({
    description,
    imgPath,
    imgType,
    name,
    type,
  });

  return collectionAddress;
};
// To mint from candy machine
const candy_mint = async (candyMachineAddress: string) => {
  // ----------------------------------- WILL ONLY WORKS FOR NFTS ------------------------------------------------------------------
  // Then mint nfts to your account from candy machine

  if (!candyMachineAddress) return;

  const nftMintAddressFromCandyMachine = generateSigner(umi);
  const mintedTx = await transactionBuilder()
    .add(setComputeUnitLimit(umi, { units: 800_000 }))
    .add(
      createMintWithAssociatedToken(umi, {
        mint: nftMintAddressFromCandyMachine,
        owner: signer.publicKey,
      })
    )
    .add(
      mintV2(umi, {
        candyMachine: publicKey(candyMachineAddress),
        nftMint: nftMintAddressFromCandyMachine.publicKey,
        collectionMint: publicKey(candyMachineAddress),
        collectionUpdateAuthority: signer.publicKey,
      })
    )
    .sendAndConfirm(umi);

  console.log(
    'Minted NFT Tx----------------->',
    bs58.encode(mintedTx.signature)
  );
};

(async () => {
  const collectionMintAddress = await createCollection({
    description: assets.collection.description,
    imgPath: assets.collection.imgPath,
    imgType: 'collection',
    name: assets.collection.name,
    type: assets.collection.type,
  });

  console.log(
    'Collection Created--------------->',
    collectionMintAddress?.mintAddress
  );

  if (collectionMintAddress) {
    candyMachineAddress = await candy_init({
      availableItem: assets.nfts.length,
      collectionMintAddress: collectionMintAddress.mintAddress as string,
    });
    const nftsWillBeInserted: any = [];
    const promises = assets.nfts.map(async (nft) => {
      const mint = await createMintAsset({
        description: nft.description,
        imgPath: nft.imgPath,
        imgType: nft.imgType,
        name: nft.name,
        type: 'nft',
      });
      console.log('Mint---------------->', mint?.jsonURI);
      nftsWillBeInserted.push(mint);
    });

    await Promise.all(promises);

    console.log('NFTS will be inserted-------->', nftsWillBeInserted);

    await candy_nft_insert({
      candy_machine_address: candyMachineAddress as string,
      nfts: nftsWillBeInserted,
    });

    await candy_mint(candyMachineAddress as string);
  }
})();

// Then Mint from it
