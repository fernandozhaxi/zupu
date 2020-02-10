from django.contrib.auth.models import User, Group
from rest_framework import serializers
from .models import Person, Family


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']

class PersonSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

#class RelativeSerializer(serializers.HyperlinkedModelSerializer):
#    person = serializers.PrimaryKeyRelatedField(
#        queryset=Person.objects.all()
#    )
#
class FamilySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Family
        fields = '__all__'
        #fields = ('name','family')

    #family = serializers.PrimaryKeyRelatedField(
    #    queryset=Family.objects.all()
    #)