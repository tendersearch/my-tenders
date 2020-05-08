import { useRouter } from "next/router";
import Layout from "../components/Layout/Layout";
import Result from "../components/Result/Result";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import styles from "../styles/search.module.css";

const SEARCH_TENDER = gql`
query($query: String, $size: Int, $after: String){
	searchTenders( query: $query, size: $size, after: $after){
		name
		description
		state
		city
		endDate
		openingDate
		emd
		url
		estAmount
	}
}
`;

export default function Search(){
	const{ query: { q } } = useRouter();
	const{ loading, error, data } = useQuery(SEARCH_TENDER, {
		variables: {
			query: q,
			size: 50,
			after: "0"
		}
	});

	console.log(data);

	return(
		<Layout
			title={`Tender search: ${q}`}
		>
			<div className={styles.results}>
				<Result />
				<Result />
				<Result />
				<Result />
				<Result />
				<Result />
			</div>
		</Layout>
	);
}
