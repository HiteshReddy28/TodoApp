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
from dotenv import load_dotenv
import os
from together import Together
load_dotenv()
Together_Api_Key = os.getenv("Together_Api_Key")


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
    
def getAiSuggestions(request):
    if request.method == 'POST':
        client = Together()
        # print(request.body)
        data = json.loads(request.body)
        # print(data)
        prompt = """
#### Role:
You are a TODO list manager.

#### Context:
You will be given a topic. Based on the topic, create a comprehensive TODO list that covers everything needed to understand or complete it thoroughly.

#### Output:
Return an **array of JSON objects**, where each object represents a task with the following fields:
- title: <short title of the task>
- description: <brief description of the task> (keep it concise and small)

⚠️ Do not include any explanations, comments, or markdown — only return the raw JSON array.
"""
        messages = [{"role":"system", "content":prompt},{"role": "user", "content": data["ai_prompt"]}]
        response = client.chat.completions.create(
            model="meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
            messages= messages,
            max_tokens=500,
            temperature=0.2,
        )
        response = response.choices[0].message.content
        print(response)
        suggestions_list = json.loads(response)
        
        # suggestions_list = [
        #     {"title": "Research Django ORM", "description": "Understand models and database queries."},
        #     {"title": "Build a basic Django API", "description": "Create views and URLs for a simple endpoint."},
        #     {"title": "Implement authentication", "description": "Add user login/logout functionality."},
        # ]
        return JsonResponse(
            {"suggested_tasks": suggestions_list}, # This is the dictionary your frontend expects
            status=200 # HTTP 200 OK for success
        )