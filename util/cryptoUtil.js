import CryptoJS from "../common/crypto-js/crypto-js.js"

// 十六位十六进制数作为密钥偏移量
const SECRET_IV = CryptoJS.enc.Utf8.parse("");

/**加密方法
 * @param {Object} data
 * @param {Object} key
 * @returns {string} 16进制
 */
function encrypt(data, key) {
	let SECRET_KEY = CryptoJS.enc.Utf8.parse(key);
	if (typeof data === "object") {
		try {
			// eslint-disable-next-line no-param-reassign
			data = JSON.stringify(data);
		} catch (error) {
			console.log("encrypt error:", error);
		}
	}
	const dataHex = CryptoJS.enc.Utf8.parse(data);
	const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
		iv: SECRET_IV,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return encrypted.ciphertext.toString();
}

/**解密方法
 * @param {Object} data
 * @param {Object} key
 * @returns {string} 
 */
export function decrypt(data, key) {
	let SECRET_KEY = CryptoJS.enc.Utf8.parse(key);
	const encryptedHexStr = CryptoJS.enc.Hex.parse(data);
	const str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
	const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
		iv: SECRET_IV,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
	return decryptedStr.toString();
}

module.exports = {
	encrypt
}
