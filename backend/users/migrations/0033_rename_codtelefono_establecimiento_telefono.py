# Generated by Django 5.0.1 on 2024-02-07 06:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0032_alter_establecimiento_codtelefono'),
    ]

    operations = [
        migrations.RenameField(
            model_name='establecimiento',
            old_name='codTelefono',
            new_name='telefono',
        ),
    ]