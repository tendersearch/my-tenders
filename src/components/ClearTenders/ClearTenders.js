import { useState } from "react";
import { clearTenders } from "../../util/admin";

// Semantic-ui
import { Button, Message } from "semantic-ui-react";

export default function ClearTenders(){
	const[loading, setLoading] = useState(false);
	const[success, setSuccess] = useState(false);
	const[error, setError] = useState(false);

	async function onClick(e){
		e.preventDefault();

		setLoading(true);
		const successful = await clearTenders();
		setLoading(false);

		if(successful)
			setSuccess(true);
		else
			setError(true);
	}

	return(
		<>
			<Button primary onClick={onClick} loading={loading}>Clear all tenders</Button>
			<Message
				positive
				hidden={!success}
				header="Tenders cleared"
				content="The tenders were successfully cleared!"
			/>
			<Message
				warning
				hidden={!error}
				header="Failed to clear tenders"
				content="Something went wrong when clearing the tenders, try again later..."
			/>
		</>
	);
};
