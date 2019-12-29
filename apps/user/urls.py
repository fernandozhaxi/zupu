from django.shortcuts import HttpResponse
from django.conf.urls import url


def getuserinfo (request):
    return HttpResponse('userinfo')


urlpatterns = [
    url('getUserInfo', getuserinfo),
]
