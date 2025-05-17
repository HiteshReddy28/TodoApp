from django.urls import path
from . import views

urlpatterns = [
    path('login', views.login, name='login'),
    path('userNameExists', views.userNameExists, name="signup"),
    path('get_token', views.get_tokens, name = "Token"),
    path('signup', views.signup, name='signup'),
    # path('logout', views.logout, name='logout'),
]