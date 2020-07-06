import moment from "moment";
import auth from "./Auth";

export async function clearTenders(){
	const response = await fetch("/api/tender/clear", {
		method: "DELETE",
		headers: {
			"Authorization": `Bearer ${auth.user.secret}`
		},
		mode: "cors"
	});

	return response.ok;
}

export async function listSpreadsheets(user, { refreshed = false } = {}){
	const response = await fetch("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'", {
		headers: {
			"Authorization": `Bearer ${user.tc.access_token}`
		},
		mode: "cors"
	});

	// If the access token has expired, refresh the session and try again.
	if(response.status === 401){
		const newUser = await auth.refresh();
		return listSpreadsheets(newUser, { refreshed: true });
	}

	const result = await response.json();

	return result.files;
}

export async function fetchSpreadsheet(user, id, { refreshed = false } = {}){
	const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:J10000`, {
		headers: {
			"Authorization": `Bearer ${user.tc.access_token}`
		},
		mode: "cors"
	});

	// If the access token has expired, refresh the session and try again.
	if(response.status === 401){
		const newUser = await auth.refresh();
		return fetchSpreadsheet(newUser, id, { refreshed: true });
	}

	const result = await response.json();

	return parseSpreadsheet(result.values);
}

export async function addTenders(sheetData){
	let response,
		i = 0;
	const chunks = chunkArray(sheetData, 150);

	for(const chunk of chunks){
		console.log(chunk);
		response = await fetch("/api/tender/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${auth.user.secret}`,
				"x-trigger-build": i === chunks.length - 1 ? "build" : ""
			},
			body: JSON.stringify(chunk)
		});

		i++;
		if(response.status !== 200) break;
	}

	return response;
}

export function parseSpreadsheet(rows){
	const keys = rows[0].map( value => {
		switch(value.trim()){
		case "Organisation Name":
			return"name";
		case "Department":
			return"department";
		case "Work Description":
			return"description";
		case "State":
			return"state";
		case "City":
			return"city";
		case "Tender Fee":
			return"estAmount";
		case "EMD":
			return"emd";
		case "Bid Submission End Date":
			return"endDate";
		case "Bid Opening Date":
			return"openingDate";
		case "In-App Browser":
			return"url";
		}
	});
	delete rows[0];

	return rows.map( tender => {
		const obj = {};

		tender.forEach( (value, index) => {
			obj[keys[index]] = value;
		});

		return obj;
	})
		.filter( value => typeof value === "object")
		.map( tender => {
			return{
				...tender,
				endDate: moment(tender.endDate.trim().replace(/-/g, "/")).toISOString(),
				openingDate: moment(tender.openingDate.trim().replace(/-/g, "/")).toISOString()
			};
		});
}

export async function removeTenders(arr){
	const response = await fetch("/api/tender/remove", {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${auth.user.secret}`
		},
		body: JSON.stringify(arr)
	});

	return response;
}

/**
 * Divide an array into equally large chunks
 * @param {Any[]} arr - The array to divide into chunks
 * @param {Number} chunkLength - The maximum length of each chunk
 * @returns {Array[]} An array containing the chunks
 */
export function chunkArray(arr, chunkLength){
	let result = [],
		pos = 0,
		i = 0;

	const length = arr.length;
	const numChunks = Math.ceil(length / chunkLength);

	while(i < numChunks){
		const chunk = arr.slice(pos, pos + chunkLength);
		result.push(chunk);

		pos += chunkLength;
		i++;
	}

	return result;
}
