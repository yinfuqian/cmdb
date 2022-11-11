# -*- coding: utf-8 -*-
from django.conf.urls import include
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

from .views import *

# register的可选参数 base_name: 用来生成urls名字，如果viewset中没有包含queryset, base_name一定要有

router = DefaultRouter()
router.register(r'histories', HistoryViewSet)

urlpatterns = [
    url(r'^', include(router.urls))
]
