"""zupu URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.contrib import admin
from django.conf import settings
from django.conf.urls import url
from django.contrib import admin
from django.urls import include, path
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib.auth import views as auth_views
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
import quickstart.views as qViews

router = routers.DefaultRouter()
router.register(r'users', qViews.UserViewSet)
router.register(r'groups', qViews.GroupViewSet)
router.register(r'persons', qViews.PersonViewSet)

urlpatterns = [
    # Wire up our API using automatic URL routing.
    # Additionally, we include login URLs for the browsable API.
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    path("admin", admin.site.urls),
    path("login", auth_views.auth_login),
    path("logout", auth_views.auth_logout),
    url(r'^admin/', admin.site.urls),
    url(r'index', TemplateView.as_view(template_name="index.html")),
]
