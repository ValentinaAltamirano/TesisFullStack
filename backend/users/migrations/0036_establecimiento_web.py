# Generated by Django 5.0.1 on 2024-02-07 18:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0035_establecimiento_descripcion'),
    ]

    operations = [
        migrations.AddField(
            model_name='establecimiento',
            name='web',
            field=models.TextField(default='', max_length=255),
        ),
    ]