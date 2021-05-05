import { create, all } from 'mathjs';

const math = create(all, {
	number: 'BigNumber',
}) as math.MathJsStatic;

export default math;
