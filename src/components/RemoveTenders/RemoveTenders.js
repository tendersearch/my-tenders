import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import algoliasearch from "algoliasearch";
import { useDebounce } from "use-debounce";
import { parseDate, parseNumber } from "../../util/result";
import { removeTenders } from "../../util/admin";
import classNames from "classnames";

// Components
import SearchInput from "../Search/Search";
import { Modal, Loader, Message } from "semantic-ui-react";

// Styles
import styles from "./removeTenders.module.css";

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const index = client.initIndex("tender");

export default function RemoveTenders(){
	const[value, setValue] = useState("");
	const[results, setResults] = useState([]);
	const[debouncedValue] = useDebounce(value, 1000);
	const[loading, setLoading] = useState(false);
	const[showModal, setShowModal] = useState(false);
	const[success, setSuccess] = useState(false);
	const[error, setError] = useState(false);

	const onSearch = async () => {
		const result = await index.search(value);
		const{ hits } = result;

		setResults(hits);
	};

	const onRemoveTender = async e => {
		e.preventDefault();

		const form = e.target;
		const tenderIds = [...form].filter( input => input.checked).map( input => input.value);

		setLoading(true);
		const response = await removeTenders(tenderIds);
		setLoading(false);
		setShowModal(true);

		if(response.ok) {
			setSuccess(true);
			setResults(results.filter( result => !tenderIds.includes(result.objectID)));
		};
		if(!response.ok) setError(true);

		setTimeout( () => {
			setError(false);
			setSuccess(false);
			setShowModal(false);
		}, 4000);
	};

	useEffect( () => {
		if(debouncedValue)
			onSearch();
	}, [debouncedValue]);

	return(
		<div className={styles.container}>
			<SearchInput onChange={setValue} onSubmit={onSearch} className={styles.search} />
			<Results results={results} onRemove={onRemoveTender} loading={loading} />
			<Loader active={loading} inline={false} size="massive" className={styles.loader} />
			<Modal open={showModal}>
				<Modal.Content>
					<Message success={success} error={error}>
						{
							(success || error)
								? (
									success
										? "The tenders have been removed."
										: (error ? "There was an error removing the tenders. Try again later." : "")
								)
								: null
						}
					</Message>
				</Modal.Content>
			</Modal>
		</div>
	);
}

const Results = ({ results, onRemove, loading }) => {
	const[selection, setSelection] = useState([]);
	const showDelete = selection.length > 0;

	function onChange(e){
		const value = e.target.value;
		const checked = e.target.checked;

		if(checked && !selection.includes(value)) setSelection([...selection, value]);
		if(!checked && selection.includes(value)) setSelection([...selection.filter( item => item !== value)]);
	}

	async function handleRemove(e){
		await onRemove(e);

		setSelection([]);
	}

	return(
		<form onSubmit={handleRemove}>
			{results.map( result => (
				<Result result={result} key={result.objectID} onChange={onChange} />
			))}
			{showDelete ? <button className={styles.deleteButton} disabled={loading}>Delete selected</button> : null}
		</form>
	);
};

const Result = ({ result, onChange }) => (
	<div className={styles.result}>
		<label className={styles.wrapper}>
			<div className={styles.row}>
				<input type="checkbox" onChange={onChange} value={result.objectID} />
				<span className={styles.name}>{result.name}</span>
			</div>
			<p className={styles.description}>{result.description}</p>
			<div className={classNames(styles.row, styles.between)}>
				<div className={styles.column}>
					<span>
						Opening date: <span className={styles.value}>{parseDate(result.openingDate)}</span>
					</span>
					<span>
						End date: <span className={styles.value}>{parseDate(result.endDate)}</span>
					</span>
				</div>
				<div className={styles.column}>
					<span>
						Tender fees: <span className={styles.value}>Rs. {parseNumber(result.estAmount)}</span>
					</span>
					<span>
						EMD: <span className={styles.value}>Rs. {parseNumber(result.emd)}</span>
					</span>
				</div>
			</div>
		</label>
	</div>
);

Results.propTypes = {
	results: PropTypes.array,
	onRemove: PropTypes.func,
	loading: PropTypes.bool
};

Result.propTypes = {
	result: PropTypes.object,
	onChange: PropTypes.func
};
