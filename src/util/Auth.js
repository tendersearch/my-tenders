import client from "./client";
import gql from "graphql-tag";
import Cookie from "js-cookie";
import EventEmitter from "events";

const CURRENT_USER = gql`
query{
	currentUser{
		name
		email
		userId
		role
	}
}
`;

const CREATE_ADMIN_USER = gql`
mutation{
	createAdminUser
}
`;

class Auth extends EventEmitter{
	set user(user){
		if(typeof window === "undefined") return;

		localStorage.setItem("user", JSON.stringify(user));
		this.emit("user_change", user);
	}

	get user(){
		if(typeof window === "undefined") return{ loggedIn: false };

		const stored = localStorage.getItem("user");

		if(!stored) {
			return{ loggedIn: false };
		}else{
			const user = JSON.parse(stored);

			return user;
		}
	}

	async getUser(){
		const currentUserResult = await client.query({ query: CURRENT_USER });
		const{ data } = currentUserResult;
		const currentUser = data.currentUser;
		currentUser.loggedIn = true;
		currentUser.secret = Cookie.get("secret");

		console.log(currentUser);
		this.user = currentUser || { loggedIn: false };
		return currentUser;
	}

	async login(data){
		const{ accessToken, tokenId } = data;

		const response = await fetch("/api/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				accessToken,
				tokenId
			})
		});

		const result = await response.json();

		if(result.secret) Cookie.set("secret", result.secret);
		else throw new Error("Could not login");

		await this.getUser();
	}

	async becomeAdmin(){
		const createAdminUserResult = await client.mutate({ mutation: CREATE_ADMIN_USER });
		const{ data, errors } = createAdminUserResult;
		const status = data.createAdminUser;

		return status;
	}
}

const auth = new Auth();

export default auth;
