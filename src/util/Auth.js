import client from "./client";
import gql from "graphql-tag";
import Cookie from "js-cookie";
import EventEmitter from "events";
import gapi from "./gapi";
import Router from "next/router";

const CURRENT_USER = gql`
query{
	currentUser{
		name
		email
		phone
		keywords
		company
		userId
		role
		_id
		savedTenders{
			data{
				_id
			}
		}
	}
}
`;

const CREATE_ADMIN_USER = gql`
mutation{
	createAdminUser
}
`;

const LOGOUT = gql`
mutation{
	logout
}
`;

class Auth extends EventEmitter{
	constructor(){
		super();

		this.google = null;
		this.adminScopes = "https://www.googleapis.com/auth/spreadsheets.readonly https://www.googleapis.com/auth/drive.readonly";
		this.on("ready", () => { console.log("Auth client ready"); });

		this.init();
	}

	async init(){
		if(typeof window === "undefined") return;

		if(typeof gapi === "undefined")
			return setTimeout(this.init, 300);

		await gapi.load("auth2", async () => {
			this.google = await gapi.auth2.init({
				client_id: process.env.GOOGLE_CLIENT_ID,
				redirect_uri: "https://tendersearch.in"
			});

			this.googleUser = this.google.currentUser.get();
			this.emit("ready");
		});
	}

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
			const secret = Cookie.get("secret");

			if(!secret) user.loggedIn = false;

			return user;
		}
	}

	set googleUser(user){
		if(typeof window === "undefined") return;

		localStorage.setItem("googleUser", JSON.stringify(user));
	}

	get googleUser(){
		if(typeof window === "undefined") return{};

		const stored = localStorage.getItem("googleUser");

		if(stored)
			return JSON.parse(stored);
		else
			return{};
	}

	async refresh(){
		const refreshedUser = await this.google.currentUser.get().reloadAuthResponse();
		this.googleUser = refreshedUser;
		return refreshedUser;
	}

	async triggerSignup(){
		const googleUser = await this.google.signIn({
			prompt: "select_account"
		});
		this.googleUser = googleUser;
		return this.signIn(googleUser);
	}

	async getUser(){
		const secret = Cookie.get("secret");
		if(!secret) return{ loggedIn: false };

		const currentUserResult = await client.query({ query: CURRENT_USER });
		const{ data } = currentUserResult;
		const currentUser = data ? data.currentUser : {};
		currentUser.loggedIn = !!secret;
		currentUser.secret = secret;

		this.user = currentUser || { loggedIn: false };
		return currentUser;
	}

	async signOut(){
		await this.google.signOut();
		this.google.currentUser.get().disconnect();
		const fSignedOut = await this.logout();
		console.log(fSignedOut);

		Router.reload();
	}

	async signIn(data){
		const{ access_token: accessToken, id_token: tokenId } = data.tc;
		return this.login({ accessToken, tokenId });
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

		console.log(result);
		if(result.secret) Cookie.set("secret", result.secret);
		else throw new Error("Could not login");

		return this.getUser();
	}

	async logout(){
		const{ data } = await client.mutate({ mutation: LOGOUT });
		const wasLoggedOut = data.logout;
		Cookie.remove("secret");

		return wasLoggedOut;
	}

	async becomeAdmin(){
		const createAdminUserResult = await client.mutate({ mutation: CREATE_ADMIN_USER });
		const{ data } = createAdminUserResult;
		const status = data.createAdminUser;

		await this.getUser();
		return status;
	}
}

const auth = new Auth();

export default auth;
