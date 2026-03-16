from django.contrib import admin

from django.contrib import admin
from .models import Categoria, Produto, Movimentacao

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'sku', 'quantidade_atual', 'categoria')
    search_fields = ('nome', 'sku')

admin.site.register(Categoria)
admin.site.register(Movimentacao)
