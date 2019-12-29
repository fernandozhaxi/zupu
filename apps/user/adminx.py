#!/usr/bin/env python
# encoding: utf-8

import xadmin
from .models import UserLevel, VerifyCode, Zan, Comment


class UserLevelAdmin(object):
    list_display = ['id', 'name', 'desc', 'created_time', 'min_score', 'max_score']
    search_fields = ['name', 'desc']
    list_filter = ['name']


class VerifyCodeAdmin(object):
    list_display = ['code', 'mobile', 'created_time']
    search_fields = ['mobile']
    list_filter = ['mobile']


class ZanAdmin(object):
    list_display = ['id', 'type', 'status', 'author_id', 'created_time']
    search_fields = ['status', 'type', 'author_id']
    list_filter = ['status', 'type']


class CommentAdmin(object):
    list_display = ['id', 'zan_number', 'created_time', 'status', 'article_id']
    search_fields = ['id', 'zan_number', 'status', 'article_id']
    list_filter = ['id', 'zan_number', 'status']


xadmin.site.register(UserLevel, UserLevelAdmin)
xadmin.site.register(Zan, ZanAdmin)
xadmin.site.register(Comment, CommentAdmin)
xadmin.site.register(VerifyCode, VerifyCodeAdmin)
