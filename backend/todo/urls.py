from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path("set_user_todo/<int:id>",views.set_todo, name = "set_todo"),
    path("get_user_todo/<int:id>",views.get_todo,name = "get_todo"),
    path('markUserTaskCompleted/<int:userid>/<int:taskid>',views.updateCompleted,name="taskcompleted"),
    path('user/',views.get_user, name='get_user'),
    path("get-csrf-token/", views.get_csrf_token, name="get_csrf_token"),
]