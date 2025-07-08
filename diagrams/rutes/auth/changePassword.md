# rute: 
~~~
/auth/changePassword
~~~
# method:
~~~
PUT
~~~
# header authorization:
~~~
accessToken (/auth/login)
~~~
# header Content-Type:
~~~
json
~~~
# body:
~~~
{
  password: string,
  repassword: string
}
~~~
# response success: 
~~~
{ message: string }
~~~
# reponse error:
~~~
{ message: string }
~~~
