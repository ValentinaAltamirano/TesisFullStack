# Generated by Django 5.0.1 on 2024-03-08 18:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_alter_turista_codimagenperfil'),
    ]

    operations = [
        migrations.AlterField(
            model_name='establecimiento',
            name='descripcion',
            field=models.TextField(default='Sin descripcion', max_length=500),
        ),
        migrations.AlterField(
            model_name='turista',
            name='codImagenPerfil',
            field=models.OneToOneField(default=4, on_delete=django.db.models.deletion.CASCADE, to='users.imagenperfil'),
        ),
    ]
