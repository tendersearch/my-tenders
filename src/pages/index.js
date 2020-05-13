import Layout from "../components/Layout/Layout";
import { Dropdown, Button } from "semantic-ui-react";
import { useRouter } from "next/router";
import faunadb from "faunadb";
import PropTypes from "prop-types";

import styles from "../styles/index.module.css";
import SearchInput from "../components/Search/Search";
import { useState } from "react";

export default function Home({ filters }){
	const[org, setOrg] = useState("");
	const[dep, setDep] = useState("");
	const[city, setCity] = useState("");
	const[state, setState] = useState("");
	const[query, setQuery] = useState("");

	const router = useRouter();

	const departments = filters.departments.data;
	const cities = filters.cities.data;
	const organisations = filters.organisations.data;
	const states = filters.states.data;

	const createFilter = item => ({ key: item, value: item, text: item });

	const onSearch = (value) => {
		router.push(`/search?q=${value}`);
	};

	const onChangeQuery = (value) => {
		setQuery(value);
	};

	const onFilterApply = () => {
		router.push(`/search?q=${query}&org=${org}&dep=${dep}&city=${city}&state=${state}`);
	};

	const onOrgChange = (e, { value }) => {
		setOrg(value);
	};

	const onDepChange = (e, { value }) => {
		setDep(value);
	};

	const onCityChange = (e, { value }) => {
		setCity(value);
	};

	const onStateChange = (e, { value }) => {
		setState(value);
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
							onChange={onOrgChange}
							className={styles.dropdown}
							placeholder="Organization"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "", text: "All" },
								...organisations.map(createFilter)
							]}
						/>
						<Dropdown
							onChange={onDepChange}
							className={styles.dropdown}
							placeholder="Department"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "", text: "All" },
								...departments.map(createFilter)
							]}
						/>
						<Dropdown
							onChange={onStateChange}
							className={styles.dropdown}
							placeholder="State"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "", text: "All" },
								...states.map(createFilter)
							]}
						/>
						<Dropdown
							onChange={onCityChange}
							className={styles.dropdown}
							placeholder="City"
							fluid
							search
							selection
							options={[
								{ key: "all", value: "", text: "All" },
								...cities.map(createFilter)
							]}
						/>

						<Button onClick={onFilterApply} content="Find" primary className={styles.submit} />
					</div>
				</div>

				<div className={styles.divider}>
					<div className={styles.line}></div>
					<span className={styles.text}>OR</span>
					<div className={styles.line}></div>
				</div>

				<SearchInput onSubmit={onSearch} onChange={onChangeQuery} />
			</div>
		</Layout>
	);
}

export async function getStaticProps(context){
	const client = new faunadb.Client({
		secret: process.env.FAUNADB_SERVER_KEY
	});
	const q = faunadb.query;

	const result = await client.query(
		{
			cities: q.Paginate(q.Distinct(q.Match(q.Index("allTenderCity")))),
			departments: q.Paginate(q.Distinct(q.Match(q.Index("allTenderDepartment")))),
			states: q.Paginate(q.Distinct(q.Match(q.Index("allTenderState")))),
			organisations: q.Paginate(q.Distinct(q.Match(q.Index("allTenderName"))))
		}
	);

	return{
		props: { filters: result }
	};
}

Home.propTypes = {
	filters: PropTypes.object
};
