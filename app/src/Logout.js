import React, { useEffect } from 'react';
import Login from './Login'

function Logout() {
  
  useEffect(() => {
	fetch('/auth/logout', {
      method: 'POST',
	  body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
		window.location.assign("/")
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
      alert('Error logging in please try again');
    });
  }, [])


  return ("")
  
}

export default Logout;