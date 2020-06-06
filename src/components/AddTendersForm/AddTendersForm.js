import { useState } from "react";
import Datetime from "react-datetime";
import { useForm } from "react-hook-form";
import { addTenders } from "../../util/admin";

// Semantic ui
import { Button, Form, Input, Label, Header, Message } from "semantic-ui-react";

const AddTendersForm = () => {
	const{ register, handleSubmit, errors } = useForm();
	const[loading, setLoading] = useState(false);
	const[success, setSuccess] = useState(false);
	const[error, setError] = useState(false);
	const[errorMessage, setErrorMessage] = useState("Something went wrong when trying to add the tender. Try again in a while, if it still doesn't work, something is very wrong.");

	const onSubmit = async (data) => {
		setLoading(true);

		// Data needs to be an array.
		const response = await addTenders([data]);

		if(response.ok){
			setSuccess(true);
			setError(false);
		}else{
			setError(true);
			setSuccess(false);

			if(response.status === 401)
				setErrorMessage("You are not authorized. Your token may have expired, try logging out and back in.");
		}

		setLoading(false);
	};

	return(
		<Form action="/api/tender/add" onSubmit={handleSubmit(onSubmit)} success={success} error={error}>
			<Header as="h3">Create single tender</Header>

			{/* Organisation name */}
			<Form.Group widths="equal">
				<Form.Field>
					<label>Organisation Name</label>
					<input
						type="text"
						placeholder="eg. Air India"
						name="name"
						ref={register({
							required: "Type the organisation name"
						})}
					/>
					<InputError name="name" errors={errors} />
				</Form.Field>

				<Form.Field>
					<label>Department</label>
					<input
						type="text"
						placeholder="eg. Electrical"
						name="department"
						ref={register({
							required: "Type the department"
						})}
					/>
				</Form.Field>
			</Form.Group>

			{/* Url */}
			<Form.Field>
				<label>URL</label>
				<input
					type="text"
					placeholder="eg. https://example.com"
					name="url"
					ref={register({
						required: "Type a URL",
						pattern: {
							value: /^http(s?):\/\/.*\..*$/,
							message: "URL is not valid"
						}
					})}
				/>
				<InputError name="url" errors={errors} />
			</Form.Field>

			{/* City and state group */}
			<Form.Group widths="equal">
				<Form.Field fluid>
					<label>City</label>
					<input
						type="text"
						placeholder="eg. Chennai"
						name="city"
						ref={register({
							required: "Type the name of the city"
						})}
					/>
					<InputError name="city" errors={errors} />
				</Form.Field>
				<Form.Field fluid>
					<label>State</label>
					<input
						type="text"
						placeholder="eg. Tamil Nadu"
						name="state"
						ref={register({
							required: "Type the name of the state"
						})}
					/>
					<InputError name="state" errors={errors} />
				</Form.Field>
			</Form.Group>

			{/* Select dates */}
			<Form.Group widths="equal">
				<Form.Field fluid>
					<label>Opening date</label>
					<Datetime
						inputProps={{
							name: "openingDate",
							ref: register({ required: "Supply a date" })
						}}
						defaultValue={new Date()}
					/>
					<InputError name="openingDate" errors={errors} />
				</Form.Field>

				<Form.Field fluid>
					<label>End date</label>
					<Datetime
						inputProps={{
							name: "endDate",
							ref: register({ required: "Supplay a date" })
						}}
						defaultValue={new Date()}
					/>
					<InputError name="endDate" errors={errors} />
				</Form.Field>
			</Form.Group>

			{/* Amounts */}
			<Form.Group widths="equal">
				<Form.Field fluid>
					<label>Tender fees</label>
					<Input label="Rs." >
						<Label basic>Rs.</Label>
						<input
							type="number"
							name="estAmount"
							ref={register({
								required: "Type an estimated amount",
								pattern: {
									value: /[0-9]/,
									message: "Must only contain numbers. This is formatted when displayed."
								}
							})}
						/>
					</Input>
					<InputError name="estAmount" errors={errors} />
				</Form.Field>

				<Form.Field fluid>
					<label>EMD amount</label>
					<Input label="Rs." >
						<Label basic>Rs.</Label>
						<input
							type="number"
							name="emd"
							ref={register({
								required: "Type a EMD amount",
								pattern: {
									value: /[0-9]/,
									message: "Must only contain numbers. This is formatted when displayed."
								}
							})}
						/>
					</Input>
					<InputError name="emd" errors={errors} />
				</Form.Field>
			</Form.Group>

			{/* Name of work textarea */}
			<Form.Field>
				<label>Work description</label>
				<textarea
					placeholder="M/O OF Electrical and Mechanical Installations, AC, water coolers and sliding gate on air side at Integrated Air Cargo Complex at Chennai Airport, Chennai"
					name="description"
					ref={register({
						required: "Type a work description"
					})}
				></textarea>
				<InputError name="description" errors={errors} />
			</Form.Field>

			<Message
				success
				header="Tender added"
				content="You tender was successfully added."
			/>

			<Message
				error
				header="Could not add tender"
				content={errorMessage}
			/>

			<Button loading={loading} primary>Add</Button>
		</Form>
	);
};

const InputError = ({ name, errors }) => {
	const display = !!errors[name];

	if(display)
		return(
			<Label basic color="red" pointing="above" display={!!errors.name}>
				{errors[name].message}
			</Label>
		);

	if(!display)
		return"";
};

export default AddTendersForm;
