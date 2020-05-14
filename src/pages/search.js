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
	const{ query: { q = "", dep = "", org = "", city = "", state = "" }, push } = useRouter();
	const[query, setQuery] = useState(q);
	const[results, setResults] = useState([]);
	const[loading, setLoading] = useState(true);

	useEffect( () => {
		const doSearch = async () => {
			setLoading(true);
			const search = await index.search(decodeURIComponent(query), {
				filters: decodeURIComponent(buildFilter({ department: dep, name: org, city, state }))
			});

			console.log(search);
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
			<div className={styles.container}>
				<SearchInput onSubmit={onSearch} />
				{
					loading
						? <Loader active />
						: <Results results={results} />
				}
			</div>

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
					id={result.objectID}
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

function buildFilter(obj){
	let filter = `end_timestamp > ${new Date("2020-01-01").getTime()}`;
	const keys = Object.keys(obj).filter( key => obj[key]);

	const addFilter = keys.map( (cur, idx) => {
		return`${cur}:'${obj[cur]}'`;
	}).join(" AND ");

	if(keys.length > 0) filter += ` AND (${addFilter})`;

	console.log(filter);

	return filter;
}

Results.propTypes = {
	results: PropTypes.array
};
