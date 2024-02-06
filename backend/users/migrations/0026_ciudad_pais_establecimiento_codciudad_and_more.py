# Generated by Django 5.0.1 on 2024-02-06 15:46

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0025_alter_redsocial_nombre'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ciudad',
            fields=[
                ('codCiudad', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Pais',
            fields=[
                ('codPais', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
            ],
        ),
        migrations.AddField(
            model_name='establecimiento',
            name='codCiudad',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='users.ciudad'),
        ),
        migrations.AddField(
            model_name='ciudad',
            name='codProvincia',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.pais'),
        ),
        migrations.CreateModel(
            name='Provincia',
            fields=[
                ('codProvincia', models.AutoField(primary_key=True, serialize=False)),
                ('nombre', models.CharField(max_length=255)),
                ('codPais', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.pais')),
            ],
        ),
    ]