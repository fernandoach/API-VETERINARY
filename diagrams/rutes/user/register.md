# rute: 
~~~
/user/register
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
  firstname: string, 
  lastname: string, 
  gender: 'M' (Male), 'F' (Female), 'O' (Other),  
  birthday: string ('yyyy-mm-dd'), 
  dni: string[8], 
  telephone: string[9],
  email: string, 
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
