from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers
import json
from .models import Todo
from .models import member
from django.template import loader
from django.middleware.csrf import get_token

def get_csrf_token(request):
    return JsonResponse({"csrfToken": get_token(request)})

class YourAPIView(APIView):
    def post(self, request):
        data = json.loads(request.body)
        return Response({"message": "Data received successfully"}, status=200)

def index(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        return JsonResponse({"message": "Data received successfully"}, status=200)
    if request.method == 'GET':
        return HttpResponse("Hello this is from index")

def get_user(request):
    name = request.GET['name'] 
    id = request.GET['id'] 
    return HttpResponse("Name:{} UserID:{}".format(name, id))
    

def members(request):
    mymembers = member.objects.all().values()
    print(mymembers)
    template = loader.get_template('index.html')
    context = {
        'mymembers': mymembers,
    }
    return HttpResponse(template.render(context, request))

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import Todo

# @csrf_exempt
def set_todo(request, id):
    if request.method == 'POST':
        data = json.loads(request.body)
        todo = Todo.objects.create(
            title=data['title'],
            description=data['description'],
            user_id=id
        )
        # Directly return the created todo as a JSON object
        return JsonResponse({
            'id': todo.id,
            'title': todo.title,
            'description': todo.description,
            'completed': todo.completed,  # if applicable
            'user_id': todo.user_id
        })


def get_todo(request,id):
    if request.method == 'GET':
        todos = Todo.objects.filter(user_id=id).values()
        return JsonResponse(list(todos), safe=False)
    
def updateCompleted(request,userid,taskid):
    if request.method == 'PATCH':
        data = json.loads(request.body)
        Todo.objects.filter(id=taskid, user_id = userid).update(completed=data['completed'])
        return HttpResponse("Task updated successfully")