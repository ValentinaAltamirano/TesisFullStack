# Generated by Django 5.0.1 on 2024-03-08 21:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0007_alter_establecimiento_descripcion_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='turista',
            name='codImagenPerfil',
            field=models.OneToOneField(default=4, on_delete=django.db.models.deletion.CASCADE, to='users.imagenperfil'),
        ),
    ]
