# Generated by Django 5.0.1 on 2024-03-09 21:45

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_alter_turista_codimagenperfil'),
    ]

    operations = [
        migrations.AlterField(
            model_name='turista',
            name='codImagenPerfil',
            field=models.OneToOneField(default=4, on_delete=django.db.models.deletion.CASCADE, to='users.imagenperfil'),
        ),
    ]
