import bs58 from 'bs58';

const kp = bs58.decode(
	'5xYhkbRJRwGzeHBCJVMxVcaSa5h6rqmVkB45tEPSwdxsQezE9HkirFYE17aLY6A13TXdSt8K45DafT3NExaAm6QM'
);

console.log('My Secret key is:', kp);
