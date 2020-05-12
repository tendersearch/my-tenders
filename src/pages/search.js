import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import Result from "../components/Result/Result";
import styles from "../styles/search.module.css";
import algoliasearch from "algoliasearch/lite";

const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_SEARCH_KEY);
const index = client.initIndex("tender");

export default function Search(){
	const{ query: { q } } = useRouter();
	const[query] = useState(q);
	const[results, setResults] = useState([]);

	useEffect( () => {
		const doSearch = async () => {
			const search = await index.search(query, {
				filters: `end_timestamp > ${Date.now()}`
			});

			setResults(search.hits);
		};

		doSearch();
	}, [query]);

	return(
		<Layout
			title={`Tender search: ${q}`}
		>
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
		</Layout>
	);
}
