export interface CandyNFTMint {
	name: string;
	description: string;
	type: 'collection' | 'nft';
	imgPath: string;
	imgType: string;
}

export interface Assets {
	collection: CandyNFTMint;
	nfts: CandyNFTMint[];
}

export const assets: Assets = {
	collection: {
		description:
			'"Fluffy Warriors" is a unique collection of warrior rabbits who blend bravery with charm. Each rabbit in this collection is not only a fierce fighter but also embodies the playful and cute nature of our favorite fluffy friends. Get ready to meet a team of adorable heroes who hop into battle with courage and cuteness in equal measure.',
		imgPath: './assets/rabbit_collection.png',
		imgType: 'png',
		name: 'Fluffy Rabiddo Warriors',
		type: 'collection',
	},
	nfts: [
		{
			name: 'Cottontail the Conqueror',
			description:
				"Cottontail's armor might be intimidating, but his soft, fluffy exterior tells a different story. He's a gentle warrior who loves hopping around fields and making new friends.",
			imgPath: './assets/rabbit.png',
			type: 'nft',
			imgType: 'png',
		},
		{
			name: 'Snuggles the Strong',
			description:
				'Snuggles is a mighty warrior with a penchant for cuddles. His strength and bravery are matched only by his love for fun and his incredibly soft fur.',
			imgPath: './assets/rabbit2.png',
			type: 'nft',
			imgType: 'png',
		},
	],
};
