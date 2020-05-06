export default async function get(query){
	const response = await fetch(query);

	return response;
}