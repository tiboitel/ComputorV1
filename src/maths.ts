export function abs(n:number) {
	return (n < 0) ? -n : n;
}

export function max(n_array:number[]) {
	let max = 0;
	for (let i = 0; i < n_array.length; i++)
		max = (n_array[i] > max) ? n_array[i] : max;
	return max;
}

export function q_rsqrt(n:number)
{
	let i, x2, y;
	let threehalfs = 1.5;

	x2 = n * 0.5;
	y = n;
	let buffer = new ArrayBuffer(4);
	(new Float32Array(buffer))[0];
	i = (new Uint32Array(buffer))[0];
	i = (0x5f3759df - (i >> 1));
	(new Uint32Array(buffer))[0] = i;
	 y = (new Float32Array(buffer))[0];
 	 y  = y * ( threehalfs - ( x2 * y * y ) );   // 1st iteration
	return y;
}
