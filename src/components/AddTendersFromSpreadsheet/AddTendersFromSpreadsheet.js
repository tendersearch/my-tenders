import { useEffect, useState } from "react";
import auth from "../../util/Auth";
import { listSpreadsheets, fetchSpreadsheet, addTenders } from "../../util/admin";

// Semantic ui
import { Button, Modal, Dropdown, Divider, Message } from "semantic-ui-react";

import PropTypes from "prop-types";

function humanFriendlyError(errorCode){
	switch(errorCode){
	case "ALGOLIA_INDEX_ERROR":
		return"There was an error indexing the tenders on Algolia. They might exist in the database, but cannot be searched.";
	case "HOOK_ERROR":
		return"There was an error triggering a new build. The tenders have been saved and indexed, but they won't appear in the advanced search. You can fix this by triggering a build on Vercel.";
	default:
		return"Something went wrong when saving your new tenders.";
	}
}

export default function AddTendersFromSpreadsheet({ className }){
	const user = auth.googleUser;
	const[fetching, setFetching] = useState(true);
	const[sheets, setSheets] = useState([]);
	const[sheetId, setSheetId] = useState(null);
	const[uploading, setUploading] = useState(false);
	const[error, setError] = useState(false);
	const[errorMessage, setErrorMessage] = useState("");
	const[success, setSuccess] = useState(false);

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
		setUploading(true);
		const sheetData = await fetchSpreadsheet(user, sheetId);
		const response = await addTenders(sheetData);
		setUploading(false);

		const status = response.status;
		if(status !== 200){
			const result = await response.json();
			const statusCode = result.message;

			const message = humanFriendlyError(statusCode);
			setErrorMessage(message);
		}

		if(response.ok)
			setSuccess(true);
		else
			setError(true);
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
					<Message
						positive
						hidden={!success}
						header="Tenders saved"
						content="Your new tenders were successfully saved!"
					/>
					<Message
						warning
						hidden={!error}
						header="Failed to save tenders"
						content={errorMessage}
					/>

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

					<Button onClick={onSubmit} primary loading={uploading}>Fetch tenders</Button>
				</Modal.Content>
			</Modal>
		</div>

	);
}

AddTendersFromSpreadsheet.propTypes = {
	className: PropTypes.string
};
