from django.http import JsonResponse
from django.middleware.csrf import get_token
from .models import User
import json
from django.contrib.auth.hashers import check_password, make_password

def get_tokens(request):
    return JsonResponse({"csrfToken": get_token(request)})

# def login(request):
#     request.session.set_expiry(600)
#     if request.method == 'POST':
#         try:
#             data = json.loads(request.body.decode('utf-8'))
#             username = data.get('username')
#             password = data.get('password')
#             user = User.objects.get(username=username)
#             if password == user.password:
#                 return JsonResponse({'message': 'Login successful','id': user.id})
#             else:
#                 return JsonResponse({'message': 'Invalid credentials'}, status=401)
#         except User.DoesNotExist:
#             return JsonResponse({'message': 'User not found'}, status=404)
#         except json.JSONDecodeError:
#             return JsonResponse({'error': 'Invalid JSON'}, status=400)

#     return JsonResponse({"message": "Hello from login"})

def login(request):
    request.session.set_expiry(600)
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username')
            password = data.get('password')

            user = User.objects.get(username=username)

            # Use Django's built-in password check
            if check_password(password, user.password):
                return JsonResponse({'message': 'Login successful', 'id': user.id})
            else:
                return JsonResponse({'message': 'Invalid credentials'}, status=401)

        except User.DoesNotExist:
            return JsonResponse({'message': 'User not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

    return JsonResponse({"message": "Hello from login"})

def userNameExists(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('userName')

            if User.objects.filter(username=username).exists():
                return JsonResponse({'message': 'Username already exists'}, status=200)
            else:
                return JsonResponse({'message': 'Username is available'}, status=200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        return JsonResponse({"message": "Hello from get"})
    
def signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('userName')
            email = data.get('email')
            password = make_password(data.get('password'))
            print(data)
            user= User.objects.create(username=username, password=password, email = email)
            return JsonResponse({'message': 'Signup Success', "userId": user.pk })
        except:
            return JsonResponse({'error': 'Signup failed'}, status=400)
