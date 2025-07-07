import requests

response = requests.post('https://basic-needs-unit-token-zc3p.vercel.app/test/',
                         json={'msg': 'hello!'})

print(response.status_code)
print(response.json())