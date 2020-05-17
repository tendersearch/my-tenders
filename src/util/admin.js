import moment from "moment";
import auth from "./Auth";

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
	const response = await fetch("/api/tender/add", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${auth.user.secret}`
		},
		body: JSON.stringify(sheetData)
	});

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
