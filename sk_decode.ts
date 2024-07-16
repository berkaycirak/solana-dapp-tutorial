import bs58 from 'bs58';

const kp = bs58.decode(
  '2H4JqQ5o1gNnUL5US5hGpg7mSWHL1FTQjetoxiY15wmXwWERAQdvUobRSTQUYsaBybudFVBXt3UK45T8QYFc5kp2'
);

console.log('My Secret key is:', kp);
