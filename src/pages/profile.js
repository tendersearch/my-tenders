import Layout from "../components/Layout/Layout";
import auth from "../util/Auth";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { useRouter } from "next/router";

// Semantic ui
import { Form, Input, Button, Label, Message } from "semantic-ui-react";

// Styles
import styles from "../styles/profile.module.css";
import { useState, useEffect } from "react";

const EDIT_PROFILE = gql`
mutation($company: String, $phone: String, $keywords: String, $userId: ID!){
	partialUpdateUser(id: $userId, data: {
		company: $company
		phone: $phone
		keywords: $keywords
	}){
		company
		phone
		keywords
	}
}
`;

export default function ProfilePage(){
	const user = auth.user;

	return(
		<Layout
			title="Your profile"
		>
			<Profile user={user} />
		</Layout>
	);
}

const Profile = ({ user }) => {
	const{ register, handleSubmit, errors } = useForm();
	const[editProfile] = useMutation(EDIT_PROFILE);
	const[error, setError] = useState(false);
	const[success, setSuccess] = useState(false);
	const[loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect( () => {
		if(!user.loggedIn) router.replace("/");
	});

	if(!user.loggedIn) return"";

	const onSubmit = async data => {
		setLoading(true);
		const status = await editProfile({ variables: {
			company: data.company,
			phone: data.phone,
			keywords: data.keywords,
			userId: user._id
		} });
		setLoading(false);

		if(status.errors) setError(true);
		if(!status.errors){
			const newData = status.data.partialUpdateUser;
			const newUser = { ...user, ...newData };

			auth.user = newUser;
			setSuccess(true);
		}
	};

	return(
		<div className={styles.container}>
			<Form onSubmit={handleSubmit(onSubmit)} success={success} error={error}>
				<Message
					error
					header="Could not update profile"
					content="Your profile could not be updated, try again later."
				/>
				<Message
					success
					header="Profile update!"
					content="Your profile was successfully updated."
				/>
				<Form.Field>
					<label>Name</label>
					<Input disabled>
						<input
							type="text"
							name="name"
							defaultValue={user.name}
						/>
					</Input>
				</Form.Field>

				<Form.Field>
					<label>Company name</label>
					<Input>
						<input
							type="text"
							name="company"
							defaultValue={user.company}
							ref={register}
							placeholder="Company name"
						/>
					</Input>
				</Form.Field>

				<Form.Field>
					<label>Phone number</label>
					<Input>
						<input
							type="text"
							name="phone"
							defaultValue={user.phone}
							ref={register({
								pattern: {
									value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g,
									message: "Not a valid phone number"
								}
							})}
							placeholder="Phone number"
						/>
					</Input>
					{
						errors.phone
							? (
								<Label
									basic
									color="red"
									pointing
								>
									{errors.phone.message}
								</Label>
							)
							: ""
					}

				</Form.Field>

				<Form.Field>
					<label>Keywords</label>
					<textarea
						rows="2"
						name="keywords"
						defaultValue={user.keywords}
						ref={register}
						placeholder="garden, road, maintenance"
					></textarea>
				</Form.Field>

				<Button primary loading={loading}>Save</Button>
			</Form>
		</div>
	);
};

Profile.propTypes = {
	user: PropTypes.object
};
