var express = require('express');
var router = express.Router();
const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const fetch = require('node-fetch');
const jwtDecode = require('jwt-decode');

let refresh_token = "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjYTViYWYyMS1jNzRiLTRkMGEtYjJhMy04NmEyYWU5MTZkYWMifQ.eyJpYXQiOjE1OTQ3OTQ4MjEsImp0aSI6IjlhYmUzNTZjLWFhZjMtNDQ3NS1hOTI1LTg2ZmU0MDFhYTg2ZiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9hdXRoL3JlYWxtcy9tYXN0ZXIiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjgwODAvYXV0aC9yZWFsbXMvbWFzdGVyIiwic3ViIjoiZjA1ZDgxZGMtNTE3OC00ZWRjLWIwYWItNTZiMGRmMDc5NWZhIiwidHlwIjoiT2ZmbGluZSIsImF6cCI6InJlYWN0LWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJmN2U0YjM0MC0xNjdiLTRiMWItOTFkYy03NTM5MjA4NzBiMmUiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIGVtYWlsIn0.pzGEu4Wor68zer_DX83OCiAkCGPBXtKEW5te08r4-0A"

/* caller must provide refresh token as auth bearer to verify identity */
router.get('/', async function(req, res) {
	
	let caller_token = req.headers.authorization.substring(7)
	
	let atok = await getAccessToken(caller_token);
	
	let decoded = jwtDecode(atok);
	
	let userQuery = await fetch('http://localhost:8080/auth/admin/realms/testrealm/users?username=' + decoded.preferred_username, { headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + atok
		}});
	let userData = await userQuery.json()
	
	if(userData.length !== 0){
		let keys = userData[0].attributes.apikey[0].split(',');
		
		res.status(200).json(keys)
	} else {
		res.status(401).send()
	}
});

// generate cli key
router.post('/', async function (req, res) {
	let key = "abcde123"
	let user = "testuser"
	
	let atok = await getAccessToken();
	
	let userQuery = await fetch('http://localhost:8080/auth/admin/realms/testrealm/users?username=' + user, { headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + atok
		}});
	let userData = await userQuery.json()
	
	let keys = userData[0].attributes.apikey[0].split(',');
	
	keys.push("newkey");
	
	let uid = userData[0].id
	
	let body = { attributes: { apikey: keys.toString() }}
	
	fetch('http://localhost:8080/auth/admin/realms/testrealm/users/' + uid, {
		method: 'PUT',
		body: JSON.stringify(body),
		headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + atok
		}
	})
	.then(res.status(200).send())
})

// check token
router.post('/check', async function (req, res) {
	let tokenUT = "lol"
	let userUT = "testuser"
	
	let atok = await getAccessToken();
	
	let userQuery = await fetch('http://localhost:8080/auth/admin/realms/testrealm/users?username=' + userUT, { headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + atok
		}});
	let userData = await userQuery.json()

	let keys = userData[0].attributes.apikey[0].split(',');
	
	if(keys.indexOf(tokenUT) !== -1){
		res.status(200).send()
	} else {
		res.status(401).send()
	}
})

/* utilities */

let getAccessToken = (given_refresh_token) => {
  return new Promise((resolve, reject) => {
    const formData = new URLSearchParams()
	
	formData.append("client_id", "react-client")
	formData.append("grant_type", "refresh_token")
	formData.append("refresh_token", given_refresh_token || refresh_token)
	
	fetch('http://localhost:8080/auth/realms/master/protocol/openid-connect/token', {
		method: 'POST',
		body: formData
	})
	.then(r => r.json())
	.then(data => {
		resolve(data.access_token)
	})
  })
}

module.exports = router;
