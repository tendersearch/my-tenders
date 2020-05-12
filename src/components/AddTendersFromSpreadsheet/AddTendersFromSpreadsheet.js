import { useEffect, useState } from "react";
import auth from "../../util/Auth";
import { Button, Modal, Dropdown, Divider } from "semantic-ui-react";
import moment from "moment";

import PropTypes from "prop-types";

export default function AddTendersFromSpreadsheet({ className }){
	const user = auth.googleUser;
	const[fetching, setFetching] = useState(true);
	const[sheets, setSheets] = useState([]);
	const[sheetId, setSheetId] = useState(null);

	useEffect( () => {
		const fetchSheets = async () => {
			const sheets = await listSpreadsheets(user);
			setFetching(false);

			setSheets(sheets);
		};

		if(sheets.length === 0)
			fetchSheets();
	});

	const onSubmit = async () => {
		const sheetData = await fetchSpreadsheet(user, sheetId);
		const response = await fetch("/api/tender/add", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${auth.user.secret}`
			},
			body: JSON.stringify(sheetData)
		});

		const result = await response.json();

		console.log(result);
	};

	const onChange = (e, { value }) => {
		setSheetId(value);
	};

	return(
		<div className={className}>
			<Modal
				trigger={<Button primary loading={fetching}>Add tenders from Google Sheets</Button>}
				closeIcon
				size="mini"
			>
				<Modal.Header>Select spreadsheet to fetch tenders from</Modal.Header>
				<Modal.Content>
					<Dropdown
						control="select"
						placeholder="Select Spreadsheet"
						name="sheetId"
						search
						selection
						onChange={onChange}
						options={sheets.map( sheet => ({
							key: sheet.id,
							value: sheet.id,
							text: sheet.name
						}))}
					/>

					<Divider hidden />

					<Button onClick={onSubmit} primary>Fetch tenders</Button>
				</Modal.Content>
			</Modal>
		</div>

	);
}

async function listSpreadsheets(user){
	const response = await fetch("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'", {
		headers: {
			"Authorization": `Bearer ${user.tc.access_token}`
		},
		mode: "cors"
	});

	const result = await response.json();

	return result.files;
}

async function fetchSpreadsheet(user, id){
	const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${id}/values/A1:I10000`, {
		headers: {
			"Authorization": `Bearer ${user.tc.access_token}`
		},
		mode: "cors"
	});

	const result = await response.json();

	return parseSpreadsheet(result.values);
}

function parseSpreadsheet(rows){
	const keys = rows[0].map( value => {
		switch(value){
		case "Organisation Name":
			return"name";
		case "Name of Work":
			return"description";
		case "State":
			return"state";
		case "City":
			return"city";
		case "Tender Fees":
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

AddTendersFromSpreadsheet.propTypes = {
	className: PropTypes.string
};
