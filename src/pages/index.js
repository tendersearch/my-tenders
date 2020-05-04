import Layout from "../components/Layout/Layout";
import { Dropdown, Button, Input, Icon } from "semantic-ui-react";
import { useRouter } from "next/router";

import styles from "../styles/index.module.css";

export default function Home() {
	const router = useRouter();

	const onKeyUp = (e) => {
		const value = e.target.value;

		if(e.key === "Enter")
			router.push(`/search?q=${value}`)
	}

  return (
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

			<div className={styles.search}>
				<Input fluid icon placeholder="search..." onKeyUp={onKeyUp}>
					<input />
					<Icon name="search" />
				</Input>
			</div>
		</div>
	</Layout>
  )
}
