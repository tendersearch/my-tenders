import Layout from "../components/Layout/Layout";
import auth from "../util/Auth";
import PropTypes from "prop-types";
import { Form, Input, Button } from "semantic-ui-react";
import { useForm } from "react-hook-form";

// Styles
import styles from "../styles/profile.module.css";

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
	const{ register, handleSubmit } = useForm();

	const onSubmit = data => {
		console.log(data);
	};

	return(
		<div className={styles.container}>
			<Form onSubmit={handleSubmit(onSubmit)}>
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
							ref={register({
								pattern: {
									value: /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/g,
									message: "Not a valid phone number"
								}
							})}
							placeholder="Phone number"
						/>
					</Input>
				</Form.Field>

				<Form.Field>
					<label>Keywords</label>
					<textarea
						rows="2"
						name="keywords"
						ref={register}
						placeholder="garden, road, maintenance"
					></textarea>
				</Form.Field>

				<Button primary>Save</Button>
			</Form>
		</div>
	);
};

Profile.propTypes = {
	user: PropTypes.object
};
