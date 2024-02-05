# Generated by Django 5.0.1 on 2024-02-05 01:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0012_establecimientoxredsocial_url'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('codCategoria', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='alojamiento',
            name='codCategoria',
            field=models.ForeignKey( on_delete=django.db.models.deletion.CASCADE, to='users.categoria'),
        ),
    ]
