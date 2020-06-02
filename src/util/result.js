import moment from "moment";

export function parseDate(date){
	let dateStr = date;

	if(typeof date === "object") dateStr = date["@ts"];

	return moment(dateStr).format("DD-MMM-YYYY hh:mm A");
}

export function parseNumber(numStr){
	return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(numStr);
}
