# -*- coding:utf-8 -*-
from rest_framework import serializers

from category.ssh.ssh_operation import SSHOperation
import json
from .models import *
from jsonsearch import JsonSearch
from account.models import User

class IdcSerializer(serializers.ModelSerializer):

    class Meta:
        model = Idc
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        racks = instance.rack_set.values('id', 'name')
        ret['racks'] = racks
        return ret


class RackSerializer(serializers.ModelSerializer):

    class Meta:
        model = Rack
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        servers = instance.server_set.values('id', 'name')
        ret['servers'] = servers
        idc = instance.idc
        region = instance.region
        ret['region_name'] = region.name if region else None
        ret['idc_name'] = idc.name if idc else None
        #print(ret)
        return ret
        
class RegionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Region
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        ret['region_name'] = ret['name']
        
        #print(ret)
        return ret


class ServerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Server
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)

        rack = instance.rack
        if rack:
            idc = rack.idc_id
            rack_name = rack.name
            idc_name = rack.idc.name if rack.idc else None
        else:
            rack_name = idc = idc_name = None
        ret['idc'] = idc
        ret['idc_name'] = idc_name
        ret['users'] = instance.users.values('id', 'username')
        #ret['usernames'] = instance.users.values('username')
        usernames = instance.users.values("id","username")
        l = []
        for a in usernames:
            l.append(a)
        js = json.dumps({"value": l}, ensure_ascii=False)
        jsondata = JsonSearch(object=js, mode='s')

        username_json = jsondata.search_all_value(key="username")
        usernames = tuple(username_json)

        ret["usernames"] = usernames
        ret['ssh_user'] = {'id': instance.ssh_user.pk, 'name': instance.ssh_user.name} if instance.ssh_user else {'id': None, 'name': None}
        ret['projects'] = instance.project_set.values('id', 'name')
        region = instance.region
        ret['region_name'] = region.name if region else None
        ret['rack_name'] = rack_name
        
        print(ret)
        return ret


class ServerDetailSerializer(ServerSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['cron_content'] = SSHOperation(instance.ssh_ip, instance.ssh_port, instance.ssh_user.name).fetch_cron_content(instance.ssh_user.name)
        return ret


class ServerListSerializer(ServerSerializer):
    def create(self, validated_data):
        host = validated_data['ssh_ip']
        user = validated_data['ssh_user']
        port = validated_data['ssh_port']
        ssh_operation = SSHOperation(host, port, user.name)
        validated_data = ssh_operation.fetch_host_info(validated_data, validated_data['ssh_user'].name)
        return super().create(validated_data)


class SSHUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = SSHUser
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['servers'] = instance.server_set.values('id', 'name')
        return ret


class BusinessLineSerializer(serializers.ModelSerializer):

    class Meta:
        model = BusinessLine
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['users'] = instance.users.values('id', 'username')
        ret['projects'] = instance.project_set.values('id', 'name')
        print(ret)
        return ret


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['businesses'] = instance.businesses.values('id', 'name')
        ret['users'] = instance.users.values('id', 'username')
        ret['servers'] = instance.servers.values('id', 'name', 'ssh_ip')
        return ret
