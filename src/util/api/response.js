export default function response(status, data, res){
	res.status = status;
	res.setHeader("Content-Type", "application/json");
	res.end(JSON.stringify(data));
}
