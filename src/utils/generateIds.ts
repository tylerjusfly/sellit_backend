export const GenerateProductId = () => {
	return 'pxxx-rxxx-oxxx-dxxx-uxxx-cxxx-txxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};
