import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Login from './Login'

function Auth(props) {
	const [loading, setLoading] = useState(true)
    const [redirect, setRedirect] = useState(false)

    useEffect(() => {
		fetch('/auth/checkToken')
        .then(res => {
          if (res.status === 200) {
            setLoading(false);
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
		  setLoading(false)
		  setRedirect(true)
        });
	}, [])



     if (loading) {
        return null;
      }
      if (redirect) {
        return () => <Login />;
      }
      return props;
    
}

export default Auth;
