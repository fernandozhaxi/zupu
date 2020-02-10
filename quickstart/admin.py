from django.contrib import admin
from .models  import  Contributor, Person, Family

# Register your models here.
admin.site.register(Contributor)
admin.site.register(Person)
admin.site.register(Family)