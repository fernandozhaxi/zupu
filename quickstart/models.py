from django.db import models

# Create your models here.
import datetime, os
from django.db import models
from django.contrib.postgres.fields import JSONField
from django.utils import timezone
from django.contrib.auth.models import User
import reversion



def get_upload_path(instance, filename):
    print("Instance: " + str(instance.id))
    return os.path.join("uploaded_media", str(instance.id), filename)

class Contributor(models.Model):
    name = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name.username

class Person(models.Model):
    GENDERS = (('male','男'),('female','女'))
    FirstName = models.CharField(max_length=8, unique=False, verbose_name='姓')
    surName = models.CharField(max_length=8, unique=False, verbose_name='名')
    beiName = models.CharField(max_length=8, unique=False, null=True, blank=True, verbose_name='辈')
    ziName = models.CharField(max_length=8, unique=False, null=True, blank=True, verbose_name='字')
    haoName = models.CharField(max_length=8, unique=False, null=True, blank=True, verbose_name='号')
    father = models.ForeignKey(
        'self',
        related_name="childOfFather",
        on_delete=models.SET_NULL,
        verbose_name="Father",
        null=True,
        blank=True,
    )
    mother = models.ForeignKey(
        'self',
        related_name="childOfMother",
        on_delete=models.SET_NULL,
        verbose_name="Mother",
        null=True,
        blank=True,
    )
    spouse = models.ForeignKey(
        'self',
        related_name="wifeHusband",
        on_delete=models.SET_NULL,
        verbose_name="WifeHusband",
        null=True,
        blank=True,
    )
    sibling = models.ManyToManyField(
        'self',
        related_name="sibs",
        verbose_name="Sibling",
        blank=True,
    )
    #child = models.ManyToManyField(
    #    'self',
    #    related_name="kids",
    #    verbose_name="Kids",
    #    blank=True,
    #)

    index = models.IntegerField(default=1)
    birthDay = models.DateField("Birthday", null=True, blank=True)
    deadDay = models.DateField("Death Day", null=True, blank=True)
    lastUpdatedDate = models.DateField("Last Updated Date", null=True, blank=True)
    gender = models.CharField(
        max_length=8, unique=False, verbose_name='性别', choices=GENDERS, default='男'
    )
    contributors = models.ManyToManyField(
        User, related_name="contributors", verbose_name="Contributors"
    )

    def __str__(self):
        return self.surName + self.FirstName

    class Meta:
        ordering = ["id"]
        verbose_name_plural = "Person"

class Attachment(models.Model):
    person = models.ForeignKey(Person, related_name="attachments", on_delete=models.CASCADE)
    filepath = models.FileField(upload_to=get_upload_path, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)

class Photo(models.Model):
    person = models.ForeignKey(Person, related_name="photos", on_delete=models.CASCADE)
    filepath = models.FileField(upload_to=get_upload_path, null=True, blank=True)
    description = models.CharField(max_length=255, null=True, blank=True)

# class Category(models.Model):
#     category = models.CharField(max_length=32, unique=True)
# 
#     def __str__(self):
#         return self.category
# 
#     class Meta:
#         verbose_name_plural = "Categories"
# 
# 
# class Project(models.Model):
#     project = models.CharField(max_length=32, unique=True)
# 
#     def __str__(self):
#         return self.project
# 
# 
# class Priority(models.Model):
#     priority = models.CharField(max_length=32, unique=True)
# 
#     def __str__(self):
#         return self.priority
# 
#     class Meta:
#         verbose_name_plural = "Priorities"
# 
# 
# class Discipline(models.Model):
#     discipline = models.CharField(max_length=32, unique=True)
# 
#     def __str__(self):
#         return self.discipline
# 
# 
# class Scope(models.Model):
#     scope = models.CharField(max_length=32, unique=True)
# 
#     def __str__(self):
#         return self.scope
# 
# 
# class Process(models.Model):
#     process = models.CharField(max_length=32, unique=True)
# 
#     def __str__(self):
#         return self.process
# 
#     class Meta:
#         verbose_name_plural = "Processes"
# 
# 
# class Status(models.Model):
#     status = models.CharField(max_length=32, unique=True)
# 
#     def __str__(self):
#         return self.status
# 
#     class Meta:
#         verbose_name_plural = "Statuses"
# 
# 
# @reversion.register(follow=["projects"])
# class Idea(models.Model):
#     class Meta:
#         ordering = ["id"]
# 
#     discipline = models.ForeignKey(
#         Discipline, on_delete=models.CASCADE, verbose_name="Discipline"
#     )
# 
#     name = models.CharField(max_length=30, verbose_name="Name")
# 
#     scope = models.ForeignKey(Scope, on_delete=models.CASCADE, verbose_name="Scope")
# 
#     category = models.ForeignKey(
#         Category, on_delete=models.CASCADE, verbose_name="Category"
#     )
# 
#     _type = models.CharField(max_length=10, verbose_name="Type", null=True, blank=True)
# 
#     process_nodes = models.ForeignKey(
#         Process, on_delete=models.CASCADE, verbose_name="Process"
#     )
# 
#     summary = models.CharField("High-Level Description", max_length=200)
# 
#     # Target Projects -> ProjectPriority
# 
#     motivation = models.CharField(
#         max_length=30, verbose_name="Motivation", null=True, blank=True
#     )
# 
#     priority = models.ForeignKey(
#         Priority, on_delete=models.CASCADE, verbose_name="Priority"
#     )
# 
#     status = models.ForeignKey(Status, on_delete=models.CASCADE, verbose_name="Status")
# 
#     status_comment = models.CharField(
#         "Status Comment", max_length=30, null=True, blank=True
#     )
# 
#     resources = models.CharField("Resources", max_length=100, null=True, blank=True)
# 
#     link_page = models.CharField("IP link", max_length=150, null=True, blank=True)
# 
#     owner = models.ForeignKey(
#         User,
#         related_name="owns",
#         on_delete=models.CASCADE,
#         verbose_name="Owner",
#         null=True,
#         blank=True,
#     )
# 
#     reviewers = models.ManyToManyField(
#         User, related_name="reviews", verbose_name="Reviewers"
#     )
# 
#     dm_sponsor = models.ForeignKey(
#         User,
#         on_delete=models.SET_NULL,
#         null=True,
#         blank=True,
#         related_name="sponsors",
#         verbose_name="DM Sponsor",
#     )
# 
#     start_date = models.DateField("Start Date", null=True, blank=True)
# 
#     requirement_review = models.DateField("Requirement Review", null=True, blank=True)
# 
#     complete_date = models.DateField("Complete Date", null=True, blank=True)
# 
#     proposer = models.ForeignKey(
#         User,
#         on_delete=models.CASCADE,
#         related_name="proposals",
#         verbose_name="Proposer",
#     )
# 
#     date_added = models.DateField("Date Added", auto_now_add=True)
# 
#     external_link = models.TextField("External Link(s)", blank=True, null=True)
# 
#     description = models.TextField("Additional Notes", blank=True, null=True)
# 
#     # Diagrams -> Diagram
# 
#     # Attachments -> Attachment
# 
#     def __str__(self):
#         return self.name
# 
# 
# class PriorityColor(models.Model):
#     description = models.CharField("Description", max_length=10, unique=True)
#     foreground = models.CharField("Foreground", max_length=10)
#     background = models.CharField("Background", max_length=10)
# 
# 
# @reversion.register()
# class ProjectPriority(models.Model):
#     idea = models.ForeignKey(Idea, related_name="projects", on_delete=models.CASCADE)
#     project = models.ForeignKey(
#         Project, related_name="priorities", on_delete=models.CASCADE
#     )
#     priority = models.ForeignKey(PriorityColor, on_delete=models.CASCADE)
# 
#     class Meta:
#         unique_together = (("idea", "project", "priority"),)
#         verbose_name_plural = "Project Priorities"
# 
# 
# class Attachment(models.Model):
#     idea = models.ForeignKey(Idea, related_name="attachments", on_delete=models.CASCADE)
#     filepath = models.FileField(upload_to=get_upload_path, null=True, blank=True)
#     description = models.CharField(max_length=255, null=True, blank=True)
# 
# 
# class Diagram(models.Model):
#     idea = models.ForeignKey(Idea, related_name="diagrams", on_delete=models.CASCADE)
#     filepath = models.FileField(upload_to=get_upload_path, null=True, blank=True)
#     description = models.CharField(max_length=255, null=True, blank=True)
# 
# 
# class Comment(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="User")
#     idea = models.ForeignKey(
#         Idea, related_name="comments", on_delete=models.CASCADE, verbose_name="Idea"
#     )
#     text = models.TextField("Comment")
# 
#     class Meta:
#         ordering = ["id"]
# 
# 
# class ColumnSettings(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     def my_default():
#         default=[
#             "discipline",
#             "name",
#             "scope",
#             "category",
#             "_type",
#             "process_nodes",
#             "summary",
#             "projects",
#             "motivation",
#             "priority",
#             "status",
#         ]
#         return default
#     fields = JSONField(my_default)
