import { useEffect, useState } from "react";
import useSWR from "swr";

// Util
import get from "../../util/get";

// Components
import Layout from "../../components/Layout/Layout";

// Styles
import styles from "../../styles/admin.module.css";

export default function admin(){
	const[result, setResult] = useState(null);
	const{ data, error } = useSWR("/api/login", get)

	useEffect( () => {
		const fetchResult = async () => {
			const res = await data.json();

			setResult(res);
		}

		if(data)
			fetchResult()
	}, [data])

	return(
		<Layout
			title="Admin panel"
		>
			<div className={styles.container}>
				<h1>Admin panel</h1>
				<section>
					<h2>Add Tenders</h2>
					{result ? result.result : ""}
				</section>

			</div>
		</Layout>
	)
}