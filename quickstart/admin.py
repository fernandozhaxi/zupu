from django.contrib import admin
from .models  import  Contributor, Person

# Register your models here.
admin.site.register(Contributor)
admin.site.register(Person)