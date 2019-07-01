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

async function simplify(values: string[][]): Promise<string[][]>
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
	return values;
}


// Need to rename this function to something better.
async function vstr(polynomialLeft: string[][]): Promise<string>
{
	if (polynomialLeft.length == 0)
		return ("0 * X^0");
	let str = polynomialLeft[0][0] + " * X^" + polynomialLeft[0][1];
	polynomialLeft.forEach(function(value, index) {
		if (index == 0)
			return ;
		str += (parseInt(value[0]) < 0)  ? " - " + -value[0] : " + " + value[0];
		str += " * X^" + value[1];
	});
	return str;
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

async function resolve(polynomialLeft: string[][], polynomialDegree: number): Promise<string>
{
	let	message:string;
	let	delta:number;
	let	values:number[] = new Array();

	for (let i = 3; i > 0; i--)
	{
		let tmp = polynomialLeft.find((x) => (parseInt(x[1]) == i));
		values.push((tmp !== undefined) ? parseInt(tmp[0]) : 0);
		console.log(values);
	}
	if (polynomialDegree === 0)
	{
		message = (polynomialLeft.length != 0) ? "There is no solutions." : message = "Every real is a solution.";
	}
	else if (polynomialDegree === 1)
	{
		message = "Solution: " + values[2] / values[1];
	}
	else if (polynomialDegree === 2)
	{
		message = "Not implemented yet.";
	}
	return message;	
}

async function main(equation: string): Promise<void>
{
	let	polynomialLeft;
	let	polynomialRight;
	let	leftValues;
	let	rightValues;
	let	currentPolynomial;
	let	polynomialDegree: number = 0;
	let	reducedForm;
	let	sides = equation.split(" ").join("").split("=");

	polynomialLeft = sides[0];
	polynomialRight = sides[1];
	leftValues = await parse(polynomialLeft);
	rightValues = await parse(polynomialRight);
	leftValues = await simplify(leftValues);
	rightValues = await simplify(rightValues);
	leftValues = await equalize(leftValues, rightValues);
	reducedForm = await vstr(leftValues);
	polynomialDegree = leftValues.reduce((prev, curr) => ((parseInt(curr[1]) > prev) ? parseInt(curr[1]) : prev), 0);
	if (polynomialDegree > 2)
		throw new Error("Impossible to solve an equation of the degree superior to 2.");
	console.log("Reduced form: " + reducedForm + " = 0");
	console.log("Polynomial degree: " + polynomialDegree);
	console.log(await resolve(leftValues, polynomialDegree));
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
