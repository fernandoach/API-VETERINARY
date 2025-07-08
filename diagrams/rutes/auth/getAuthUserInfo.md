# rute:
~~~
/auth/getAuthUserInfo
~~~
# method: 
~~~
GET
~~~
# header authorization:
~~~
accessToken (/auth/login)
~~~
# header Content-Type:
~~~
json
~~~
# response success: 
~~~ 
{ 
  userInfo: { 
    idUser: string (uuid), 
    firstname: string, 
    lastname: string, 
    email: string,
    gender: 'M' (Male), 'F' (Female), 'O' (Other), 
    birthday: string ('yyyy-mm-dd'), 
    telephone: string[9], 
    role: 'U' (user) | 'A' (admin) | 'V' (veterinary) 
  } 
}
~~~
# reponse error:
~~~
{ message: string }
~~~