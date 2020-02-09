
from django.contrib.auth.models import User, Group
from django.db.models import Q
from django.http import JsonResponse
from rest_framework import viewsets
from quickstart.serializers import *
from quickstart.models import  *
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from IPython import embed

def get_father_q( pk):
    q = Q(childOfFather=pk) 
    return q

def get_mother_q( pk):
    q = Q(childOfMother=pk) 
    return q

def get_parents_q( pk):
    q = get_father_q(pk) | get_mother_q(pk)
    return q

def get_siblings_q( pk):
    q = Q(sibling=pk) 
    return q
    
def get_children_q( pk):
    q = Q(mother=pk) | Q(father=pk) 
    return q


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class PersonViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Persons to be viewed or edited.
    """
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

class RelativesList(APIView):
    """
    List all relatives for a given Person
    """
    def get(self, request, pk):
        p = get_parents_q(pk)
        s = get_siblings_q(pk)
        c = get_children_q(pk)
        q = p | s | c
        relatives = Person.objects.filter(q).distinct()
        serializer = PersonSerializer(instance=relatives, context={'request': request}, many=True)
        #serializer = serializers.PrimaryKeyRelatedField(queryset=p, many=True)
        #data = serializer.get_queryset().data
        return Response(serializer.data)

class FatherList(APIView):
    """
    List father for a given Person
    Although it doesn't too much sense to have multiple fathers, it's safe to keep data 
    structure consistent to simplify the whole flow
    """
    def get(self, request, pk):
        q = get_father_q(pk)
        fathers = Person.objects.filter(q).distinct()
        serializer = PersonSerializer(instance=fathers, context={'request': request}, many=True)
        return Response(serializer.data)

class MotherList(APIView):
    """
    List mother for a given Person
    Although it doesn't too much sense to have multiple mothers, it's safe to keep data 
    structure consistent to simplify the whole flow
    """
    def get(self, request, pk):
        q = get_mother_q(pk)
        mothers = Person.objects.filter(q).distinct()
        serializer = PersonSerializer(instance=mothers, context={'request': request}, many=True)
        return Response(serializer.data)

def get_person(pk):
    try:
        return Person.objects.get(pk=pk)
    except Person.DoesNotExist:
        raise Http404
