import {useRouter} from "next/router";
import Layout from "../components/Layout/Layout"; 
import Result from "../components/Result/Result";

import styles from "../styles/search.module.css";

export default function Search(){
	const { query: { q } } = useRouter();

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
	)
}