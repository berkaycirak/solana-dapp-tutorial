import bs58 from 'bs58';

const kp = bs58.decode(
	'3MGyN2fcVE6Vd7GGJjCjxjdNdz8u5qdWXcVvR85kZiFReUvpVufHmG8cZFdMyeNpM8KejRcd1yMg9fhQ6GtM1m1U'
);

console.log('My Secret key is:', kp);
