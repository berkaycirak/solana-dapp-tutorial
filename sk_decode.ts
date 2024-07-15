import bs58 from 'bs58';

const kp = bs58.decode(
	'466cVVMfthgc12GazPQjoPeq4wW4ePsDYdT8GwUhpHW35vScEGYu3YSA23zyx92H4duCEtiXzukNHQvWs7dJ9KXc'
);

console.log('My Secret key is:', kp);
