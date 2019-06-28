import { exceptionHandler } from "./errors";
import * as maths from "./maths";

let path = require('path');

async function parse(polynomial: string): Promise<string[][]>
{
	// Made this function clearer.
	let elems = polynomial.split("-")
		.map((e, i) => (i > 0 ? "-" : "") + e) // Delete - before a 0.
		.filter((e) => (e != ""))	// Delete empty elem
		.map((e) => (e.split("+")))
		.reduce((a, b) => (a.concat(b))) 
		.map((e) => (e.split("X")));
	let values :string[][] = elems.map(function (e) {
		if (e.length === 1)
		{
			e = [e.toString(), "0"];
		}
		else if (e.length === 2)
		{
			e[0] = e[0] == "-" ? "-1" : e[0];
			e[0] = e[0] == "" ? "1" : e[0];
			e[1] = e[1] == "" ? "1" : e[1].substr(1);
		}
		return (e);
	});
	return values;
}

async function reduce(values: string[][]): Promise<string[][]>
{
	// BAD BAD RESULT	
	values.reduce(function(prev, curr)
	{
		if (prev[parseInt(curr[1])] == null)
			prev[parseInt(curr[1])] = curr[0];
		else
			prev[parseInt(curr[1])] += curr[0];
		return prev;
	}, [])
	.map((item, index) => ([item, index]))
	.reduce(function(prev, curr)
	{
		if (Array.isArray(curr))
			prev.push(curr[0]);
		return (prev);
	}, []);
	console.log(values);	
	return values;
}

async function equalize(polynomialLeft: string[][], polynomialRight: string[][]): Promise<string[][]>
{
	let position = 0;
	polynomialRight.forEach(function (value) {
		let tmp: number = 0;
		if (value[0] === '0')
			return;
		position = polynomialLeft.findIndex((item) => (item[1] == value[1]));
		if (position < 0)
		{
			tmp = -value[0];
			polynomialLeft.push([tmp.toString(), value[1]]);
		}
		else
		{
			tmp = parseInt(polynomialLeft[position][0]) - parseInt(value[0]);
			polynomialLeft[position][0] = tmp.toString();
		}
	});
	polynomialLeft = polynomialLeft.filter((x) => (x[0] !== '0'));
	return polynomialLeft;
}

async function resolve(): Promise<string>
{
	let message:string;
	message = "... Resolution ...";
	return message;	
}

async function main(equation: string): Promise<void>
{
	let polynomialLeft;
	let polynomialRight;
	let currentPolynomial;
	let sides = equation.split(" ").join("").split("=");
	
	polynomialLeft = sides[0];
	polynomialRight = sides[1];
	let leftValues = await parse(polynomialLeft);
	let rightValues = await parse(polynomialRight);
	leftValues = await reduce(leftValues);
	rightValues = await reduce(rightValues);
	leftValues = await equalize(leftValues, rightValues);
	console.log(leftValues);
	// Parse the equation.
	// Reduce the equation.
	// Resolve it.
	// Display.
}

(async() => {
	const argv: string[] = process.argv;
	if (!argv || argv.length !== 3 || argv.length > 3)
		throw new Error(path.basename("./" + process.argv[1] + ": invalid argument numbers exception."));
	const equation: string = argv[argv.length - 1];
	await main(equation.toUpperCase());
	return ;
	})().catch(exceptionHandler)
