import Cookie from "js-cookie";

export default async function loginUser(data){
	const { accessToken, tokenId } = data;

	const response = await fetch("/api/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			accessToken,
			tokenId
		})
	});

	const text = await response.text();

	console.log(text);
	const result = await response.json();

	if(result.secret) Cookie.set("secret", result.secret);

	return result;
}