import { useContext, useState, useEffect } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import moment from "moment";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import auth from "../../util/Auth";
import { Icon } from "semantic-ui-react";

// Context
import UserContext from "../../contexts/userContext";

// Styles
import styles from "./result.module.css";

// Icons
import LocationIcon from "../../images/icons/location.svg";
import SaveIcon from "../../images/icons/saved.svg";

const SAVE_TENDER = gql`
mutation($tenderId: [ID], $userId: ID!){
	partialUpdateUser(
		id: $userId, 
		data: {
			savedTenders: { connect: $tenderId }
		}
	){
		_id
		savedTenders{
			data{
				_id
			}
		}
	}
}
`;

const REMOVE_TENDER = gql`
mutation($tenderId: [ID], $userId: ID!){
	partialUpdateUser(
		id: $userId,
		data: {
			savedTenders: { disconnect: $tenderId }
		}
	){
		_id
		savedTenders{
			data{
				_id
			}
		}
	}
}
`;

export default function Result({ name, city, state, description,
	endDate, openingDate, estAmount, emd, id, url, fromSaved = false }){
	const userContext = useContext(UserContext);
	const[user, setUser] = useState(userContext);
	const[saveTender] = useMutation(SAVE_TENDER);
	const[removeTender] = useMutation(REMOVE_TENDER);

	useEffect( () => {
		setUser(userContext);
	}, [userContext]);

	const savedTenders = user.savedTenders ? user.savedTenders.data.map( item => item._id) : [];
	const[isSaved, setIsSaved] = useState(savedTenders.includes(id));

	const onSaveTender = async () => {
		if(isSaved) return;

		if(!user.loggedIn) {
			const newUser = await auth.triggerSignup();
			if(!newUser) return;

			const status = await saveTender({ variables: { tenderId: id, userId: newUser._id } });
			setUser(newUser);
			handleStatus(status);

			return;
		}

		const status = await saveTender({ variables: { tenderId: id, userId: user._id } });
		handleStatus(status);
	};

	const onRemoveTender = async () => {
		const status = await removeTender({ variables: { tenderId: id, userId: user._id } });
		handleStatus(status);
	};

	const handleStatus = (status) => {
		const partialUpdateUser = status.data.partialUpdateUser;
		const newSavedTenders = partialUpdateUser.savedTenders;
		const newUser = { ...user, savedTenders: newSavedTenders };
		const newIsSaved = newSavedTenders.data.includes(id);

		if(status.errors)
			setIsSaved(newIsSaved);
		else if(!status.errors)
			setIsSaved(true);

		// This will update the state in Layout and cause everything to rerender.
		// There is probably a better solution, but I am under the pressure of time,
		// Which means I don't have time actually come up with and implement that solution.
		auth.user = newUser;
	};

	return(
		<div className={styles.result}>
			{
				isSaved && fromSaved
					? <RemoveTender onClick={onRemoveTender} />
					: <SaveTender onClick={onSaveTender} isSaved={isSaved} />
			}
			<div className={styles.nameAndLocation}>
				<a target="_blank" rel="noopener noreferrer" href={url} className={styles.name}>{name}</a>
				<div className={styles.location}>
					<LocationIcon className={styles.icon} />
					<span className={styles.text}>{city}, {state}.</span>
				</div>
			</div>
			<p className={styles.description}>
				{description}
			</p>
			<div className={styles.meta}>
				<div className={classNames(styles.endDate, styles.metaInfo)}>
					<span className={styles.label}>End Date</span>
					<span className={styles.value}>{parseDate(endDate)}</span>
				</div>
				<div className={classNames(styles.openingDate, styles.metaInfo)}>
					<span className={styles.label}>Opening Date</span>
					<span className={styles.value}>{parseDate(openingDate)}</span>
				</div>
				<div className={classNames(styles.estAmount, styles.metaInfo)}>
					<span className={styles.label}>Estimated Amount</span>
					<span className={styles.value}>Rs. {parseNumber(estAmount)}</span>
				</div>
				<div className={classNames(styles.emdAmount, styles.metaInfo)}>
					<span className={styles.label}>EMD Amount</span>
					<span className={styles.value}>Rs. {parseNumber(emd)}</span>
				</div>
			</div>
		</div>
	);
}

function RemoveTender({ onClick }){
	return(
		<div className={styles.save}>
			<button className={styles.close} onClick={onClick}>
				<Icon name="close" color="red" />
			Remove
			</button>
		</div>

	);
}

function SaveTender({ onClick, isSaved }){
	const classes = classNames({
		[styles.save]: true,
		[styles.isSaved]: isSaved
	});

	return(
		<button className={classes} onClick={onClick}>
			<SaveIcon />
			<span>{isSaved ? "saved" : "save"}</span>
		</button>
	);
}

function parseDate(date){
	let dateStr = date;

	if(typeof date === "object") dateStr = date["@ts"];

	return moment(dateStr).format("DD-MMM-YYYY hh:mm A");
}

function parseNumber(numStr){
	return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(numStr);
}

Result.propTypes = {
	name: PropTypes.string,
	city: PropTypes.string,
	state: PropTypes.string,
	description: PropTypes.string,
	endDate: PropTypes.any,
	openingDate: PropTypes.any,
	estAmount: PropTypes.number,
	emd: PropTypes.number,
	id: PropTypes.string,
	fromSaved: PropTypes.bool,
	url: PropTypes.string
};

RemoveTender.propTypes = {
	onClick: PropTypes.func
};

SaveTender.propTypes = {
	onClick: PropTypes.func,
	isSaved: PropTypes.bool
};
