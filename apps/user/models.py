
from datetime import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser


class UserProfile(AbstractUser):
    """
    用户描述
    """
    id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=10, blank=True, verbose_name="姓名")
    nick_name = models.CharField(max_length=10, blank=True, verbose_name="昵称")
    birthday = models.DateField(null=True, blank=True, verbose_name="出生日期")
    mobile = models.CharField(max_length=11, blank=True, verbose_name="电话")
    gender = models.IntegerField(default=0, blank=True, null=True, verbose_name="性别")  # 1男 2女 0未知
    email = models.CharField(max_length=50, blank=True, verbose_name="邮箱")
    individuality_signature = models.TextField()  # 个性签名
    avatar = models.ImageField(verbose_name="头像")
    created_time = models.DateTimeField(default=datetime.now)
    status = models.IntegerField(default=1)  # 账号状态, 0:禁用  1:启用

    class Meta:
        verbose_name = "用户"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class UserLevel(models.Model):
    """
    用户等级
    """
    id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=50, verbose_name="等级称号")
    desc = models.CharField(max_length=100, blank=True, verbose_name='描述')
    label = models.ImageField(blank=True, verbose_name='图标')
    created_time = models.DateTimeField(default=datetime.now)
    min_score = models.IntegerField(default=0, verbose_name="最小经验值")
    max_score = models.IntegerField(default=0, verbose_name="最大经验值")

    class Meta:
        verbose_name = "用户等级"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.name


class UserToLevel:
    """
    用户与等级对应表
    """
    id = models.CharField(max_length=32, primary_key=True)
    user_id = models.CharField(max_length=32, verbose_name="用户id")
    level_id = models.CharField(max_length=32, verbose_name="等级id")

    class Meta:
        verbose_name = "用户等级对应表"
        verbose_name_plural = verbose_name

    def __str__(self):
        return '用户等级'


# 点赞
class Zan(models.Model):
    id = models.CharField(max_length=32, null=False, blank=False, primary_key=True)  # 赞同id
    type = models.CharField(max_length=2, verbose_name='赞同类别')  # 赞同的类型，贴子1，评论2
    created_time = models.DateTimeField(verbose_name='创建的赞同时间')  # 创建的赞同时间
    last_modify_time = models.DateTimeField(verbose_name='最后的赞同/取消赞同时间')  # 最后的赞同/取消赞同时间
    to_id = models.CharField(max_length=32, verbose_name='赞同的对象的id')  # 赞同的对象的id
    status = models.CharField(max_length=2, verbose_name='赞同状态')  # 赞同状态，0： 取消，1：赞同
    author_id = models.CharField(max_length=32, verbose_name='赞同类别')  # 点赞人的id

    class Meta:
        verbose_name = "赞同"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.title


# 评论
class Comment(models.Model):
    id = models.CharField(max_length=32, primary_key=True)  # 评论id
    article_id = models.CharField(max_length=20)  # 评论所属的帖子id
    created_time = models.DateTimeField()  # 评论创建的时间
    content_text = models.CharField(max_length=500)  # 评论的内容
    content_img = models.CharField(max_length=500)  # 评论的图片地址
    status = models.CharField(max_length=2, verbose_name="评论状态")  # 0：删除，1：有效
    zan_number = models.CharField(max_length=10, verbose_name="点赞数量")
    from_id = models.CharField(max_length=32)  # 评论者的id
    to_id = models.CharField(max_length=32)  # 评论对象的id，如果直接评论的是文章，则为空d

    class Meta:
        verbose_name = "评论"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.title



class VerifyCode(models.Model):
    """
    短信验证码
    """
    code = models.CharField(max_length=10, verbose_name="验证码")
    mobile = models.CharField(max_length=11, verbose_name="电话")
    created_time = models.DateTimeField(default=datetime.now, verbose_name="添加时间")

    class Meta:
        verbose_name = "短信验证码"
        verbose_name_plural = verbose_name

    def __str__(self):
        return self.code
