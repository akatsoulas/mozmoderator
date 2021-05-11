# Generated by Django 3.1 on 2021-04-27 13:56

from django.conf import settings
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('moderate', '0011_auto_20210415_0911'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='body',
            field=models.TextField(blank=True, default='', help_text='Optional: Helpful links, additional information - Markdown supported'),
        ),
        migrations.AddField(
            model_name='event',
            name='is_moderated',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='event',
            name='moderators',
            field=models.ManyToManyField(related_name='events_moderated', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='question',
            name='is_accepted',
            field=models.BooleanField(default=None),
        ),
        migrations.AddField(
            model_name='question',
            name='submitter_contact_info',
            field=models.EmailField(blank=True, default='', max_length=512),
        ),
        migrations.AlterField(
            model_name='question',
            name='answer',
            field=models.TextField(blank=True, default='', validators=[django.core.validators.MaxLengthValidator(768)]),
        ),
        migrations.AlterField(
            model_name='question',
            name='question',
            field=models.TextField(validators=[django.core.validators.MaxLengthValidator(768), django.core.validators.MinLengthValidator(10)]),
        ),
    ]