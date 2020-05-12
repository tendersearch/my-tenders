import Layout from "../components/Layout/Layout";
import { Dropdown, Button } from "semantic-ui-react";
import { useRouter } from "next/router";

import styles from "../styles/index.module.css";
import Search from "../components/Search/Search";

export default function Home(){
	const router = useRouter();

	const onSearch = (value) => {
		router.push(`/search?q=${value}`);
	};

	return(
		<Layout
			title="My Tenders"
			description="Find tenders"
		>
			<div className={styles.contentWrapper}>
				<div className={styles.container}>
					<div className={styles.wrapper}>
						<Dropdown
							className={styles.dropdown}
							placeholder="Organization"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "all", text: "All" },
								{ key: "Airport Authority of India", value: "Airport Authority of India", text: "Airport Authority of India" }
							]}
						/>
						<Dropdown
							className={styles.dropdown}
							placeholder="Department"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "all", text: "All" },
								{ key: "Airport Authority of India", value: "Airport Authority of India", text: "Airport Authority of India" }
							]}
						/>
						<Dropdown
							className={styles.dropdown}
							placeholder="State"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "all", text: "All" },
								{ key: "Airport Authority of India", value: "Airport Authority of India", text: "Airport Authority of India" }
							]}
						/>
						<Dropdown
							className={styles.dropdown}
							placeholder="City"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "all", text: "All" },
								{ key: "Airport Authority of India", value: "Airport Authority of India", text: "Airport Authority of India" }
							]}
						/>

						<Button content="Find" primary className={styles.submit} />
					</div>
				</div>

				<div className={styles.divider}>
					<div className={styles.line}></div>
					<span className={styles.text}>OR</span>
					<div className={styles.line}></div>
				</div>

				<Search onSubmit={onSearch} />
			</div>
		</Layout>
	);
}
