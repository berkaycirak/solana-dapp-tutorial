import {
  keypairIdentity,
  Metaplex,
  Nft,
  walletAdapterIdentity,
} from '@metaplex-foundation/js';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { clusterApiUrl, Connection, Keypair } from '@solana/web3.js';
import wallet from './wallet.json';
import { nft_init } from './nft_image';
import { nft_metadata } from './nft_metadata';

const connection = new Connection(clusterApiUrl('devnet'));
const metaplex = new Metaplex(connection);

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
metaplex.use(keypairIdentity(keypair));

(async () => {
  const imageUri = await nft_init({ path: './assets/rabbit_collection.png' });
  if (imageUri) {
    const jsonUri = await nft_metadata({
      image_type: 'png',
      imgUri: imageUri,
      nft_name: 'Test Collection',
      nft_description: 'test collection description',
    });
    const collection = (
      await metaplex.nfts().create({
        name: 'Dummy Collection',
        uri: jsonUri,
        sellerFeeBasisPoints: 250,
        isCollection: true,
      })
    ).nft;

    console.log('\nCollection created', collection.mint.address.toBase58());

    const imgUri = await nft_init({ path: './assets/rabbit5.png' });
    if (imgUri) {
      const jsnUri = await nft_metadata({
        image_type: 'png',
        imgUri,
        nft_description: 'nft description',
        nft_name: 'nft name',
      });
      const nft = (
        await metaplex.nfts().create({
          name: 'Dummy NFT',
          uri: jsnUri,
          sellerFeeBasisPoints: 250,
          collection: collection.mint.address,
        })
      ).nft;

      console.log('NFT created', nft.mint.address.toBase58());
      await metaplex.nfts().verifyCollection({
        mintAddress: nft.mint.address,
        collectionMintAddress: collection.mint.address,
      });
      console.log('---------Verified----------');
    }
  }
})();
