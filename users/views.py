from django.shortcuts import render
from django.shortcuts import render, redirect
from django.http import StreamingHttpResponse
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.sessions.models import Session
import os
import json
import os
from .models import Customer
from django.contrib.auth import authenticate , login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
import re
# Create your views here.

def home(request):
    if request.method =='POST':
        data = request.POST
        name = data['name']
        email = data['email']
        message = data['message']

        Customer.objects.create(name=name, email=email, message = message)
        messages.success(request , ("Message was sent succesfully !"))
        return render(request, 'landingpage.html')
    return render(request, 'landingpage.html')
# User Authenticaton

class CustomRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']


def register_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if not email.endswith('@gmail.com'):
            messages.error(request, 'Email must be a @gmail.com address.')

        elif not re.match(r'^[a-zA-Z0-9_]+$', username):
            messages.error(request, 'Username can only contain alphanumeric characters and underscores.')
        elif username.isdigit():
            messages.error(request, 'Username cannot be only numbers.')

        elif len(password1) < 8 or not re.search(r'[A-Z]', password1) or not re.search(r'[a-z]', password1) \
                or not re.search(r'[0-9]', password1) or not re.search(r'[!@#$%^&*(),.?":{}|<>]', password1):
            messages.error(request, 'Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.')

        elif password1 != password2:
            messages.error(request, 'Passwords do not match.')

        elif User.objects.filter(username=username).exists():
            messages.error(request, 'Username is already taken.')

        # Check if email is already registered
        elif User.objects.filter(email=email).exists():
            messages.error(request, 'Email is already registered.')

        else:
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()
            messages.success(request, 'Account created successfully. Please log in.')
            return redirect('login')

    return render(request, 'login.html')



def login_user(request):
    if request.method  == 'POST':
        username = request.POST.get("username","")
        password = request.POST.get("password","")
        user = authenticate(request, username=username, password=password)
        if user is not None:
                login(request, user)
                messages.success(request, 'Logged in successfully.')
                return redirect('home')
        else:
                messages.success(request , ("There was error Logging In, Try Again!"))
    return render(request,'login.html')

def logout_user(request):
    logout(request)
    messages.success(request , ("You were Logged Out!"))
    return redirect('home')
