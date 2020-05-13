import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import styles from "../styles/search.module.css";
import algoliasearch from "algoliasearch/lite";

// Components
import SearchInput from "../components/Search/Search";
import Layout from "../components/Layout/Layout";
import Result from "../components/Result/Result";
import { Loader } from "semantic-ui-react";

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const index = client.initIndex("tender");

export default function Search(){
	const{ query: { q }, push } = useRouter();
	const[query, setQuery] = useState(q);
	const[results, setResults] = useState([]);
	const[loading, setLoading] = useState(true);

	useEffect( () => {
		const doSearch = async () => {
			setLoading(true);
			const search = await index.search(query, {
				filters: `end_timestamp > ${Date.now()}`
			});

			setResults(search.hits);
			setLoading(false);
		};

		doSearch();
	}, [query]);

	const onSearch = (value) => {
		const href = `/search?q=${value}`;
		push(href);
		setQuery(value);
	};

	return(
		<Layout
			title={`Tender search: ${q}`}
		>
			<SearchInput onSubmit={onSearch} />
			{
				loading
					? <Loader active />
					: <Results results={results} />
			}
		</Layout>
	);
}

function Results({ results }){
	return(
		<div className={styles.results}>
			{results.map( result => (
				<Result
					key={result.objectID}
					name={result.name}
					description={result.description}
					city={result.city}
					state={result.state}
					emd={result.emd}
					estAmount={result.estAmount}
					endDate={result.endDate}
					openingDate={result.openingDate}
				/>
			))}

			{
				results.length === 0
					? <span className={styles.empty}>No active tenders where found with that query.</span>
					: ""
			}
		</div>
	);
}

Results.propTypes = {
	results: PropTypes.array
};
