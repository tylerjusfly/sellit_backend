export const GenerateProductId = () => {
	return 'pxxx-rxxx-oxxx-dxxx-uxxx-cxxx-txxx'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};


export const GenerateCategoryid = () => {
	return 'cxxxxxx-axxxxxxx-txxxxxx-ixxxd'.replace(/[xy]/g, function (c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
};

export const uniqueID = (length: number) => {
	var result = '';
	var chars = '0123456789----';
	for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
	return result;
};