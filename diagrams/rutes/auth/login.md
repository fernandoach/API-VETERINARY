# rute:
~~~
/auth/login
~~~
# method: 
~~~
POST
~~~
# header Content-Type:
~~~
json
~~~
# body: 
~~~
{ 
  email: string, 
  password: string 
}
~~~
# response success:
~~~
{ 
  accesToken: string, 
  role: 'U' (user) | 'A' (admin) | 'V' (veterinary) 
}
~~~
# reponse error:
~~~
{ 
  message: string
}
~~~
