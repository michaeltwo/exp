from django.contrib.auth.models import Group
Group.objects.get_or_create(name='Group1')
Group.objects.get_or_create(name='Group2')