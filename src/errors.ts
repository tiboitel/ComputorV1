export async function exceptionHandler(err: Error): Promise<void> {
	console.log(err.message);
	return ;
}
