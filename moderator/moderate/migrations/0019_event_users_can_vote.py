# Generated by Django 4.1.13 on 2023-12-21 10:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("moderate", "0018_alter_question_is_accepted"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="users_can_vote",
            field=models.BooleanField(default=True),
        ),
    ]
